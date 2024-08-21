const bcrypt = require('bcrypt');
const knex = require('../db/dbnaja');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const amqp = require('amqplib');

// login
async function login(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ error: 'Email and password are required fields.' });
    }

    const emailformat = /^\S+@\S+\.\S+$/;
    if (!emailformat.test(req.body.email)) {
      return res.status(400).send({ error: 'Invalid email format.' });
    }

    const user = await knex('infous')
      .where({ email: req.body.email })
      .first();

    if (!user) {
      return res.status(401).send({ error: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ error: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.permis },
      process.env.secret,
      {
        expiresIn: '1h',
      }
    );

    const update = false;
    await knex('infous')
      .where({ id: user.id })
      .update({
        token: token,
        update: update,
      });

    user.token = token;


    res.status(200).send({ token: user.token });
          } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error.' });
  } 
}




module.exports = login;
