const express = require('express');
const { dbClient } = require('../db');
const { error } = require('console');
const leaveRouter = express.Router();

leaveRouter.get('/',(req,res)=>{
    let leaveList = [];
    dbClient.query(`SELECT * FROM leave;`,(err,response)=>{
        if(err)res.status(400).send(`Error in request : ${err.message}`);
        else
        {
            response.rows.forEach(row=>{
                leaveList.push(row);
            });
            res.status(200).send(leaveList);
        }
    });
})


leaveRouter.post('/',async(req,res)=>{
    let {leaveID, leaveFrom, leaveTo, leaveType, reason, emergencycontact, userid} = req.body;
    userid = parseInt(userid);
    try {
        const response = await dbClient.query(
            `INSERT INTO users (leaveid, leavefrom, leaveto, leavetype, reason, emergencycontact, userid)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [leaveID, leaveFrom, leaveTo, leaveType, reason, emergencycontact, userid]);
        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

leaveRouter.put('/:leaveId',async(req,res)=>{
    try {
        const leaveID = req.params.leaveId;
        const {rows} = await dbClient.query(`SELECT * FROM leave WHERE leaveid=$1`,[leaveID]);
        if(rows.length===0)throw error({message: 'Leave not found!'});
        let leaveObj = {
            leavefrom: req.body.leavefrom?req.body.leavefrom: rows[0].leavefrom,
            leaveto: req.body.leaveto?req.body.leaveto: rows[0].leaveto,
            leavetype: req.body.leavetype?req.body.leavetype: rows[0].leavetype,
            reason: req.body.reason?req.body.reason: rows[0].reason,
            emergencycontact: req.body.emergencycontact?req.body.emergencycontact: rows[0].emergencycontact,
            userid: req.body.userid?req.body.userid: rows[0].userid,
            password: req.body.password?req.body.password: rows[0].password,
        }
        console.log(leaveObj);
        const response = await dbClient.query(`UPDATE leave SET leavefrom=$2, leaveto=$3, leavetype=$4, reason=$5, emergencycontact=$6, userid=$7 WHERE leaveid=$1`,
        [leaveID, leaveObj.leavefrom, leaveObj.leaveto, leaveObj.leavetype, leaveObj.reason, leaveObj.emergencycontact, leaveObj.userid]);
        res.status(200).send(response);

    } catch (error) {
        res.status(400).send(error.message);
    }
})

leaveRouter.get('/:leaveID',(req,res)=>{
    const leaveID = req.params.leaveID;
    const { rows } = dbClient.query(`SELECT * FROM users WHERE leaveid=$1`,[leaveID]);
    if(rows[0])res.status(200).send(rows[0]);
    else res.status(400).send('user not found!');
})

leaveRouter.delete('/:leaveID',(req,res)=>{
    const leaveID = req.params.leaveID;
    const { rows } = dbClient.query(`DELETE FROM users WHERE leaveid=$1`,[leaveID]);
    if(rows[0])res.status(200).send(rows[0]);
    else res.status(400).send('user not found!');
})

module.exports = leaveRouter;