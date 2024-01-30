const { urlencoded } = require('body-parser');
const express=require('express');
const app=express();
const userModel=require('./models/users');
const passport=require('passport');
const expressSession=require('express-session');
const flash=require('connect-flash');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
//from above two lines user login

app.listen(3000);
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.use(flash());
app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret:"ankitji"
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize user into the session
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         // Replace 'userModel' with your actual user model
//         const user = await userModel.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error, null);
//     }
// });


app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/submit',(req,res)=>{
    res.render('register');
    });

app.get('/login', function(req, res, next) {
    res.render('login',{error:req.flash('error')});
  });

app.get('/profile',isLoggedIn,async(req,res,next)=>{
    const user=await userModel.findOne({
        username:req.session.passport.user
      });
      res.render('profile',{user});
});

//register
app.post('/register',(req,res)=>{
    const userdata = new userModel({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
    })
    userModel.register(userdata,req.body.password)
    .then(()=>{
      passport.authenticate("local")(req,res,()=>{
        res.redirect('/profile');
      })
    })
  });
  
  //login
  app.post('/login',passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:'/login',
    failureFlash:true
  }),function(req,res){});
  
  //logout
  app.get('/logout',(req,res)=>{
    req.logout(function(err){
      if(err)return next(err);
      res.redirect('/');//after logout go to home route
    })
    });
  
    //isLoggedIn function
    function isLoggedIn(req,res,next){
      if(req.isAuthenticated())return next();//if loggedin go ahead otherwise go to home route
      res.redirect('/login');
    }