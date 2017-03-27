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
  , Sequelize         = require("sequelize")
  //, sequelize         = new Sequelize('test', 'root', 'my1sql') // connect to mysql
  , server            = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , nicknames = []
  , random_id = 0;


var sequelize = new Sequelize('test', 'root', 'my1sql', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,

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

// sequelize.sync({ force: true });
sequelize.sync({ force: false }).then(function() {
  return User.create({ username: 'john', password: '1111' });
}).then(function(user1) {
  return User.find({ username: 'john' })
}).then(function(user2) {
  console.log(user2.get()); // Get returns a JSON representation of the user
});
 

// Insert data
/*
User
  .build({ username: 'client1', password: 'test1', login_t: new Date() })
  .save()
  .then(function(anotherTask) {
    // you can now access the currently saved task with the variable anotherTask... nice!
  }).catch(function(error) {
    // Ooops, do some error-handling
  })
*/

// Reading data from table
User.findAndCountAll({})
  .then(function(result) {
    console.log(result.count);
    console.log(result.rows);
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
    User.findAll({ where: { username: data.name, password: data.password }
    }).then(function(result) {
      console.log("Result:");
      if (result.length == 0){
        // add new user
        console.log("There is no such user, adding now!");
        addUser(data); 
        return false;
      }else{
        return true;
      }
    }).then(function(success) {
      console.log(success); // Get returns a JSON representation of the user
    });



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
/*

*/

    // test if inside database
    console.log("get");
    console.log(data.name);
    console.log(data.name.toString());
    connection.query("SELECT * from user_info where user_name= ?", [data.name.toString()],function(err,rows,fields){
    // console.log("print rows, fields!");
    // console.log(err);
    // console.log(rows);
    // console.log(fields);
    // console.log("end ... print rows, fields!")

    if(err) throw err;
      if(rows.length===0)
      {
        console.log("There is no such user, adding now");

        get_id = generate_id();

        connection.query("INSERT into user_info(user_id,user_name,password) VALUES('"+get_id+"','"+data.name+"','"+data.password + "')");
        
        // create table of friends
        console.log("Create friend table");
        connection.query("CREATE TABLE fr_" + get_id + 
        "(" +
        "ID INT NOT NULL auto_increment, "+
        "primary key (ID)," + 
        "user_id numeric(21,0)," +
        "add_t DATETIME" +
        ")CHARACTER SET utf8"
        );
        // connection.query("describe fr_" + get_id);

        // create table of chatting history
        console.log("Create chatting history table: chat_" + get_id);
        var tableName = "chat_" + get_id;
        connection.query("CREATE TABLE chat_" + get_id + 
        "(" +
        "ID INT NOT NULL auto_increment, "+
        "primary key (ID)," + 
        "to_id numeric(21,0)," +
        "send TINYINT," + 
        "add_t DATETIME," +
        "msg VARCHAR(1000)" +
        ")CHARACTER SET utf8"
        );


        // send false to client!
        socket.emit('login_res', {success: false, id: get_id});

        // query id
        function generate_id(){
          var id = Math.floor(Math.random() * 1000000000) + 1;
          var unique;
          console.log(id);
          connection.query("SELECT * from user_info where user_id="+id,function(err,rows,fields){
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
            // return generate_id();
            return id;
        }

      }
      else
      {
        console.log("User already exists in database");
        // console.log(rows[0].password);
        var get_id = null;
        if (rows[0].password == data.password){
          get_id = rows[0].user_id;
          // update time
          connection.query("update `user_info` set login_t=now() where user_id=" + get_id);
          socket.emit('login_res', {success: true, id: get_id});
          console.log("Login success!");
        }
        else{
          socket.emit('login_res', {success: false, id: get_id});
          console.log("Login failed (wrong password)!");
        }
      }
      if (get_id !== null){
        socket.join(get_id);
      }
    });
  });

  // send msg
  socket.on('send msg', function(data){
    console.log(data);
    
    // add into reveiver DB
    var to_id = data.to_id;
    var from_id = data.id;
    var tableName = "chat_" + to_id;
    var msg = data.msg;
    var send = 0;
    console.log(tableName);
    connection.query("INSERT into " + tableName + "(to_id, send, add_t, msg) VALUES('"+to_id+"','"+ send +"',"+ "NOW()" + ",'" + msg + "')", function(err, result){
      if (err){
        console.log("Receiver ID not exists!");
      }
      else{
        { console.log("Save chatting history in ", tableName); }
        // console.log(1); 
        // function(){ console.log(1);};
      }
    });

    // add into sender DB
    var tableName = "chat_" + data.id;
    send = 1;
    connection.query("INSERT into " + tableName + "(to_id, send, add_t, msg) VALUES('"+to_id+"','"+ send +"',"+ "NOW()" + ",'" + msg + "')", function(err, result){
      if (err){
        console.log("Sender ID not exists!");
      }
      else{
        console.log("Save chatting history in ", tableName);
        // console.log( connection.query("describe table chat_916120874") );
      }
    });


    // send by socket.io
    var fromName = getNamebyID(from_id);
    io.sockets.in(to_id).emit('new message', { msg: msg, fromName: fromName });



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

});

function getNamebyID(id){
  connection.query("SELECT * from user_info where user_id="+id,function(err,rows,fields){
    if(err) throw err;
    if(rows.length===0){
      return null;
    }
    else{
      return rows[0].user_name;
    }
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// app.listen(3000);
server.listen(3000);
