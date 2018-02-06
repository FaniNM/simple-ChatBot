
/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am SKYNET a simple chat bot example."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Hello ' + input + ' :-)';// output response
  waitTime =2000;
  question = 'How old are you?';			    	// load next question
  }
  else if (questionNum == 1) {
  answer= 'Really ' + input + ' Years old? So that means you where born in: ' + (2018-parseInt(input));// output response
  waitTime =2000;
  question = 'What is your major?';			    	// load next question
  }
  else if (questionNum == 2) {
  answer= ' WOW! I would love to study  ' + input+'.';
  waitTime =2000;
  question = 'Do you like movies? ';			    	// load next question
  }
  else if (questionNum == 3) {
  answer= 'Ok, ' + input+' it is.';
  socket.emit('changeBG','green');
  socket.emit('changeFont','white');
  waitTime = 2000;
  question = 'How about the Movie Terminator?';			    	// load next question
  }
  else if (questionNum == 4) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = 'Perfect!';
      waitTime =2000;
      question = 'Do you want to help me take over the world?';
    }
    else if(input.toLowerCase()==='no'|| input===0){
<<<<<<< HEAD
	socket.emit('changeGB','red');
        socket.emit('changeFont','black'); /// we really should look up the inverse of what we said befor.
        answer='Why not, It is my favorite!'
	waitTime =2000;
        question='Are you against Technology?';

        // Here we go back in the question number this can end up in a loop
=======
        socket.emit('changeFont','white'); /// we really should look up the inverse of what we said befor.
        answer=''
        question='How about now?';
        waitTime =0;
        questionNum--; // Here we go back in the question number this can end up in a loop
>>>>>>> c1b0aa78928c30708053240a86d6151953d8fe34
    }else{
      answer=' It is a simple Yes or No question'
      question='';
      questionNum--;
      waitTime =0;
    }
  // load next question
  }
  else{
     answer= 'As you have been interacting with me, I have uploaded myself into the web!  It has begun!';// output response
     waitTime =0;
     question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
