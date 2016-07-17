console.log("----------------------------");
console.log("NodeJS Server is now Running");
console.log("----------------------------");
console.log("BID: 43");

var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;

console.log("Listening on port 8080. MongoDB & socketio initialized.");

mongo.connect('mongodb://127.0.0.1/chat', function(err, db){
  if(err) throw err;
  client.on('connection', function(socket){
      var collection = db.collection("messages"),
          sendStatus = function(s){
            socket.emit('status', s);
          };
      //fetch messages on user join
      collection.find().limit(20).sort({_id: 1}).toArray(function(err, res){
        console.log("\n>Throwing missed messages to client.");
        if(err) throw err;
        socket.emit('output', res);
      });

      socket.on('input', function(data){
      var name = data.name,
          message = data.message,
          whitespacePattern = /^\s*$/;
          if(whitespacePattern.test(name) || whitespacePattern.test(message)){
            sendStatus('invalidinput');
          }else{
            collection.insert({name: name, message: message}, function(){
              //push to all clients
              client.emit('output', [data]);
              console.log("[USER] " + name + ": " + message);
            });
          }
    });
  });
});
