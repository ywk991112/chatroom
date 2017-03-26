var express           =     require('express')
  , passport          =     require('passport')
  , util              =     require('util')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , mysql             =     require('mysql')
  , app               =     express()
  , server            = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , nicknames = []
  , random_id = 0;

//Define MySQL parameter in Config.js file.
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

random_id = Math.floor(Math.random() * 1000000000) + 1  
/*
def: friend table: fr_ + user_id


*/

//Connect to Database only if Config.js parameter is set.

if(config.use_database==='true')
{
    connection.connect();
}

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile.id, profile);
    if (profile.username === undefined){
      profile.username = profile.displayName;
      console.log('Username is empty!');
    }
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database==='true')
      {
        connection.query("SELECT * from user_info where user_id="+profile.id,function(err,rows,fields){
        if(err) throw err;
          if(rows.length===0)
          {
            console.log("There is no such user, adding now");
            connection.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.displayName+"')");
            // create table of friends
            console.log("Create friend table");
            connection.query("CREATE TABLE fr_" + profile.id + 
            "(" +
            "user_id numeric(21,0)," +
            "add_t DATETIME" +
            ")CHARACTER SET utf8"
            );
          }
          else
          {
            console.log("User already exists in database");
          }
        });
      }
      return done(null, profile);
    });
  }
));

//====================================================
//====================== http ========================
//====================================================

// app.set('views', __dirname + '/../../public');
// app.set('view engine', 'html');
/*
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
*/
app.use(express.static('public'));

app.get('/', function(req, res){
  // res.render('index', { user: req.user });
  res.sendFile( __dirname  + "/index.html" )
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/public', express.static(__dirname + '/public'));

//====================================================
//================= socket io ========================
//====================================================
 
io.sockets.on('connection', function(socket) {
  socket.on('new user', function(data){
    console.log(data);
    if (nicknames.indexOf(data) != -1) {

    } else {
      socket.emit('chat', 'SERVER', '歡迎光臨 ' + data);

      socket.nickname = data;
      nicknames.push(socket.nickname);
      io.sockets.emit('usernames', nicknames);
      socket.join(socket.nickname);
      updateNicknames();
      setupSocket(socket.nickname);
    }
  });

  function updateNicknames(){
    io.sockets.emit('usernames', nicknames);
  }

  function setupSocket(fromName){
    console.log("set up: ", fromName);
    socket.on(fromName, function(toName, data){
      io.sockets.emit(toName, { msg: data, nick: socket.nickname });
      console.log(fromName, ", ", toName, ", ", data);
    });
  }


  socket.on('send message', function(data){
    io.sockets.emit('new message', { msg: data, nick: socket.nickname });
  });

  socket.on('send message2', function(toName, data){
    console.log(toName, "/", data)
    io.sockets.in(toName).emit('new message', { msg: data, nick: socket.nickname });
  });

  socket.on('disconnect', function(data){
    if (!socket.nickname) return;
    io.sockets.emit('chat', 'SERVER', socket.nickname + ' 離開了聊天室～');
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    updateNicknames();
  });

  // login
  socket.on('login', function(data){
    // test if inside database
    connection.query("SELECT * from user_info where user_name="+data.name,function(err,rows,fields){
    if(err) throw err;
      if(rows.length===0)
      {
        console.log("There is no such user, adding now");

        get_id = generate_id();

        connection.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.displayName+"')");
        // create table of friends
        console.log("Create friend table");
        connection.query("CREATE TABLE fr_" + profile.id + 
        "(" +
        "user_id numeric(21,0)," +
        "add_t DATETIME" +
        ")CHARACTER SET utf8"
        );

        // query id
        function generate_id(){
          var id = Math.floor(Math.random() * 1000000000) + 1;
          var unique = false;
          connection.query("SELECT * from user_info where id="+data.name,function(err,rows,fields){
            if(err) throw err;
              if(rows.length===0){
                unique = true;
              }
              else{
                unique = false;
              }
          });
          if (unique){
            return id;
          }
          else
            return generate_id();
        }
      }
      else
      {
        console.log("User already exists in database");
      }
    });
  });
});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// app.listen(3000);
server.listen(3000);
