const { dbClient } = require('../db');
const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';


passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const { rows } = await dbClient.query(`SELECT * FROM users WHERE userid=$1`,[jwt_payload.userId]);
        if(rows[0]) return done(null,rows[0]);
        else return done(null,false);
    } catch (error) {
        return done(null,error)
    }    
}));