const express = require('express');
const { dbClient } = require('../db');
const { error } = require('console');
const userRouter = express.Router();

userRouter.get('/',(req,res)=>{
    let userList = [];
    dbClient.query(`SELECT * FROM users;`,(err,response)=>{
        if(err)res.status(400).send(`Error in request : ${err.message}`);
        else
        {
            response.rows.forEach(row=>{
                userList.push(row);
            });
            res.status(200).send(userList);
        }
    });
})


userRouter.post('/',async(req,res)=>{
    let {userid, firstname, lastname, email, designation, dateofbirth, supervisor, password} = req.body;
    userid = parseInt(userid);
    try {
        const response = await dbClient.query(
            `INSERT INTO users (userid, firstname, lastname, email, designation, dateofbirth, supervisor, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [userid, firstname, lastname, email, designation, dateofbirth, supervisor, password]);
        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

userRouter.put('/:userId',async(req,res)=>{
    try {
        const userID = req.params.userId;
        const {rows} = await dbClient.query(`SELECT * FROM users WHERE userid=$1`,[userID]);
        if(rows.length===0)throw error({message: 'User not found!'});
        let userObj = {
            firstName: req.body.firstname?req.body.firstname: rows[0].firstname,
            lastname: req.body.lastname?req.body.lastname: rows[0].lastname,
            email: req.body.email?req.body.email: rows[0].email,
            designation: req.body.designation?req.body.designation: rows[0].designation,
            dateofbirth: req.body.dateofbirth?req.body.dateofbirth: rows[0].dateofbirth,
            supervisor: req.body.supervisor?req.body.supervisor: rows[0].supervisor,
            password: req.body.password?req.body.password: rows[0].password,
        }
        console.log(userObj);
        const response = await dbClient.query(`UPDATE users SET firstname=$2, lastname=$3, email=$4, designation=$5, dateofbirth=$6, supervisor=$7, password=$8 WHERE userid=$1`,
        [userID, userObj.firstName, userObj.lastname, userObj.email, userObj.designation, userObj.dateofbirth, userObj.supervisor, userObj.password]);
        res.status(200).send(response);

    } catch (error) {
        res.status(400).send(error.message);
    }
})

userRouter.get('/:userID',(req,res)=>{
    const userID = req.params.userID;
    const { rows } = dbClient.query(`SELECT * FROM users WHERE userid=$1`,[userID]);
    if(rows[0])res.status(200).send(rows[0]);
    else res.status(400).send('user not found!');
})

userRouter.delete('/:userID',(req,res)=>{
    const userID = req.params.userID;
    const { rows } = dbClient.query(`DELETE FROM users WHERE userid=$1`,[userID]);
    if(rows[0])res.status(200).send(rows[0]);
    else res.status(400).send('user not found!');
})

module.exports = userRouter;