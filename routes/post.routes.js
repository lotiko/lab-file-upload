// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const mongoose = require('mongoose');
const fileUploader = require('../configs/cloudinary.config');

const routeGuard = require('../configs/route-guard.config');


// .get() route ==> to display the signup form to users
router.get('/create', routeGuard, (req, res) => res.render('post/create'));
router.post('/create', routeGuard, fileUploader.single('picPath'), (req, res, next) => {
  const { content, picName } = req.body;
  const creatorId = req.session.currentUser._id;
  new Post({
    content: content,
    creatorId: creatorId,
    picPath: req.file.path || "none",
    picName: picName || "no name"
  })
    .save()
    .then(newP => {
      console.log("un new post", newP);
      Post.findById(newP._id)
        .populate('creatorId')
        .then(pFromDb => {
          res.render("post/details", {post: pFromDb})
      }).catch(err => next(err))
      
    })
    .catch(err => next(err));
  
});

// .post() route ==> to process form data
// router.post('/signup', fileUploader.single('image'), (req, res, next) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
//     return;
//   }

//   // make sure passwords are strong:
//   const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
//   if (!regex.test(password)) {
//     res
//       .status(500)
//       .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
//     return;
//   }
// console.log(req.file)
//   bcryptjs
//     .genSalt(saltRounds)
//     .then(salt => bcryptjs.hash(password, salt))
//     .then(hashedPassword => {
//       return User.create({
//         // username: username
//         username,
//         email,
//         // passwordHash => this is the key from the User model
//         //     ^
//         //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
//         passwordHash: hashedPassword,
//         imageUrl: req.file.path
//       });
//     })
//     .then(userFromDB => {
//       console.log('Newly created user is: ', userFromDB);
//       res.redirect('/userProfile');
//     })
//     .catch(error => {
//       if (error instanceof mongoose.Error.ValidationError) {
//         res.status(500).render('auth/signup', { errorMessage: error.message });
//       } else if (error.code === 11000) {
//         res.status(500).render('auth/signup', {
//           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
//         });
//       } else {
//         next(error);
//       }
//     }); // close .catch()
// });

// ////////////////////////////////////////////////////////////////////////
// ///////////////////////////// LOGIN ////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////

// // .get() route ==> to display the login form to users
// router.get('/login', (req, res) => res.render('auth/login'));

// // .post() login route ==> to process form data
// router.post('/login', (req, res, next) => {
//   const { email, password } = req.body;

//   if (email === '' || password === '') {
//     res.render('auth/login', {
//       errorMessage: 'Please enter both, email and password to login.'
//     });
//     return;
//   }

//   User.findOne({ email })
//     .then(user => {
//       if (!user) {
//         res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
//         return;
//       } else if (bcryptjs.compareSync(password, user.passwordHash)) {
//         req.session.currentUser = user;
//         res.redirect('/userProfile');
//       } else {
//         res.render('auth/login', { errorMessage: 'Incorrect password.' });
//       }
//     })
//     .catch(error => next(error));
// });

// ////////////////////////////////////////////////////////////////////////
// ///////////////////////////// LOGOUT ////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////

// router.post('/logout', (req, res) => {
//   req.session.destroy();
//   res.redirect('/');
// });

// router.get('/userProfile', routeGuard, (req, res) => {
//   res.render('users/user-profile');
// });

module.exports = router;
