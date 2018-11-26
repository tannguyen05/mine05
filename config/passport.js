const localStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const users = require("../models/user.js");

module.exports = (passport)=>{
	//authentication
	passport.use(new localStrategy({passReqToCallback : true},(req, username, password, done)=>{
		users.findOne({username: username}, (err, user)=>{
			if(err) throw err;
			if(!user){
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			}
			bcrypt.compare(password, user.password, (err, isMatch)=>{
				if(err) throw err;
				if(isMatch)
					return done(null, user);
				else
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			})
		})
	}));

	passport.serializeUser((user, done)=>{
		done(null, user._id);
	});

	passport.deserializeUser((id, done)=>{
		users.findById({id}, (err, user)=>{
			done(err, user);
		})
	});
}