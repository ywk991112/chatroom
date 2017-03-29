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
  , Sequelize         =     require("sequelize")
  //, sequelize         = new Sequelize('test', 'root', 'my1sql') // connect to mysql
  , server            = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , nicknames = []
  , random_id = 0;


var sequelize = new Sequelize('test', 'root', 'my1sql', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  timezone: '+08:00',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});


// build up tables
var User = sequelize.define('Users', {
                   username: Sequelize.STRING,
                   password: Sequelize.STRING,
                   user_id:  Sequelize.STRING,
                   login_t:  Sequelize.DATE,
                   logout_t:  Sequelize.DATE
                 });

var Chat_history = sequelize.define('Chat_histories', {
                   fromName: Sequelize.STRING,
                   toName: Sequelize.STRING,
                   msg:  Sequelize.STRING,
                 });

var Friend_list = sequelize.define('Friend_lists', {
                   fromName: Sequelize.STRING,
                   toName: Sequelize.STRING,
                 });

 

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
  console.log("Connection!");
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
    var name;
    User.findAll({ where: { username: data.name, password: data.password }
    }).then(function(result) {
      if (result.length == 0){
        // add new user
        console.log("There is no such user, adding now!");
        addUser(data); 
        return false;
      }else{
        data.id = result[0].id;
        // get name by id
        return true;
      }
    }).then(function(success) {
      // console.log(data);
      console.log("Login: ", success); // Get returns a JSON representation of the user
      emitLoginResult({success: success, username: data.name, id: data.id });
      if (success){
        socket.join(data.name);
      }
    });

    // utility function
    function addUser(data){
      User
        .build({ username: data.name, password: data.password, login_t: new Date() })
        .save()
        .then(function(anotherTask) {
          // you can now access the currently saved task with the variable anotherTask... nice!
        }).catch(function(error) {
          // Ooops, do some error-handling
          if(err) throw err;
        })
    }

    function emitLoginResult(data){
      socket.emit('login_res', data);
    }
  });

  // send msg
  socket.on('send msg', function(data){
    // console.log(data);
    
    // add into chatting DB
    Chat_history
      .build({ fromName: data.fromName, toName: data.toName, msg: data.msg })
      .save()
      .then(function(data) {
        // send by socket.io
        // sender
        io.sockets.in(data.fromName).emit('new message', { msg: data.msg, fromName: data.fromName });
        // receiver
        io.sockets.in(data.toName).emit('new message', { msg: data.msg, fromName: data.fromName });
        console.log("Successfully send msg from ", data.fromName, "to ", data.toName, "!");
      }).catch(function(error) {
        // Ooops, do some error-handling
        if (error){
          console.log(error);
          console.log("Something wrong (send msg)")
        }
      });
  });

  // friend
  socket.on('add friend', function(data){
    User.findAll({ where: { username: data.friendName }
    }).then(function(result) {
      if (result.length == 0){
        // add new user
        console.log("There is no such user!");
        return false;
      }else{
        addFriend(data);
        return true;
      }
    }).then(function(success) {
      // from
      io.sockets.in(data.fromName).emit('add friend res', { success: success });
      // to 
      io.sockets.in(data.toName).emit('add friend req', { fromName: data.fromName });
    });


    function addFriend(data){
      Friend_list
        .findOrCreate({where: {fromName: data.fromName, toName: data.friendName} })
        .spread(function(user, created) {
          console.log(user.get({
            plain: true
          }))
          if (created){
            console.log("Become friends!");
          }
          else{
            console.log("You are already friends!");
          }
        })
      }

  });
 
  socket.on('delete friend', function(data){
    Friend_list
      .destroy({ where: {fromName: data.fromName, toName: data.friendName} 
    }).then(function (result){
      console.log(result);
      io.sockets.in(data.fromName).emit('delete friend res', { success: result });
    });
  });

  socket.on('get friends', function(data){
    var list = [];
    Friend_list.findAll({ where: { fromName: data.fromName }
    }).then(function(result) {
      console.log("Result:");
      
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push(result[i].toName);
          console.log(result[i].toName);
          // setTimeout(function(){ console.log(i); }, i*100);
      }
      
      console.log(result[2].toName);
      console.log(result.length);
/*
      if (result.length == 0){
        // add new user
        console.log("You have no friend...!");
        return false;
      }else{
        data.id = result[0].id;
        console.log(data.id);
        return true;
      }
*/
    }).then(function(success) {
      // console.log(data);
      console.log("Get: ", list); // Get returns a JSON representation of the user
      // emitLoginResult({success: success, username: data.name, id: data.id });
    });

  });

  // chatting history
  socket.on('last chatting', function(data){
    var list = [];
    Chat_history.findAll({ where: { fromName: data.fromName }
    }).then(function(result) {
      console.log("Result:");
      
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push({result[i].toName, send: true, msg: result[i].msg});
          console.log(result[i].toName);
          // setTimeout(function(){ console.log(i); }, i*100);
      }
      
      console.log(result[2].toName);
      console.log(result.length);

    }).then(function(success) {
      // console.log(data);
      console.log("Get: ", list); // Get returns a JSON representation of the user
      // emitLoginResult({success: success, username: data.name, id: data.id });
    });
  });

  socket.on('chatting history', function(data){
  });



  // for testing
  // socket.emit('test', {id: id});

  socket.on('test', function(data){
    console.log(data);
    var tableName = "chat_" + data.id;
    var to_id = data.id;
    connection.query("INSERT into " + tableName + "(to_id, send, add_t, msg) VALUES('"+to_id+"','"+ 0 +"',"+ "NOW()" + ",'" + "" + "')", function(err, result){
      console.log(err);
      console.log(result);
      if (err){
        console.log("ID not exists!");
      }
      else{

      }
    });
  });

  /*
  console.log( connection.query("describe table chat_916120874") );
  */

  // test client socket.io
  name = "eric";
  password = "server";

  // login
  // console.log({name: name, password: password});
  // socket.emit('login', {name: name, password: password});

  /*
  function getNamebyID(id){
    return new Promise(function(resolve, reject){
    User.findById(id).then(function(result) {
      if (result.length == 0){
        // add new user
        console.log("There is no such user!");
        return false;
      }else{
        // console.log(result.length);
        // console.log(result.username);
        resolve( result.username );
      }
    });
    })
  }
  */

  /*
    function getNamebyID(id, callback){
      var _name;
      User.findById(id).then(function(result) {
        if (result.length == 0){
          // add new user
          console.log("There is no such user!");
          return false;
        }else{
          // console.log(result.length);
          console.log(result.username);
          // _name = result.username;
          // name = result.username;
          console.log(_name);
          callback(result.username);
      }
      return 1;
      });
    }
  */
    function getNamebyID(id){
      var _name;
      User.findById(id).then(function(result) {
        if (result.length == 0){
          // add new user
          console.log("There is no such user!");
          return false;
        }else{
          // console.log(result.length);
          console.log(result.username);
          _name = result.username;
          // name = result.username;
          console.log(_name);
          
        }
      });
    }

/*

    var promise = new Promise(function(resolve, reject) {
      // do a thing, possibly async, then…
      name = getNamebyID(data.id);
      resolve(name);
    });
*/

});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// app.listen(3000);
server.listen(3000);
