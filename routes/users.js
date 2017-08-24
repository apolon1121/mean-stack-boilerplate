const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken')

const config = require('../config/database');
const User = require('../models/user');


// Register
router.post('/register', (req, res, next) => {

	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});

	User.addUser(newUser, function (err, user) {
		if (err) {
			res.json({ success: false, message: "Failed to register user" });
		} else {
			res.json({ success: true, message: "User Registered" });
		}
	});

});

router.post('/authenticate', (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	User.getUserByEmail(email, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ "success": false, "message": "User not found" });
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;

			if (isMatch) {
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 // 1 week
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						name: user.name,
						email: user.email
					}
				})
			} else {
				return res.json({ "success": false, "message": "Wrong Credentials!" });
			}
		});

	});

});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	res.json({ user: req.user });
});

// Change Profile data
router.put('/edit', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	User.editUser(req.body.user._id, req.body.user, (err, user) => {
		console.log(user);
		if (err) {
			res.json({
				status: false,
				message: 'There was some error. ' + err
			});
		} else {
			res.json({
				status: true,
				user: user
			});
		}
	});
});

module.exports = router;
