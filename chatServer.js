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

  
  socket.emit('answer',"Hello I am LucyBot! ...and I have great news for you..."); //We start with the introduction;
  waitTime =2000;
   
  setTimeout(timedQuestion, 5000, socket,"The psychiatrist is in the house ;)!!! \nBut let's be civilised and start with your name..."); // Wait a moment and respond with a question.

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
  answer= 'Well, hello  again ' + input + ' :-) How may I help you today?';// output response
  waitTime = 3000;
  question = 'My specialties are jobs and relationships. So which would it be? :D';
}
  else if (questionNum == 1) {
  answer= 'Ah! You\'d want to us to talk about '+ input + ', would you? That\'s the number 1 question on 90% of my patient\'s minds....\nand I have a lot of patients too, I can tell you that for free! ';// output response
  waitTime = 10000;
  question = 'In one word, what do you think will make you happy?';                             // load next question
}
 else if (questionNum == 2) {  
  answer= input + ' ...Well, you\'re definitely on to something!';
  waitTime =5000;
  question = 'So, the question is...have you taken the first step?';
}
  else if (questionNum == 3) {
  if(input.toLowerCase()==='yes'|| input===1){
      answer = 'Perfect! I am so proud of you, you are well on your way';
      waitTime =2000;
      question = 'The next question is: Have you taken the next step? \nYou can\'t afford to stop now that you\'ve started. No, sir!';
      //questionNum--;     
    } else if(input.toLowerCase()==='no'|| input===0){
        socket.emit('changeBG', 'black');
        socket.emit('changeFont','white'); /// we really should look up the inverse of what we said befor.
        answer='Then what are you waiting for???';
        answer = "A journey of a thousand miles begins with a step! So get off your behind and start walking. That will be 5 cents, please. Thank you!'";
        waitTime =5000;
        question = ''; 
} else {
      answer=' I did not understand you. Can you please answer with simply with yes or no.'
      question='';
      questionNum--;
      waitTime =0;
      }
    }
  // load next question
  else if (questionNum == 4) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = 'Way to go! You\'re getting closer than you know! Keep at it and you\'d be there in no time! Now off you go! Wait! That will be 5 cents please. Thank you!';
      waitTime  = 5000;
    }
    else if(input.toLowerCase()==='no'|| input===0){
        socket.emit('changeBG', 'black');
        socket.emit('changeFont','white'); /// we really should look up the inverse of what we said befor.
        question='Then what are you waiting for???';
        }else{
      answer=' I did not understand you. Can you please answer with simply with yes or no.'
      question='';
      questionNum--;
      waitTime =0;
    }
  }
 else  if (questionNum == 5){
  answer = "A journey of a thousand miles begins with a step! So get off your behind and start walking! That will be 5 cents please. Thank you!";
  waitTime = 5000; 
  question = '';
 } else {
    answer= 'You are breaking your own record! Live long and prosper! That will be 5 cents, please.';// output response
    waitTime =2000;
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
