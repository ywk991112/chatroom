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
                   fromID: Sequelize.STRING,
                   toName: Sequelize.STRING,
                   toID: Sequelize.STRING,
                   msg:  Sequelize.STRING,
                 });

var Friend_list = sequelize.define('Friend_lists', {
                   fromName: Sequelize.STRING,
                   fromID: Sequelize.STRING,
                   toName: Sequelize.STRING,
                   toID: Sequelize.STRING,
                 });

/*
 User.sync({force: true});
 Chat_history.sync({force: true});
 Friend_list.sync({force: true});
*/

//Define MySQL parameter in Config.js file.

random_id = Math.floor(Math.random() * 1000000000) + 1  



// Use the FacebookStrategy within Passport.


//====================================================
//====================== http ========================
//====================================================

app.use(express.static('public'));
app.use('/dist', express.static('dist'));


//====================================================
//================= socket io ========================
//====================================================
 
io.sockets.on('connection', function(socket) {
  console.log("Connection!");
  
  // login
  socket.on('login', function(data){
    console.log(data);
    var name;
    User.findAll({ where: { username: data.username, password: data.password }
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
      if (success){
        // ask for friends!
        console.log("Login: ", success); // Get returns a JSON representation of the user
        var list = [];
        var arr  = [];
        var chatlist_one = [];
        Friend_list.findAll({ where: { fromName: data.username }
        }).then(function(result) {
          console.log("Result:");
          for (var j = 0; j < result.length; j += 1) {
              let i = j;
              if (arr.indexOf(result[i].toName) === -1){
                arr.push(result[i].toName);
                list.push({username: result[i].toName});
                console.log(result[i].toName);
              }
          }
          return true;
        }).then(function(success) {
          Friend_list.findAll({ where: { toName: data.username }
          }).then(function(result) {
            console.log("Result:");
            for (var j = 0; j < result.length; j += 1) {
                let i = j;
                if (arr.indexOf(result[i].fromName) === -1){
                  arr.push(result[i].fromName);
                  list.push({username: result[i].fromName});
                  console.log(result[i].fromName);
                }
            }
            return true;
          }).then(function(success) {
            // end
            console.log("Get: ", {user: data.username, friends: list}); // Get returns a JSON representation of the user
            socket.emit('login.success', {user: data.username, friends: list});
          });
        });

        socket.join(data.username);
      }
      else{
        socket.emit('login.failure', data);
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

  // friend
  socket.on('add friend', function(data){
    User
    .findAll({ where: { username: data.friendName }
    }).then(function(result) {
      if (result.length == 0){
        // add new user
        console.log("There is no such user!");
        return false;
      }else{
        data.toID = result[0].id;
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
        .findOrCreate({where: {fromName: data.fromName, fromID: data.fromID, toName: data.friendName, toID: data.toID } })
        .spread(function(user, created) {
          console.log(user.get({
            plain: true
          }))
          if (created){
            console.log("Become friends!");
          }
          else{
            console.log("You two are already friends!");
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
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push(result[i].toName);
          // console.log(result[i].toName);
      }
    }).then(function(success) {
      // console.log("Get: ", list); // Get returns a JSON representation of the user
    });

  });

  // chatting history
  socket.on('last chatting', function(data){
    var list = [];
    // sent msg
    Chat_history.findAll({ 
      limit: 1,
      where: { fromName: data.fromName },
      order: [ [ 'createdAt', 'DESC' ]]
    }).then(function(result) {
      console.log("Result:");
      
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push({ username: result[i].toName, send: true, msg: result[i].msg, time: result[i].createdAt});
          console.log(result[i].toName);
          // setTimeout(function(){ console.log(i); }, i*100);
      }
      
      // console.log(result[2].toName);
      console.log(result.length);

    }).then(function(success) {
      // console.log(data);
      console.log("Get: ", list); // Get returns a JSON representation of the user
      // emitLoginResult({success: success, username: data.name, id: data.id });
    });

    // received msg
    Chat_history.findAll({ 
      limit: 1,
      where: { toName: data.fromName },
      order: [ [ 'createdAt', 'DESC' ]]
    }).then(function(result) {
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push({ username: result[i].fromName, send: false, msg: result[i].msg, time: result[i].createdAt});
      }
    }).then(function(success) {
      // console.log("Get: ", list); // Get returns a JSON representation of the user
      io.sockets.in(data.fromID).emit('get last chatting', list);
    });


  });

  socket.on('chatting history', function(data){
    var list = [];
    // sent msg
    Chat_history.findAll({ where: { fromName: data.fromName }
    }).then(function(result) {
      console.log("Result:");
      
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push({ username: result[i].toName, send: true, msg: result[i].msg, time: result[i].createdAt});
          console.log(result[i].toName);
          // setTimeout(function(){ console.log(i); }, i*100);
      }
      
      // console.log(result[2].toName);
      console.log(result.length);

    }).then(function(success) {
      // console.log(data);
      console.log("Get: ", list); // Get returns a JSON representation of the user
      // emitLoginResult({success: success, username: data.name, id: data.id });
    });

    // received msg
    Chat_history.findAll({ where: { toName: data.fromName }
    }).then(function(result) {
      console.log("Result:");
      
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push({ username: result[i].fromName, send: false, msg: result[i].msg, time: result[i].createdAt});
          console.log(result[i].toName);
          // setTimeout(function(){ console.log(i); }, i*100);
      }
      
      // console.log(result[2].toName);
      console.log(result.length);

    }).then(function(success) {
      // console.log(data);
      console.log("Get: ", list); // Get returns a JSON representation of the user
      io.sockets.in(data.fromID).emit('get chatting history', list);
    });

  });


    // bad function...
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

  // test
  socket.on('request history', function(data, cb) {
    // console.log(data);

    var list = [];
    // sent msg
    Chat_history.findAll({ where: { fromName: data.fromName, toName: data.toName }
    }).then(function(result) {
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push({ username: result[i].toName, send: true, text: result[i].msg, time: result[i].createdAt});
          // console.log(result[i].toName);
      }
    }).then(function(success) {
      // console.log("Get: ", list); // Get returns a JSON representation of the user
    });

    // received msg
    Chat_history.findAll({ where: { toName: data.fromName, fromName: data.toName }
    }).then(function(result) {
      for (var j = 0; j < result.length; j += 1) {
          let i = j;
          list.push({ username: result[i].fromName, send: false, text: result[i].msg, time: result[i].createdAt});
          // console.log(result[i].toName);
      }

    }).then(function(success) {
      // sort history messages by time
      function custom_sort(a, b) {
          return new Date(a.time).getTime() - new Date(b.time).getTime();
      }
      // console.log("Get: ", list.sort(custom_sort)); // Get returns a JSON representation of the user
      cb({username: data.toName, history: list.sort(custom_sort)})
    });

  });

  socket.on('send message', function(data) {
    console.log(data);
    //
    User
    .findAll({ where: { username: data.username }
    }).then(function(result) {
      if (result.length == 0){
        // add new user
        console.log("There is no such user!");
        return false;
      }else{
        data.toID = result[0].id;
        return true;
      }
    }).then(function(success) {
      if(success){
        // add into chatting DB
        Chat_history
        .build({ fromName: data.user, toName: data.username, msg: data.text })
        .save()
        .then(function(result) {
          // send by socket.io
          // sender
          io.sockets.in(data.username).emit('get message', { text: data.text, fromName: data.user });
          // receiver
          // io.sockets.in(data.username).emit('new message', { text: data.text, fromName: data.fromName });
          console.log("Successfully send msg from ", data.fromName, "to ", data.toName, "!");
        }).catch(function(error) {
          // Ooops, do some error-handling
          if (error){
            console.log(error);
            console.log("Something wrong (send msg)")
          }
        });
      }
    });
  });
});


// app.listen(3000);
server.listen(3000);
