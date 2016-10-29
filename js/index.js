
 var simon = {
   count : 0, 
   winCount: 5,
   countError : 3,
   colors : ["#red", "#yellow", "#green", "#blue"],
   computer: [],
   player: [],
   // replace colors
   red: "#ff7473",
   blue: "#84B1ED", 
   yellow: "#FBFFB9", 
   green: "#C5E99B",
   //original colors
   r: "#db3236",
   b: "#4885ed",
   y: "#f4c20d",
   g: "#3cba54",
  sound:{
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'), 
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'), 
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'), 
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'), 
    wrong_answer: new Audio('https://raw.githubusercontent.com/charlesBak/Google-Chrome-Simon-Gamejs/master/mp3/wrong-answer-sound-effect.mp3')
  },
   started : false,
   stoped: false,
   strictMode: false,
 
 }

 
 function resetGame() {
  simon.computer = [];
  simon.count = 0;
  increaseCount();
}
 
 
 
 function newStart() {
  resetGame();
   simon.countError = 3;
}


 
 // show moves of computer and empty player array(delete his moves) 
 function showComputerMoves() {
  var i = 0;
  var computerMoves = setInterval(function(){
    playGame(simon.computer[i]);
    i++;
    if (i >= simon.computer.length) {
      clearInterval(computerMoves);
    }
  }, 1000)
  
// empty player list
  simon.player = [];
}
 
 
 // attribute sound to each button
 function playSound(title) {
  switch(title) {
    case'#red':
      simon.sound.red.play();
      break;
    case '#yellow':
      simon.sound.yellow.play();
      break;
    case '#green':
      simon.sound.green.play();
      break;
    case '#blue':
      simon.sound.blue.play();
      break;     
  };
}

 
 // change button color after been pushed
// play sound of button been pushed
// reset original color of button 300ms after been pushed
 function playGame(colorType) {
   var replColor = colorType.slice(1);
  $(colorType).css( {
    "background" : simon[replColor]
  });
  playSound(colorType);
   // console.log("colorType : ", simon[replColor]);
  setTimeout(function(){
    var ogColor = colorType.slice(1,2);
    // console.log(ogColor);
      $(colorType).css({
        "background" : simon[ogColor]
      });
  }, 300);
}

  
 function addPlayer(id) {
    var colorType = "#"+id
    // console.log(colorType);
   // fill array with index of buttons pushed by player for later comparison with computer
   // in playerPlays function
    simon.player.push(colorType);
    playerPlays(colorType);
} 
 

// select strict mode 
function strictMode() {
  var className = $("#strict > div").attr("class");
  if(className.indexOf("btn-primary") > 0 ){
    // console.log("on ON");
    simon.strictMode = true;
  }
  else { 
    // console.log("on OFF");
    simon.strictMode = false;
  }
}

 
// compare moves of player with computer 
// give result according to player moves
// display result if player wins the level

 function playerPlays(player) {
   // check button clicked by computer with button clicked by player
  if (simon.player[simon.player.length - 1] !== simon.computer[simon.player.length - 1]) {
    // check if strict mode activated 
    if(simon.strictMode){
      simon.sound.wrong_answer.play();
      newStart();
    } else {
      // console.log('you playerd wrong!');
      simon.sound.wrong_answer.play();
      setTimeout(showComputerMoves, 300);
      // console.log("error : " , simon.countError);
      var countDown = simon.countError -1;
      // countDown to show the user how much 
      if(countDown > 0) {
      var msg ="wrong move! you got " +  countDown + " more Try"; 
      alert(msg);
      }
      if(simon.countError > 0)
      simon.countError--;
      if(simon.countError == 0) 
        newStart();
    }
   } else {
      playSound(player);
      var comp = simon.player.length === simon.computer.length;
      if (comp) {
        //player wins the Level if reached wincount 
        if(simon.count == simon.winCount){
          var pt = simon.winCount + 5;
          $("#winMsg").html("You win! Try to go to " + pt + "Pts?");
      $('#myModal').modal('show');
          $("winMsg").html(simon.winMsg);
        } else {
          // increase count and comouter turn to play
          increaseCount();
        }
      }
    }
} 


// computer plays randomly 
function computerPlays(){
  // random number in [0, 3] -> between 0 and 4 excluded 
  var rand = (Math.floor(Math.random()* 4));
  // console.log("rand : ", rand);
  simon.computer.push(simon.colors[rand]);
  showComputerMoves();
}


 // increase count in case player wins, computer play further
 function increaseCount() {
  simon.count++;
  $('#displayCount').addClass('animated fadeOutDown');
  setTimeout(function(){
        $('#displayCount').removeClass('fadeOutDown').html(simon.count).addClass('fadeInDown');
  }, 200);
  computerPlays();
}

// click stop 
// - enable the checkbox
// set count to 0
// go to game start
$("#stop").click(function() {
  simon.stoped = true;
  console.log("started : ", simon.started);
  $("#strict > div").attr("disabled", false);
$("#strict > div").prop('disabled', false);
  console.log("stop clicked");
  $("#displayCount").html(0);
  backToStart();
});



$("#start").click(function() {
simon.stoped = false;
// console.log("stoped : ", simon.stoped);
$("#strict > div").attr("disabled", true);
$("#strict > div").prop('disabled', function (_, val) { return ! val; });  
  strictMode();
  newStart();
  simon.started = true;
  // console.log(simon.started);
  enableGameOnStart(simon.started);
});

// got to start of the game
function backToStart() {
  simon.started = false;
  enableGameOnStart(simon.started);
}

// play game only after start button clicked 
function enableGameOnStart(status) {
  // console.log("status : ", status);
  var IDs = $(".logo").find(".color");
  // console.log(IDs);
  if(status === true) {
  for(var i = 0; i < IDs.length; i++) {
    (function(index) {
      IDs[i].onclick = function() {
        if(simon.stoped === false){
        // console.log("index : " , IDs[index]);
        addPlayer(this.id);
          var replColor = this.id;
          // console.log("this.id : ", replColor);
        $(IDs[index]).css({
          "background" : simon[replColor]
        });
         setTimeout(function() {
           var ogColor = replColor.slice(0,1);
           // console.log("ogcolor : ", ogColor);
           $(IDs[index]).css({
             "background" : simon[ogColor]
           });
         },100);
        
      } // simon.stoped 
     }   
    })(i)
   }
  } else {
    alert("the game stopped!");
  }   
}


// add 5 the winscore for every next level
function increaseLevelPts() {
  newStart();
   simon.winCount += 5;
  // console.log("winCount : ", simon.winCount);
}

//-------------------------------------------
   //Info section
function showGameInfo(){
  $("#infoMsg").html(
     "Press <span id='infoStart'>'Start'</span> to start the first Level (5Pts)<br>"+
     " Press <span id='infoStop'>'Stop'</span> to reset the Game<br>"+ 
     "Switch <span id='infoOnOff'>on/off&nbsp;</span>to enable/disable 'Strict Mode'<br>" + 
     "<span id='infoOn'>On</span> : 1 Life<br>" + 
     "<span id='infoOff'>Off</span> : 3 Lives<br>");
  $('.myModalInfo').modal('show');
}
//-------------------------------------------