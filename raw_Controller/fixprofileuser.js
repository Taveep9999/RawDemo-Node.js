const bcrypt = require('bcrypt');
const knex = require('../db/dbnaja');
const jwt = require('jsonwebtoken');
const DDelete = require('./download_delete')
require('dotenv').config();

async function update(req, res) {
    try {
    const {username,name,lastname,address} = req.body
    const oldemail = req.user.email;
    const updateemail = req.body.newemail || oldemail;

    //profile 
    if (req.file) {
        const a1 = await knex('infous')
            .where({ email: req.user.email });
            const userProfile = a1[0].profile;
            if ((userProfile === null || userProfile === undefined) || (userProfile && userProfile.length < 10)) {
                const user16 = await knex('infous')
                    .where({ email: req.user.email })
                    .update({
                        profile: req.file.location,
                    })
                    .returning('*');  
            }else{
            const oldprofile = userProfile.split('/').pop();                
            const filename = oldprofile
            await DDelete.DDelete(req,res,filename) 
            const user16 = await knex('infous')
                    .where({ email: req.user.email })
                    .update({
                profile: req.file.location,
            })
            .returning('*');
        }}
        //change email
        if (req.body.newemail){
            const user9 = await knex('infous')
            .select('email')
            .where({ email: req.body.newemail });
            if (user9.length > 0) {
                return res.status(400).send('Email has in the db');
            }
            const emailformat = /^\S+@\S+\.\S+$/; 
            if (!emailformat.test(req.body.newemail)){
                return res.status(400).send({ error: 'Invalid email format.' })
        }
            const user1 = await knex('infous')
            .where({email: req.user.email,})
            .update({
            email: req.body.newemail,
        })
        .returning('*');
    }        

    //information ja
    if (!username || !name || !lastname || !address){
        res.status(400).send("input data naja")
    }
    const qq = await knex('infous')
    .where({
        email: updateemail,
    })
    .update({
        username: username,
        name: name,
        lastname: lastname,
        address: address
    })
    .returning('*')
            
    res.status(200).send({"now information": qq })
    console.log(DDelete.DDelete)

    } catch (error) {
        console.error(error);
        return res.status(500).send('no user in db');
    }
}



async function read(req, res) {
    try {
        const user1 = await knex('infous')
        .where({
            email: req.user.email,
        })
        .first();
        if (user1){
            return res.status(200).send(user1);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('no user in db');
    }
}

async function deleteuser(req, res) {
    try {
    //deleteuser ja
    const x = await knex('infous')
    .where({
        email: req.body.email,
    })
    .delete()
    .returning('*')
    if (x.length > 0){
    return res.status(200).send({"now user": req.body.email,"message": "has been deleted"})
    } else {
    res.status(404).send({"message": "User not found"});
    }

    } catch (error) {
        console.error(error);
        return res.status(500).send('email feild fail');
    }
}



module.exports = {
    read,
    update,
    deleteuser
}
 
