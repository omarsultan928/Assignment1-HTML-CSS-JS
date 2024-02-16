const express = require('express');
const { dbClient } = require('./db');
const userRouter = require('./users/userHandler');
const leaveRouter = require('./leaves/leaveHandler');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./auth/passport');
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
dbClient.connect((err)=>{
    if(err)console.log(`Error in DB ${err.message}`);
    else console.log('Postgres DB has been setup successfully');
});

app.get('/login',async(req,res)=>{
    try {
        const {userId,password} = req.body;
        const { rows } = await dbClient.query(`SELECT * FROM users WHERE userid=$1`,[userId]);
        if(rows[0]&&rows[0].password===password)
        {
            const payload = { userId: userId };
            const token = jwt.sign(payload,"secret", {expiresIn: '1d'});
            res.status(200).send({
                success: true,
                message: 'Login Successful',
                token: 'Bearer ' + token,
            });
        }
        else
        {
            res.status(400).send('Incorrect Password');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})


app.use('/users',passport.authenticate('jwt',{session: false}),userRouter);
app.use('/leaves',passport.authenticate('jwt',{session: false}),leaveRouter);
app.listen(port,(err)=>{
    if(err)console.log(err.message);
    else console.log(`server is running on http://localhost:${port}`);
});