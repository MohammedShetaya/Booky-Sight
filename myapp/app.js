var express = require('express');
var path = require('path');
var fs = require('fs') ; 
var sessions = require('express-session') ;  
const { json } = require('express');
const { use } = require('passport');
const { Session } = require('inspector');

var app = express();

var session ; 

var searchResults = [] ; 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({
  secret : '^$#$%^&*^%$#catchmeifyoucan(*&^%$#&*()' ,
  resave : false ,
  saveUninitialized : true  
})) ;





// start  get & post requests 

app.get('/' , function( req , res){

  session = req.session ;

  if(session.sessionID){ 
    res.render('home') ; 
  }
  else
  res.render('login' , {wrongLogin : ''}); 
}) ; 


app.post('/',function(req,res) {
  
   session = req.session ;

   const x = req.body.username; 
   const y = req.body.password ; 
   const usersArr = fs.readFileSync('users.json') ; 
   const users =  JSON.parse(usersArr) ;
     
   if (authenticate(x,y)) {
     session.sessionID = x ;
     res.redirect('home') ;
   }
   else{
     res.render('login' , {wrongLogin : 'Incorresct Username or Password'}) ;   
   }
  }) ; 


 

app.get('/login' , function(req , res){

  session = req.session ;

  if(session.sessionID){ 
    res.redirect('home') ; 
  }
  else
  res.render('login' , {wrongLogin : '' }); 

} ) ; 

app.post('/login',function(req,res) {
  session = req.session ;

   const x = req.body.username; 
   const y = req.body.password ; 
   const usersArr = fs.readFileSync('users.json') ; 
   const users =  JSON.parse(usersArr) ;
     
   if (authenticate(x,y)) {
     session.sessionID = x ;
     res.redirect('home') ;
   }
   else{
    res.render('login' , {wrongLogin : 'Incorresct Username or Password'}) ;   
  }
  }) ; 


app.get('/registration' , function(req , res){

  session = req.session ;

  if(session.sessionID){ 
    res.redirect('home') ; 
  }
  else
  res.render('registration' , { userExists : ''} );
}) ; 

app.post('/registration',function(req,res){
  session = req.session ;

  const x = req.body.username; 
  const y = req.body.password ; 
  const obj = {username : x , password : y , readList : [] } ;

  if(userExists(x)) {
    res.render('registration' , {userExists : 'Username Exists try another one'}) ; 
  }
  else {
  const usersArr = fs.readFileSync('users.json') ; 
  const users =  JSON.parse(usersArr) ;
  users.push(obj) ; 
  fs.writeFileSync('users.json' , JSON.stringify(users) ) ;
  session.sessionID = x ; 
  res.redirect('login') ;
  }

 }) ; 


 
app.get('/home' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 
    res.render('home') ; 
  }
  else
  res.redirect('login'); 
}) ;


app.get('/readlist' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 
    res.render('readlist') ; 
  }
  else
  res.redirect('login'); 
}) ; 


app.post('/readlist' , function(req,res){

  const user = findUser(session.sessionID) ; 
  res.json({
    readlist : user.readList  
  }) ; 
}) ; 


app.get('/novel' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 
    res.render('novel') ; 
  }
  else
  res.redirect('login'); 
}) ; 

app.get('/poetry' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 
    res.render('poetry') ; 
  }
  else
  res.redirect('login'); 
}) ; 

app.get('/fiction' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 
    res.render('fiction') ; 
  }
  else
  res.redirect('login');
}) ; 

app.get('/dune' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 

  const user = findUser(session.sessionID) ;
  if(readListBook(user,'dune')){
    res.render('dune' , {addButton : 'Added'}) ;
  }
  else{
    res.render('dune' , {addButton : 'Add to Want to Read List'}) ;
  }
     
  }
  else
  res.redirect('login');
}) ; 


app.post('/dune' , function(req,res) {
   addBook(req.body) ; 
});

 

app.get('/flies' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 

    const user = findUser(session.sessionID) ;
  if(readListBook(user,'flies')){
    res.render('flies' , {addButton : 'Added'}) ;
  }
  else{
    res.render('flies' , {addButton : 'Add to Want to Read List'}) ;
  }

  }
  else
  res.redirect('login'); 
}) ; 


app.post('/flies' , function(req,res) {
   addBook(req.body) ; 
});


app.get('/sun' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 
    
    const user = findUser(session.sessionID) ;
    if(readListBook(user,'sun')){
      res.render('sun' , {addButton : 'Added'}) ;
    }
    else{
      res.render('sun' , {addButton : 'Add to Want to Read List'}) ;
    }
   
  }
  else
  res.redirect('login');
}) ; 

app.post('/sun' , function(req,res) {
   addBook(req.body) ; 
});


