
var express = require('express');
var path = require('path');
var app = express();

var url = "mongodb://127.0.0.1:27017";
var database = "myDB";
var collection = "myCollection";
var MClient = require('mongodb').MongoClient;
const session = require('express-session');
const { userInfo } = require('os');
const { debugPort } = require('process');
const PORT = process.env.PORT || 3030;
var p=['','','','','',''];
var msg='';


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
{
  secret:'secret-key',
  resave: false,
  saveUninitialized: false,
}
));




//const MongoDBStore = require('connect-mongodb-session')(session);



//login
app.get('/', function(req,res){
  res.render('login',{message: msg});
  msg='';
});
app.post('/', function(req,res){

 const userName = req.body.username;
 // req.session.username=req.body.username;
  var passWord = req.body.password;
  var flag = 0;

  //for the deployed version uncomment this and comment the rest
  // if(userName=="admin" && passWord=="admin"){
  //   res.render('home');
  // }else{
  //   res.render('login', {message: 'Wrong credentials or user not already logged in '});
  // }

  MClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
     // var arr = new Array(result.length).fill(0);
      for (let i=0;i<result.length;i++){
        if((userName==result[i].username && passWord==result[i].password)){
          flag=1;
        }
      }
     
      if(flag==1){
       // dbo.collection(collection).insertOne({ username:userName, password:passWord});
       req.session.username=userName;
       res.render('home');
      }else{
        //console.log('wrong credentials');
        res.render('login', {message: 'Wrong credentials or user not already logged in '});
      }
    });
  
  });
});




//register
app.get('/registration', function(req,res){
  res.render('registration', {message:' '});
});
app.post('/register', function(req,res){
  const userName = req.body.username;
 // req.session.username=userName;
  var passWord = req.body.password;
  var flag = 0;
  MClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      var arr = new Array(result.length).fill(0);
      for (let i=0;i<result.length;i++){
        if(userName==result[i].username ){
          flag=1;
        }
      }
      if(userName==''){
        res.render('registration', {message: 'username field cannot be empty'});
      }else if(flag==1){
       // dbo.collection(collection).insertOne({ username:userName, password:passWord});
       res.render('registration', {message: 'username already in use'});
      }
      else{
        req.session.username=userName;
        req.session.password=passWord;
        dbo.collection(collection).insertOne({ username:userName, password:passWord, places:new Array()});
        msg='registration successful, please log in';
        res.redirect('/');
       // res.render('/login',{message:'registration successful, please log in'});
      }
    });
  
  });
});

app.get('/annapurna', function(req,res){
  res.render('annapurna', {message:''});
});
app.post('/wantToGo', function(req,res){
  const userName=req.session.username;
  var placeWanted = 'Annapurna Circuit'
  var flag=0;
  var id=0;
  MClient.connect(url, function(err, client){
    var dbo = client.db(database);
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      for(let i = 0;i<result.length;i++){
        if(userName==result[i].username){
          id=result[i]._id;
         // console.log(result[i].places.length);
          for(let j=0; j<result[i].places.length;j++){
            if(placeWanted==result[i].places[j]){
              flag=1;
            }
          }
        }
      }
      if (flag==0){  
        //dbo.collection(collection).insertOne({username: userName,place:placeWanted});
       // req.session.places.push(placeWanted);
         dbo.collection(collection).updateOne({ _id: id }, { $push: { places: placeWanted } }, function(err, res) {
        });
      }
      else{
        res.render('annapurna',{message:'place already added'});
      }
    });
  });
  
});

app.get('/bali', function(req,res){
  res.render('bali',{message:''});
});
app.post('/wantToGoBali', function(req,res){
  const userName=req.session.username;
  var placeWanted = 'Bali Island'
  var flag=0;
  var id=0;
  MClient.connect(url, function(err, client){
    var dbo = client.db(database);
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      for(let i = 0;i<result.length;i++){
        if(userName==result[i].username){
          id=result[i]._id;
         // console.log(result[i].places.length);
          for(let j=0; j<result[i].places.length;j++){
            if(placeWanted==result[i].places[j]){
              flag=1;
            }
          }
        }
      }
      if (flag==0){  
        //dbo.collection(collection).insertOne({username: userName,place:placeWanted});
        //  req.session.places.push(placeWanted);
         dbo.collection(collection).updateOne({ _id: id }, { $push: { places: placeWanted } }, function(err, res) {
        });
      }
      else{
        res.render('bali',{message:'place already added'});
      }
    });
  });
  
});

app.get('/inca', function(req,res){
  res.render('inca',{message:''});
});
app.post('/wantToGoInca', function(req,res){
  const userName=req.session.username;
  var placeWanted = 'Inca Trail to Machu Picchu'
  var flag=0;
  var id=0;
  MClient.connect(url, function(err, client){
    var dbo = client.db(database);
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      for(let i = 0;i<result.length;i++){
        if(userName==result[i].username){
          id=result[i]._id;
         // console.log(result[i].places.length);
          for(let j=0; j<result[i].places.length;j++){
            if(placeWanted==result[i].places[j]){
              flag=1;
            }
          }
        }
      }
      if (flag==0){  
        //dbo.collection(collection).insertOne({username: userName,place:placeWanted});
         // req.session.places.push(placeWanted);
         dbo.collection(collection).updateOne({ _id: id }, { $push: { places: placeWanted } }, function(err, res) {
        });
      }
      else{
        res.render('inca',{message:'place already added'});
      }
    });
  });
  
});


