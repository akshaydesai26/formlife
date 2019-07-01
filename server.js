const express = require('express');
const bodyParser=require('body-parser');
//const request=require("request");
const mongoose=require('mongoose');
const sendMail=require('./mail');
const path=require('path');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');
//const flash=require('express-flash');

const User=require('./Models/User');

//DB configs
//const db = require('./config/keys').MongoURI;
const db='mongodb+srv://formlife1:formlife1@cluster0-mx58k.mongodb.net/test?retryWrites=true';

//connect to mongo
mongoose.connect(db,{useNewUrlParser: true})  //url parser is formality
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));


const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    //store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());*/

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(validator());
app.use(cookieParser());
app.use(session({
  secret:'mysupersecret',
  resave: false,
  saveUninitialized: false,
  //store: new MongoStore({mongooseConnection:mongoose.connection}),
  //cookie:{ maxAge: 180*60*1000}
}));
app.use(flash());

app.use(express.static(__dirname + '/public'));
    




app.get('/form',function(req,res){
    //req.flash('msg','flashconnected');
    res.sendFile(__dirname + '/form.html');
});

app.get('/flash',function(req,res){
    res.send(req.flash('msg'));
})

app.post('/form',function(req,res){
    var Data=req.body;
    const{name, email, text}=req.body;
    //res.send('Your query has been sent');
    console.log(Data);
    const newUser = new User({
        name,
        email,
        text
      });
      newUser.save()
        .then(user=>{
            //res.send('Done properly');  //render for same page with data, redirect for different
            res.sendFile(__dirname + '/form.html');
            })
        .catch(err=>console.log(err));
});

app.get('/admin',function(req,res){
    //res.render('admin');
    User.find({}, (err, userjson) => {
        if (err) {
          res.status(500).send(err);
        }
        
        res.render('admin', {data: userjson, messages: req.flash('sent')});
        //console.log(data);
      });

});

app.post('/emailsent',function(req,res){
    req.flash('sent','email sent');
    //console.log(req.body);
    const{id,txt,emailform}=req.body;
    console.log(txt);
    console.log(emailform);
    var data1=req.body;
    sendMail(emailform,txt,function(err,data){
        if(err){
            res.status(404).send(err);
            console.log(err);
        } else{
            User.deleteOne({ _id: id }, (err, task) => {
        if (err) {
          res.status(404).send(err);
        }
        User.find({}, (err, userjson) => {
            if (err) {
              res.status(500).send(err);
            }
            res.redirect('/admin'); //this find condition is useless, redirect can be put outside it;
            //res.render('admin', {data: userjson});
            //console.log(data);
          });
      });
        }
    });
    
    console.log(data1);
});

app.post('/removed',function(req,res){
    req.flash('sent','Query removed');
    console.log(req.body.id);
    User.deleteOne({ _id: req.body.id }, (err, task) => {
        if (err) {
          res.status(404).send(err);
        }
        User.find({}, (err, userjson) => {
            if (err) {
              res.status(500).send(err);
            }
            res.redirect('/admin');
            //res.render('admin', {data: userjson});
            //console.log(data);
          });
      });
    
});


app.listen(1999);
console.log('server running');