app.get('/grapes' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 

    const user = findUser(session.sessionID) ;
    if(readListBook(user,'grapes')){
      res.render('grapes' , {addButton : 'Added'}) ;
    }
    else{
      res.render('grapes' , {addButton : 'Add to Want to Read List'}) ;
    }
  
  }
  else
  res.redirect('login'); 
}) ; 

app.post('/grapes' , function(req,res) {
   addBook(req.body) ; 
});



app.get('/leaves' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 

    const user = findUser(session.sessionID) ;
    if(readListBook(user,'leaves')){
      res.render('leaves' , {addButton : 'Added'}) ;
    }
    else{
      res.render('leaves' , {addButton : 'Add to Want to Read List'}) ;
    }
  

  }
  else
  res.redirect('login'); 
}) ; 

app.post('/leaves' , function(req,res) {
    addBook(req.body) ; 
});



app.get('/mockingbird' , function(req , res){
  session = req.session ;

  if(session.sessionID){ 

    const user = findUser(session.sessionID) ;
    if(readListBook(user,'mockingbird')){
      res.render('mockingbird' , {addButton : 'Added'}) ;
    }
    else{
      res.render('mockingbird' , {addButton : 'Add to Want to Read List'}) ;
    }
  
  }
  else
  res.redirect('login'); 
}) ;

app.post('/mockingbird' , function(req,res) {
   addBook(req.body) ; 
});


app.get('/frontapp' , function(req , res){
  res.send('frontapp') ; 
}) ;

app.get('/frontapp.js' ,function(req, res) {
  fs.readFile('./views/frontapp.js',
          {encoding: 'utf-8'},
          (err, data) => {
      if (!err)
      {
        res.type('.js');
        res.send(data);
      }
  });
});

app.get('/logout' , function(req,res) {
  req.session.destroy(function(err){  
  }) ;
  res.redirect('/') ;   
}); 



app.get('/searchresults' , function(req , res){
  session = req.session ;
  if(session.sessionID){ 
    res.render('searchresults') ; 
  }
  else
  res.redirect('login');
}) ; 

app.post('/searchresults' , function(req,res){
  res.json({
    searchResults : searchResults 
  }) ; 
}) ;


app.post('/Search' , function(req,res){
  const searchKey = req.body.Search ;
  searchResults = search(searchKey) ;
  res.redirect('searchresults') ; 
}); 
 

// end get & post requests 

//.
//.

// authentication and search functions 

function authenticate (x,y) { 
  const usersArr = fs.readFileSync('users.json') ; 
  const users =  JSON.parse(usersArr) ;
  for(let i = 0 ; i<users.length ; i++ ) {
  if (users[i].username === x && users[i].password === y) {
    return true ; 
  }
  
}
return false ; 
} ;

//returns an existing user

function findUser (userID) {
  const usersArr = fs.readFileSync('users.json') ; 
  const users =  JSON.parse(usersArr) ;
  for(let  i = 0 ; i < users.length ; i++ ){
    if(users[i].username === userID ) {
      return users[i] ; 
    }
  }
} ;

// checks if the user exist in the database 

function userExists (userID) {
  const usersArr = fs.readFileSync('users.json') ; 
  const users =  JSON.parse(usersArr) ;
  for(let  i = 0 ; i < users.length ; i++ ){
    if(users[i].username === userID ) {
      return true ; 
    }
  }
  return false ;
}  ;

// checks wheather the book exist before 

function readListBook (user , bookID ) {
  const userReadList = user.readList ;
  for(let j = 0 ; j < userReadList.length ; j ++ ){         
    if(userReadList[j].bookID === bookID ){
      return true ;  
    }
  }
  return false ;  
}


// adds the book to users readlist if it does not exist before
function addBook (book) {

  const usersArr = fs.readFileSync('users.json') ; 
  let users =  JSON.parse(usersArr) ;

  for(let  i = 0 ; i < users.length ; i++ ){
    if(users[i].username === session.sessionID ) {
      let z = false ;

      const a = users[i].readList ;

      for(let j = 0 ; j < a.length ; j ++ ){         
        if(a[j].bookID === book.bookID ){
          z = true ;
          break ; 
        }
      }

      if (!z) {
        users[i].readList.push(book) ; 
      } 
      break ; 
    }
  }

  fs.writeFileSync('users.json' , JSON.stringify(users) ) ;

} ;

//searches for a search key 
function search (key){

  const booksArr = fs.readFileSync('books.json') ; 
  const books = JSON.parse(booksArr) ;

  let resultsBooks = [] ; 
  for(let i = 0 ; i < books.length ; i ++ ) {
    if(books[i].name.includes(key) | books[i].name.toLowerCase().includes(key) | books[i].disc.includes(key)){
      resultsBooks.push(books[i]) ;
    }
  }
  return resultsBooks ;    
}

//   server listening to 
 
if(process.env.PORT){
app.listen(process.env.PORT , function(){}) ; 
}
else {
  app.listen(3000 , function(){} ) ;
}