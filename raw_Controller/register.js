const bcrypt = require('bcrypt');
const knex = require('../db/dbnaja');
const jwt = require('jsonwebtoken');
require('dotenv').config();




// regis + hash 
async function regis(req, res) {
  try {
    console.log('Request Body:', req.body)
    const user = await knex('infous')                                             //validate
        .where({ email: req.body.email })
        .first();
    if (user) {
        return res.status(400).send({ error: 'Email has in database.' });            
    }
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ error: 'Email and password are required fields.' });            
      }
    const emailformat = /^\S+@\S+\.\S+$/; 
      if (!emailformat.test(req.body.email)) {
        return res.status(400).send({ error: 'Invalid email format.' });
      }
    
    const hash1 = await bcrypt.hash(req.body.password, 10)
    const x = await knex('infous').insert({
      email: req.body.email,
      password: hash1,
      permis: "user",
      profile: req.file ? req.file.location : null
    }).returning('*')

    const token = jwt.sign(
      { x: x, email: req.body.email },
      process.env.secret,
        {
            expiresIn: "1h"
        }
    )

    await knex('infous')
      .where({ id: x[0].id })
      .update({ token: token })
    x[0].token = token;
    res.send({ rows: x });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'regis error' });
  }
}


module.exports = regis;
