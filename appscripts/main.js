// Lim Jing Wen A0115432U

require(
   // Use this library to "fix" some annoying things about Raphel paper and graphical elements:
    //     a) paper.put(relement) - to put an Element created by paper back on a paper after it has been removed
    //     b) call element.addEventListener(...) instead of element.node.addEventListner(...)
    ["../jslibs/raphael.lonce"],  // include a custom-built library
    function () {
            
        console.log("yo, I'm alive!");


        var mainpaper = document.getElementById("mySVGCanvas")
        var paper = new Raphael(mainpaper);
        //var paper = new Raphael(document.getElementById("mySVGCanvas"));

        var pWidth = paper.canvas.offsetWidth;
        var pHeight = paper.canvas.offsetHeight;
        console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);
        


        /* DIRECTORY

        1. LASER CHASE WITH GINGER
        LOADING OF IMAGE + CAT'S DOT (That the cat paws on)
        MATH FORMULAS
        DRAW GAME DOT
        GAME SETTINGS
        CLICK COUNTER
        SET LEVEL + CURRENT LEVEL + HIGH SCORE
        MOVE DOT FUNCTION
        GAME STATES AND BLINKING FUNCTIONS
        BUTTON EVENT LISTENERS 
        AUDIO
        MOVING CAT

        2. DECORATE GINGER'S PLAY ROOM
        NEW PAPER TO CAPTURE DRAWING
        DRAWING + SLIDERS TO CHANGE COLOURS/STROKE-WIDTH + CLEAR PAPER 
        CAT VISUALS IN THE ROOM

        3. CAT LOVERS CHAT

        */



        //==================================================================
        // 1.  LASER CHASE WITH GINGER
        //==================================================================

        //==================================================================
        // LOADING OF IMAGE + CAT'S DOT (That the cat paws on)
        //==================================================================

        var bgimg = paper.image("images/background2.jpg", 0, 0, pWidth, pHeight);
        
        // Has to be called before the paw so that the paw will appear on top of it
        var catdot = paper.circle(510,135,10).attr({"fill":"red", "stroke-width":"0"});
        var cat = paper.image("images/cathead2.png", 100, -20, 315, 205.5);
        var catpaw = paper.image("images/catpaw.png", 500, -40, 64, 151);
        
        // Usage of image button rather than raphael rectangles for design purposes
        var startbutton = paper.image("images/play3.png", 120, 250, 205, 59.5);
        var setlevelbutton = paper.image("images/setlevel3.png", 120, 300, 205, 59.5);
        var helpbutton = paper.image("images/help3.png", 120, 350, 205, 59.5);

        // Status box in which game details can be displayed
        var statusbox = paper.image("images/statusbox.png", 485, 230, 197.5, 177);

        var gameTitle = paper.text(385, 215, "LASER CHASE WITH GINGER").attr({"font-family":"Andale Mono, monospace","font-size":"30px", "font-weight": "bold", "fill":"white"});

        //==================================================================
        // MATH FORUMULAS 
        //==================================================================

        // Random Integer:
        // This is used to generate random x and y positions
        var randInt = function(m,n) {
            var range = n-m+1;
            var frand = Math.random()*range;
            return m+Math.floor(frand);
        }

        // Pythagoras Theorem:
        // This is used to calculate animation duration timing to ensure constant speed
        var pythagorasTheorem = function (xold,xnew,yold,ynew){
            var differenceinX = Math.abs(xold - xnew);
            var differenceinY = Math.abs(yold - ynew);
            var squareXY = differenceinX*differenceinX+differenceinY*differenceinY;
            var rootsquareXY = Math.sqrt(squareXY);
            return rootsquareXY;
        }

        //==================================================================
        // DRAW GAME DOT
        //==================================================================

        var dot = paper.circle(pWidth/2, pHeight/2,25);
            dot.attr({
                "fill":"red",
                "stroke-width":"0"
                });

        // Initial position of the dot
        dot.xpos = pWidth/2;
        dot.ypos = pHeight/2;

        // Dot to be hidden at start of game
        dot.hide(); 

        //==================================================================
        // GAME SETTINGS
        //==================================================================

        var maxTime = 10000; // Using ms instead of seconds to be precise
        var starttime;
        var nowtime;
        var passedtime;
        var highscore = 0;


        //==================================================================
        // CLICK COUNTER
        //==================================================================
     
        var count = 0;        

        dot.addEventListener('click', function(){
            count = count + 1;
        });


        //==================================================================
        // SET LEVEL + CURRENT LEVEL + HIGH SCORE
        //==================================================================
        

        var difficultyLevel = 1;

        function levelInput() {
            var level = prompt("Here are the available levels:\n\nLevel 1: Easy\nLevel 2: Normal\nLevel 3: Hard\nLevel 4: Colour Trouble\nLevel 5: Extreme Colour Trouble\n\nPlease input your choice of level:", "Enter only either 1, 2, 3, 4, or 5");
            
            if (level!= null) {
                difficultyLevel = Number(level);
                console.log("User has inputed difficulty level: " + difficultyLevel);
                    
                    // This checks that the converted string is 1-5, otherwise will inform user it's wrong
                    // and prompt again to enter by calling the function levelInput again
                    if (difficultyLevel>0 && difficultyLevel<6) {
                        alert("Level set to: "+ difficultyLevel);
                        currentLevel.attr({text: "Level "+difficultyLevel});
                    }
                    else {
                        alert("You did not input a correct level. Please try again!");
                        levelInput();
                    }
            }

            // This else statement is used to avoid users pressing cancel when setting the level
            // It forces them inside the loop until they input a correct level.

            // It also avoids another situation whereby users enter a letter or other text that is not 
            // acceptable as difficulty level, and presses cancel when reprompted again by the loop. 

            // If the above situation does happen, the game would not be able to proceed
            // because it has already took in that variable (which is not a number) as difficultyLevel, 
            // and this would cause problems in the game. Thus it is necessary.
            else {
                levelInput();
            }
        }

        // To be manipulated when user change level
        var currentLevel = paper.text(585, 320, "Level "+difficultyLevel).attr({'font-size':'15px', "font-weight": "bold"});
        
        // To be manipulated when user beat last high score during function gameEnd
        var currentHighScore = paper.text(585, 380, highscore).attr({'font-size':'15px', "font-weight": "bold"});


        //==================================================================
        // MOVE DOT FUNCTION               Usage of Date.now() + setTimeout
        //==================================================================

        var draw = function (){
 
            nowtime=Date.now();
            passedtime = (nowtime - starttime);
            console.log("The total passed time right now is: "  + passedtime);

            dot.oldxpos = dot.xpos
            dot.oldypos = dot.ypos
            dot.xpos = randInt(0,pWidth);
            dot.ypos = randInt(0,pHeight);

            // Usage of pythagoras theorem multiplied by constant number to get a 
            // time value that will ensure constant speed regardless of position.

            // It is further divded by difficult level that will increase time value to make it faster/slower
            dot.timevalue = pythagorasTheorem(dot.oldxpos,dot.xpos,dot.oldypos,dot.ypos)*10/difficultyLevel
            dotanimation = Raphael.animation({cx: dot.xpos, cy: dot.ypos}, dot.timevalue);
            

            // If statements are used to determine if the function runs again to place the dot 
            // at random position or stop at 10 seconds

            // Adding passedtime and dot.timevalue lets us know total time required to ensure the dot
            // reach its final position.
            
            if ((passedtime+dot.timevalue)<maxTime){
                dot.animate(dotanimation);
                setTimeout(draw,dot.timevalue); 
            }


            // In this case, if the passed time + time required to reach final position is more than max time,
            // a new variable, remainingTime, is created so that we know how long before 10 seconds is up and
            // when to cut the ongoing animation

            if ((passedtime+dot.timevalue)>maxTime) {
                var remainingTime = maxTime-passedtime;
                passedtime = passedtime + remainingTime;
                dot.animate(dotanimation);
                setTimeout(gameEnd, remainingTime);           
            }
        }

        //==================================================================
        // GAME STATES AND BLINKING FUNCTIONS        setTimeout + setInterval
        //==================================================================   
        
        // This function makes the dot appear and disappear
        var blinkingdot = function(){
        setTimeout(function(){dot.show()}, 300);
        setTimeout(function(){dot.hide()}, 1300);
        };

        //variable color dots have to be defined outside
        var colordots = [];

        //map function maps a number x within a range a-b into a range m-n with the same proportion
        var map = function(x,a,b,m,n) {
            return (((x-a)/(b-a))*(n-m))+m
        };

        //function calculates distance, in pixels, between 2 points
        var distance = function(x1, x2, y1, y2) {
            return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2)) //pythagoras theorem to help us find the distance between points (x1, y1) and (x2, y2)
        };


        // Game Start Function
        var gameStart = function (){
            cat.hide();
            catpaw.hide();
            catdot.hide();
            statusbox.hide();
            currentHighScore.hide();
            startbutton.hide();
            setlevelbutton.hide();
            helpbutton.hide();
            currentLevel.hide();
            gameTitle.hide();

            catAudio.play();
            starttime = Date.now();
            dot.show();
            draw();

           // This increases the difficult of the game by making dot appear/disappear at set interval
        if (difficultyLevel>=3){
                blinkingInterval = setInterval(blinkingdot,1500);
                console.log("Dot is appearing and disappearing");
        };                

            //level 4 onwards: creating array of color dots move on screen
    
        if (difficultyLevel>=4){
                           
            var i = 0;
            while (i<100) {
            colordots[i] = paper.circle(Math.random()*pWidth, Math.random()*pHeight, 20);

            colordots[i].attr({
                "fill": "hsb(" + map(Math.random(),0,1,0,1) + ","+ map(Math.random(),0,1,0,1) +"," + map(Math.random(),0,1,0,1) + ")",
                "stroke":"none",
                "fill-opacity":0.5
            });
        
            i++;

            };


            for (var j = 0; j<100;j++) {
            colordots[j].colorstring = Raphael.hsl(Math.random(),0.5,0.5), //a random hue is assigned to each dot, and the attribute colorstring is used to hold this hsl information so that it can be called back later
            colordots[j].attr({
                "fill": colordots[j].colorstring, //sets the fill of the dot to the colorstring attribute
                "fill-opacity": 0.75 //making the dots semi transparent by reducing fill opacity
            });

            colordots[j].xpos = pWidth/2; //Initializing the x position of each dot
            colordots[j].ypos = pHeight/2; //Initializing the y position of each dot         
            colordots[j].xrate = map(Math.random(), 0, 1, -10, 10); //Initializing a random rate ranging from -5 to 5 (can move either leftwards or rightwards)
            colordots[j].yrate = map(Math.random(), 0, 1, -10, 10); //Initializing a random rate ranging from -5 to 5 (can move either upwards or downwards)

            };

        var drawdots = function(){
            //For loop to call each individual dot in the array (i.e., myArray[0], myArray[1] ... myArray[99])
            for(j=0;j<100;j++){

                //Stores new x and y coordinates of each dot as it moves at the rates xrate and yrate
                colordots[j].xpos += colordots[j].xrate;
                colordots[j].ypos += colordots[j].yrate;

                colordots[j].attr({
                    'cx': colordots[j].xpos, 
                    'cy': colordots[j].ypos
                });

                //Moving the dots within the confines of the paper specifications
                if (colordots[j].xpos > pWidth) {colordots[j].xrate = -colordots[j].xrate;};
                if (colordots[j].ypos > pHeight) {colordots[j].yrate = -colordots[j].yrate};
                if (colordots[j].xpos < 0) {colordots[j].xrate = -colordots[j].xrate};
                if (colordots[j].ypos < 0) {colordots[j].yrate = -colordots[j].yrate};

        };
        };

        };
      
        colordotsInterval = setInterval(drawdots, 30);
        
        };


        // Game End function
        var gameEnd = function (){
            dot.stop();

            clearInterval(colordotsInterval);

            if (difficultyLevel>=3){
                clearInterval(blinkingInterval);
            };

            //hide color dots after game ends
            if (difficultyLevel>=4){
                for (var j = 0; j<100;j++) {
                colordots[j].hide();
                };
            };

            console.log("The total passed time right now is: "  + passedtime);
            alert("Game has ended!\nYou have clicked... " + count + " time(s)!")

            dot.xpos = pWidth/2;
            dot.ypos = pHeight/2;
            dotanimation = Raphael.animation({cx: dot.xpos, cy: dot.ypos}, 1);
            dot.animate(dotanimation);
            dot.hide();

            cat.show();
            catpaw.show();
            catdot.show();
            statusbox.show();
            currentHighScore.show();
            startbutton.show();
            setlevelbutton.show();
            helpbutton.show();
            currentLevel.show();
            gameTitle.show();
           
            
            if (count>highscore){
                highscore=count;
                currentHighScore.attr({text: "Level " + difficultyLevel + ": " + highscore + " clicks"});
                alert("You have beat the last high score!")
            };

            // Reset to 0 so that game can be played again
            passedtime=0;
            count=0            
        }; 

        //==================================================================
        // BUTTON EVENT LISTENERS                      
        //==================================================================

        startbutton.addEventListener('click', gameStart);

        setlevelbutton.addEventListener('click', levelInput);
        
        //==================================================================
        // AUDIO                      
        //==================================================================

        var catAudio = new Audio('sound/newcatmeow.wav');
        var bgmusic = new Audio('sound/newbgmusic.mp3')
        bgmusic.play();
        bgmusic.loop = true;

        //==================================================================
        // Moving Cat                     
        //==================================================================

        var movingCat = function(){

            setTimeout(function(){catpaw.animate({y:0},500)}, 0);
            setTimeout(function(){catpaw.animate({x:490},100)}, 500);
            setTimeout(function(){catpaw.animate({x:510},100)}, 600);
            setTimeout(function(){catpaw.animate({y:-40},500)}, 700);

            setTimeout(function(){cat.animate({transform: "r" + -4}, 400)}, 0);
            setTimeout(function(){cat.animate({transform: "r" + 4}, 800)}, 400);
        };

        movingCat();
        setInterval(movingCat, 3000);

        //==================================================================
        // 2. DECORATE GINGER'S PLAY ROOM                     
        //==================================================================
 
        //==================================================================
        // NEW PAPER TO CAPTURE DRAWING
        //==================================================================

        var drawdiv = document.getElementById("mySVGCanvas2");
        var drawingpaper = new Raphael(drawdiv);

        var dpWidth = drawingpaper.canvas.offsetWidth;
        var dpHeight = drawingpaper.canvas.offsetHeight;

        var roomimg = drawingpaper.image("images/cartoonroom.jpg", 0, 0, dpWidth, dpHeight);
 
        //==================================================================
        // DRAWING + SLIDERS TO CHANGE COLOURS/STROKE-WIDTH + CLEAR PAPER                   
        //==================================================================

        var raphaelPath; // for holding the raphael path
        var pathString; // for holding the path string
        var mousePushed = false; // for remembering the state of the mouse.

        drawdiv.addEventListener('mousedown', function(ev){
            pathString = "M " + ev.offsetX + ", " + ev.offsetY; 
            raphaelPath = drawingpaper.path(pathString);
            console.log("pathstring is " + pathString);
            mousePushed = true;

            var colorString = "hsl(" + mySliderH.value + "," + mySliderS.value + "," + mySliderL.value + ")";
            var sliderstroke = StrokeSlider.value;
            console.log("colorString is " + colorString + "and stroke width is " + sliderstroke);
            raphaelPath.attr({"stroke-width": sliderstroke, "stroke": colorString});

        });

        drawdiv.addEventListener('mousemove', function(ev){
        if (mousePushed == true) {
            pathString += " L " + ev.offsetX + ", " + ev.offsetY;
            raphaelPath = drawingpaper.path(pathString);
            console.log("pathstring is " + pathString);

            var colorString = "hsl(" + mySliderH.value + "," + mySliderS.value + "," + mySliderL.value + ")";
            var sliderstroke = StrokeSlider.value;
            console.log("colorString is " + colorString + "and stroke width is " + sliderstroke);
            raphaelPath.attr({"stroke-width": sliderstroke, "stroke": colorString});

        }; 
        });

        drawdiv.addEventListener('mouseup', function(ev){
            pathString += " L " + ev.offsetX + ", " + ev.offsetY; 
            raphaelPath = drawingpaper.path(pathString);
            console.log("pathstring is " + pathString);
            mousePushed = false;
            
            var colorString = "hsl(" + mySliderH.value + "," + mySliderS.value + "," + mySliderL.value + ")";
            var sliderstroke = StrokeSlider.value;
            console.log("colorString is " + colorString + "and stroke width is " + sliderstroke);
            raphaelPath.attr({"stroke-width": sliderstroke, "stroke": colorString});

         });

        // clear canvas 
        button.addEventListener("click", function(ev) {
            drawingpaper.clear();
            var roomimg = drawingpaper.image("images/cartoonroom.jpg", 0, 0, dpWidth, dpHeight);
            var roomcat = drawingpaper.image("images/cutecat1.png", dpHeight, dpHeight/2, 70, 70); 
            var roomcat2 = drawingpaper.image("images/cutecat2.gif", 550, dpHeight/2, 150, 150);  
            var roomcat3 = drawingpaper.image("images/cutecat3.gif", 150, 230, 80, 80);
            var roomcat4 = drawingpaper.image("images/cutecat4.gif", 700, 150, 100, 100);

        });

        //==================================================================
        // CAT VISUALS IN THE ROOM                    
        //==================================================================

        var roomcat = drawingpaper.image("images/cutecat1.png", dpHeight, dpHeight/2, 70, 70); 
        var roomcat2 = drawingpaper.image("images/cutecat2.gif", 550, dpHeight/2, 150, 150);
        var roomcat3 = drawingpaper.image("images/cutecat3.gif", 150, 230, 80, 80);
        var roomcat4 = drawingpaper.image("images/cutecat4.gif", 700, 150, 100, 100);

        //==================================================================
        // 3. CAT LOVERS CHAT                 
        //==================================================================

        var iosocket = io.connect();

        var typingBox = document.getElementById("outgoingChatMessage");    
        var chatBox = document.getElementById("chatBox");

        var uname = prompt("Please enter a username to chat!");
        var uname = uname || "anon";

        iosocket.on('connect', function () {
        console.log("Yo.........connected!");

        // MESSAGE PROCESSING HERE --------------
        iosocket.on('message',function (m) {
            if (m.mtype == "text") {
            console.log("yep, got a message: " + m.data);
            chatBox.value += m.uname + "> " + m.data + "\n";} 

        });

        //---------------------------------------
        
        iosocket.on('disconnect', function() {
            console.log("Disconnected")
        });
    });

        // When the user is typing and hits 'return', add the 
        // message to the chat window and send the text to the server (and thus to others)
        typingBox.addEventListener('keypress', function(event){
        var mymessage; // holds tet from the typingBox
        console.log('key code is ' + event.which);
        if(event.which === 13) {  // 'return' key
            event.preventDefault();


        //-----------get text, construct message object and send ------------------------------
        mymessage = typingBox.value;
        chatBox.value += uname + "> " + mymessage + "\n";
        typingBox.value = "";

        iosocket.send({"uname" : uname, "data" : mymessage, "mtype" : "text"});
        //-------------------------------------------------------------
        };
    });
    

    });


    


    






        
  