app.get('/paris', function(req,res){
  res.render('paris',{message:''});
});
app.post('/wantToGoParis', function(req,res){
  const userName=req.session.username;
  var placeWanted = 'Paris'
  var flag=0;
  var id=0;
  MClient.connect(url, function(err, client){
    var dbo = client.db(database);
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      for(let i = 0;i<result.length;i++){
        if(userName==result[i].username){
          id=result[i]._id;
         // console.log(result[i].places.length);
          for(let j=0; j<result[i].places.length;j++){
            if(placeWanted==result[i].places[j]){
              flag=1;
            }
          }
        }
      }
      if (flag==0){  
        //dbo.collection(collection).insertOne({username: userName,place:placeWanted});
        //req.session.places.push(placeWanted);

         dbo.collection(collection).updateOne({ _id: id }, { $push: { places: placeWanted } }, function(err, res) {
        });
      }
      else{
        res.render('paris',{message:'place already added'});
      }
    });
  });
  
});


app.get('/rome', function(req,res){
  res.render('rome',{message:''});
});
app.post('/wantToGoRome', function(req,res){
  const userName=req.session.username;
  var placeWanted = 'Rome'
  var flag=0;
  var id=0;
  MClient.connect(url, function(err, client){
    var dbo = client.db(database);
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      for(let i = 0;i<result.length;i++){
        if(userName==result[i].username){
          id=result[i]._id;
         // console.log(result[i].places.length);
          for(let j=0; j<result[i].places.length;j++){
            if(placeWanted==result[i].places[j]){
              flag=1;
            }
          }
        }
      }
      if (flag==0){  
        //dbo.collection(collection).insertOne({username: userName,place:placeWanted});
       // req.session.places.push(placeWanted);

         dbo.collection(collection).updateOne({ _id: id }, { $push: { places: placeWanted } }, function(err, res) {
        });
      }
      else{
        res.render('rome',{message:'place already added'});
      }
    });
  });
  
});

app.get('/santorini', function(req,res){
  res.render('santorini',{message:''});
});
app.post('/wantToGoSantorini', function(req,res){
  const userName=req.session.username;
  var placeWanted = 'Santorini Island'
  var flag=0;
  var id=0;
  MClient.connect(url, function(err, client){
    var dbo = client.db(database);
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      for(let i = 0;i<result.length;i++){
        if(userName==result[i].username){
          id=result[i]._id;
         // console.log(result[i].places.length);
          for(let j=0; j<result[i].places.length;j++){
            if(placeWanted==result[i].places[j]){
              flag=1;
            }
          }
        }
      }
      if (flag==0){  
        //dbo.collection(collection).insertOne({username: userName,place:placeWanted});
       // req.session.places.push(placeWanted);

         dbo.collection(collection).updateOne({ _id: id }, { $push: { places: placeWanted } }, function(err, res) {
        });
      }
      else{
        res.render('santorini',{message:'place already added'});
      }
    });
  });
  
});


app.get('/cities', function(req,res){
  res.render('cities');
});
app.get('/hiking', function(req,res){
  res.render('hiking');
});
app.get('/home', function(req,res){
  res.render('home');
});

app.get('/islands', function(req,res){
  res.render('islands');
});


app.get('/wanttogo', function(req,res){
  //const userName1=req.session.username
  //console.log(userName1);
  const userName = req.session.username;
  
  MClient.connect(url, function(err, client){
    var dbo = client.db(database);
    var id=0;
    dbo.collection(collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      for(let i=0;i<result.length;i++){

        if(userName==result[i].username ){
          id=result[i]._id;
          p=["","","","","",""];
          for(let j=0 ; j < result[i].places.length ;j++){
            p[j]=result[i].places[j];
          }
        }
      }
      // p=["","","","","",""];
      // for(const place of req.session.places){
      //   p[j]=place;
      // }

      res.render('wanttogo',{place1: p[0], place2: p[1], place3: p[2], place4: p[3], place5: p[4], place6: p[5]});
    });
  });
 
});




  app.post('/search',function(req,res){
      var searchVAL = req.body.Search;
      var places =["Paris","Rome","Inca Trail to Machu Picchu","Annapurna Circuit","Bali Island","Santorini Island"];
      var m =["","","","","",""];
      for(let i=0;i<places.length;i++){
        if(places[i].toLocaleLowerCase().includes(searchVAL.toLocaleLowerCase())){
          m[i]=places[i];
        }else{
          m[i]="";
        }
      }
      var p =["","","","","",""];
      for(let i=0;i<m.length;i++){
       if(m[i].toLocaleLowerCase().includes("paris")){
        p[i]="paris";
       }else if(m[i].toLocaleLowerCase().includes("rome")){
        p[i]="rome";
       }else if(m[i].toLocaleLowerCase().includes("inca")){
        p[i]="inca";
       }else if(m[i].toLocaleLowerCase().includes("annapurna")){
        p[i]="annapurna";
       }else if(m[i].toLocaleLowerCase().includes("bali")){
        p[i]="bali";
       }else if(m[i].toLocaleLowerCase().includes("santorini")){
        p[i]="santorini";
       }else{
        p[i]="";
       }
      }
      res.render('searchresults',{
        p1: p[0],m1: m[0],
        p2: p[1],m2: m[1],
        p3: p[2],m3: m[2],
        p4: p[3],m4: m[3],
        p5: p[4],m5: m[4],
        p6: p[5],m6: m[5],
    });
  });



  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });



