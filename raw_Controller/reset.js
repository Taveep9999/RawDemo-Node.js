const bcrypt = require('bcrypt');
const knex = require('../db/dbnaja');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 1, 
  auth: {
    user: '',
    pass: ''
  }
});

async function reset(req, res) {
  const { email } = req.body
  try {
    const ouser = await knex('infous')
    .where({
      email: req.body.email
    }).first()

    if (!ouser) {
      return res.send("no one")
    }

    const secret = process.env.reset + ouser.password;
    const token = jwt.sign({ email: ouser.email, id: ouser.id }, secret, {
      expiresIn: '5m'
    });

    const resetLink = `http://localhost:3000/reset/${ouser.id}/${token}`

    const mailOptions = {
      from: 'your-email@gmail.com', 
      to: ouser.email,
      subject: 'Password Reset Link',
      text: `Click the following link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error sending reset email")
      }
      console.log('Reset email sent:', info.response)
      res.send("Reset link sent to your email")
    })
    res.send(resetLink)
  } catch (error) {
    console.error(error)
    return res.status(500).send("Internal Server Error")
  }
}

async function re1(req, res) {
    const { id, token } = req.params
    try {
      const ouser = await knex('infous')
      .where({ id })
      .first()
      const secret = process.env.reset + ouser.password
      const decoded = jwt.verify(token, secret)
  
      if (decoded.id != id) {
        return res.status(400).send('Invalid reset link')
      }
      res.send("u can go fot reset")
    } catch (error) {
      console.error('Error in password reset route:', error);
      return res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
  
  async function re2(req, res) {
    const { id, token } = req.params
    const { newPassword } = req.body
  
    try {
      const ouser = await knex('infous')
      .where({ id })
      .first()
      const secret = process.env.reset + ouser.password
      const decoded = jwt.verify(token, secret)
      console.log(id)
      
      if (decoded.id != id) {
        return res.status(400).send('Invalid reset link')
      }
      const hash1 = await bcrypt.hash(req.body.newPassword, 10)
      await knex('infous')
        .where({ id })
        .update({ password: hash1 })
      console.log(id)
      res.send({ 'yournewPassword is': newPassword})
      } catch (error) {
      console.error(error)
      return res.status(500).send('Internal Server Error')
    }
  }
  
  
  module.exports = { reset, re1, re2 }