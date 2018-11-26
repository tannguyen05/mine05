// const express = require('express');
// const router = express.Router();
// const users = require('../models/user.js');
// const bcrypt = require('bcrypt');
// const passport = require('passport');

// router.get("/", (req, res)=>{
// 	let mess = req.flash('loginMessage');
// 	let signupMess = req.flash('signupSuccess');
// 	res.render("user/signup", {
// 		Title: "Sign up",
// 		loginMessage: mess,
// 		signupMess: signupMess,
// 		errors: []
// 	})
// })
// router.post("/", (req, res)=>{

// })

// router.get("/account", (req, res)=>{
// 	let signupMess = req.flash('signFail');
// 	let err = req.flash('register-errors');
// 	res.render("user/account", {
// 		Title: "New account",
// 		signupMess: signupMess,
// 		errors: err
// 	})
// })

// router.post("/account", (req, res)=>{
// 	req.checkBody('name', 'Invalid name').notEmpty();
// 	req.checkBody('email', 'Type a email').isEmail();
// 	req.checkBody('username', 'Invalid username').notEmpty();
// 	req.checkBody('password', 'Invalid password').notEmpty();
// 	req.checkBody('password2', 'Password do not match').equals(req.body.password);

// 	let name = req.body.name;
// 	let email = req.body.email;
// 	let username = req.body.username;
// 	let password = req.body.password;
// 	let errors = req.validationErrors();
// 	if(errors){
// 		req.flash('register-errors', errors);
// 		res.redirect('/signup/account');
// 	}else{
// 		users.findOne({username: username}, (err, user)=>{
// 			if(err) res.status(500).send(err);
// 			if(user){
// 				req.flash('signFail', "Username exists");
// 				res.redirect('/signup/account');
// 			}else{
// 				bcrypt.genSalt(10, function(err, salt) {
// 					bcrypt.hash(password, salt, function(err, hash) {
// 				        password = hash;
// 						users.create({
// 							name: name,
// 							email: email,
// 							username: username,
// 							password: password,
// 							admin: 0
// 						}, (err)=>{
// 							if(err) return res.status(500).send(err);
// 							req.flash('signSuccess', 'Register successful!')
// 							res.redirect('/signup');
// 						})
// 				    });
// 				});
// 			}
// 		})
// 	}
// })












//  module.exports = router;