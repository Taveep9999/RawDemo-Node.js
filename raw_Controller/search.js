const knex = require('../db/dbnaja');

//search
async function search(req, res) {
    try {
      const id = req.params.page
      const user = await knex('infous')
      .where({ id })
      .first();
      if (!user) {
        return res.status(400).send({ error: 'NO information' });            
      }
      if (user) {
        return res.status(200).json({ user });
    }
    res.send(`{ ${JSON.stringify(user)} }`);

    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Server Error' });
    }
  }
  
  module.exports = search
  

  