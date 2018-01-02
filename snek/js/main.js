// For an introduction to the Blank template, see the following documentation:
// https://go.microsoft.com/fwlink/?LinkId=232509

(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var isFirstActivation = true;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.voiceCommand) {
			// TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
			// this is a good place to decide whether to populate an input field or choose a different initial view.
		}
		else if (args.detail.kind === activation.ActivationKind.launch) {
			// A Launch activation happens when the user launches your app via the tile
			// or invokes a toast notification by clicking or tapping on the body.
			if (args.detail.arguments) {
				// TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
				// to take the user in response to them invoking a toast notification.
			}
			else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
				// TODO: This application had been suspended and was then terminated to reclaim memory.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
				// Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
			}
		}

		if (!args.detail.prelaunchActivated) {
			// TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
			// In that case it would be suspended shortly thereafter.
			// Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
			// should be done here (to avoid doing them in the prelaunch case).
			// Alternatively, this work can be done in a resume or visibilitychanged handler.
		}

		if (isFirstActivation) {
			// TODO: The app was activated and had not been running. Do general startup initialization here.
			document.addEventListener("visibilitychange", onVisibilityChanged);
			args.setPromise(WinJS.UI.processAll());
		}

		isFirstActivation = false;
	};

	function onVisibilityChanged(args) {
		if (!document.hidden) {
			// TODO: The app just became visible. This may be a good time to refresh the view.
		}
	}

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().

    };

    var UI, myHi, colors;

    myHi = 0;

    colors = ["#256432", "#856343", "#244452", "#6CFA04"];

    var heads = ["../images/assets_0/head.png", "../images/assets_1/head.png", "../images/assets_2/head.png", "../images/assets_3/head.png"];
    var tails = ["../images/assets_0/tail.png", "../images/assets_2/tail.png", "../images/assets_2/tail.png", "../images/assets_3/tail.png"];
    var bodys = ["./images/assets_0/body.png", "./images/assets_1/body.png", "./images/assets_2/body.png", "../images/assets_3/body.png"];
    var foods = ["../images/assets_0/food.png", "../images/assets_1/food.png", "../images/assets_2/food.png", "../images/assets_3/food.png"];

    UI = {
        byTag: (x) => { return document.getElementsByTagName(x); },
        bySel: (x) => { return document.querySelector(x); },
        bySelAll: (x) => { return document.querySelectorAll(x); },
        createEle: (x) => { return document.createElement(x); },
        myLoad: () => {
            window.addEventListener("keydown", moveSnake, false);
            var game_over = false;
            var snake = new Array(4);
            var snakeLen = 4;
            var dir = "right";
            var food = "";
            var level = new Array();
                
            var total_height = 640;
            var total_width = 640;
            var lvl_width = 20;
            var lvl_height = 20;
            var speed = 1000;

            const canvas = document.getElementById('myCanvas');
            const context = canvas.getContext('2d');

            var colorPick = localStorage.getItem("colorPick");

            var snakeHeadImage = new Image();
            snakeHeadImage.src = heads[colorPick];
            var snakeBodyImage = new Image();
            snakeBodyImage.src = bodys[colorPick];
            var snakeTailImage = new Image();
            snakeTailImage.src = tails[colorPick];

            //food
            var foodImage = new Image();
            foodImage.src = foods[colorPick];

            create_snake();
            create_food();
            
            for (var i = 0; i < lvl_width; i++) {
                level[i] = new Array(lvl_height);
                for (var ii = 0; ii < lvl_height; ii++) {
                    level[i][ii] = -1;
                }
            }
            

            window.requestAnimFrame = (function (callback) {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, speed);
                    };
            })();

            var the_date = new Date();
            var test1 = the_date.getTime();
            var stamp = the_date.getTime() + 250;

            function animate() {
                the_date = new Date();
                test1 = the_date.getTime();
                if (stamp <= test1) {
                    move_snake();
                    the_date = new Date();
                    stamp = the_date.getTime() + 250;
                }
                if (game_over == false) {
                    // clear
                    var snLen = snakeLen - 4,
                        myHi = localStorage.getItem("myHi");
                    if (snLen >= +myHi) {
                        localStorage.setItem("myHi", snLen);
                    }
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    displayText("Score: " + snLen) + "";
                    display();
                }
                else {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    displayText("Game Over!");
                    UI.gameOverFunc();
                    return false;
                }
                //context.drawImage(aniblock, aniblock_x, aniblock_y); 

                // request new frame
                requestAnimFrame(function () {
                    animate();
                });
            }

            function displayText(what) {
                context.font = "30px Arial";
 
                context.fillText(what, 50, 50);
            }

            function checkSnakeCollide() {
                if (snake[0].xx == food.xx && snake[0].yy == food.yy) {
                    create_food();
                    return true;
                }
                else {
                    //if head moving right
                    if (dir == "right") {
                        if (snake[0].xx > lvl_width - 1) {
                            game_over = true;
                        }
                    }
                    else if (dir == "left") {
                        if (snake[0].xx < 0) {
                            game_over = true;
                        }
                    }
                    else if (dir == "up") {
                        if (snake[0].yy <= -1) {
                            game_over = true;
                        }
                    }
                    else if (dir = "down") {
                        if (snake[0].yy >= lvl_height) {
                            game_over = true;
                        }
                    }

                    for (i = 2; i < snakeLen; i++) {
                        if ((snake[0].xx == snake[i].xx) && (snake[0].yy == snake[i].yy)) {
                            game_over = true;
                            break;
                        }
                    }

                    return false;
                }
            }

            setTimeout(function () {
                animate();
            }, speed);

            function moveSnake(e) {
                switch (e.keyCode) {
                    case 37:
                        if (dir != "right") {
                            dir = "left";
                        }
                        break;
                    case 38:
                        if (dir != "down") {
                            dir = "up";
                        }
                        break;
                    case 39:
                        if (dir != "left") {
                            dir = "right";
                        }
                        break;
                    case 40:
                        if (dir != "up") {
                            dir = "down";
                        }
                        break;
                }
            }

            function checkAllowMove(x, y) {
                if (x < 32) {
                    var x_index = 0;
                }
                else {
                    var x_index = Math.round(x / 32);
                }

                if (y < 32) {
                    var y_index = 19;
                }
                else {
                    var y_index = (total_height / 32) - Math.round(y / 32);
                }

                if (level[x_index][y_index] == -1) {
                    return true;
                }
                else {
                    return false;
                }
            }

            function create_food() {
                var x = 0;
                var y = 0;
                var recreate = false;
                do {
                    recreate = false;
                    x = Math.floor((Math.random() * (lvl_width - 1)));
                    y = Math.floor((Math.random() * (lvl_height - 1)));

                    for (var i = 0; i < snakeLen; i++) {
                        if ((snake[i].xx == x) && (snake[i].yy == y)) {
                            recreate = true;
                            break;
                        }
                    }
                } while (recreate == true);
                food = { xx: x, yy: y };
            }

            function create_snake() {
                //var x =  Math.floor((Math.random() * (lvl_width-1)));
                //var y =  Math.floor((Math.random() * (lvl_height-1)));
                snake[0] = { xx: 4, yy: 1 };
                snake[1] = { xx: 3, yy: 1 };
                snake[2] = { xx: 2, yy: 1 };
                snake[3] = { xx: 1, yy: 1 };
                dir = "right";
            }

            function move_snake() {
                var temp_x = 0;
                var temp_y = 0;
                var temp_xx = 0;
                var temp_yy = 0;
                var swap = true;

                //move snake forward
                for (var ii = 0; ii < snakeLen; ii++) {
                    if (ii == 0) {
                        temp_x = snake[ii].xx;
                        temp_y = snake[ii].yy;

                        //if head moving right
                        if (dir == "right") {
                            snake[0] = { xx: (snake[0].xx + 1), yy: snake[0].yy };
                        }
                        else if (dir == "left") {
                            snake[0] = { xx: (snake[0].xx - 1), yy: snake[0].yy };
                        }
                        else if (dir == "up") {
                            snake[0] = { xx: snake[0].xx, yy: (snake[0].yy - 1) };
                        }
                        else if (dir = "down") {
                            snake[0] = { xx: snake[0].xx, yy: (snake[0].yy + 1) };
                        }

                        if (checkSnakeCollide()) {
                            snake.push({ xx: snake[(snake.length - 1)].xx, yy: snake[(snake.length - 1)].yy });
                            snakeLen++;
                        }
                    }
                    else {
                        if (swap == true) {
                            temp_xx = snake[ii].xx;
                            temp_yy = snake[ii].yy;
                            snake[ii] = { xx: temp_x, yy: temp_y };

                            swap = false;
                        }
                        else {
                            temp_x = snake[ii].xx;
                            temp_y = snake[ii].yy;
                            snake[ii] = { xx: temp_xx, yy: temp_yy };
                            swap = true;
                        }
                    }
                }

            }

            function display() {

                for (var i = 0; i < snakeLen; i++) {
                    if (i == 0) {
                        switch (dir) {
                            case "left":
                                context.drawImage(snakeHeadImage, (snake[i].xx * 32), (snake[i].yy * 32));
                                break;
                            case "right":
                                drawRotatedImage(snakeHeadImage, (snake[i].xx * 32), (snake[i].yy * 32), 180);
                                break;
                            case "up":
                                drawRotatedImage(snakeHeadImage, (snake[i].xx * 32), (snake[i].yy * 32), 90);
                                break;
                            case "down":
                                drawRotatedImage(snakeHeadImage, (snake[i].xx * 32), (snake[i].yy * 32), 270);
                                break;
                        }
                    }
                    else if (i == (snakeLen - 1)) {
                        //following left
                        if (snake[i].xx > snake[i - 1].xx) {
                            context.drawImage(snakeTailImage, (snake[i].xx * 32), (snake[i].yy * 32));
                        }
                        //following right
                        else if (snake[i].xx < snake[i - 1].xx) {
                            drawRotatedImage(snakeTailImage, (snake[i].xx * 32), (snake[i].yy * 32), 180);

                        }
                        //following up
                        else if (snake[i].yy > snake[i - 1].yy) {
                            drawRotatedImage(snakeTailImage, (snake[i].xx * 32), (snake[i].yy * 32), 90);
                            
                        }
                        //following down
                        else if (snake[i].yy < snake[i - 1].yy) {
                            drawRotatedImage(snakeTailImage, (snake[i].xx * 32), (snake[i].yy * 32), 270);
                            
                        }
                    }
                    else {
                        //following left
                        if (snake[i].xx > snake[i - 1].xx) {
                            context.drawImage(snakeBodyImage, (snake[i].xx * 32), (snake[i].yy * 32));
                        }
                        //following right
                        else if (snake[i].xx < snake[i - 1].xx) {
                            drawRotatedImage(snakeBodyImage, (snake[i].xx * 32), (snake[i].yy * 32), 180);

                        }
                        //following up
                        else if (snake[i].yy > snake[i - 1].yy) {
                            drawRotatedImage(snakeBodyImage, (snake[i].xx * 32), (snake[i].yy * 32), 90);

                        }
                        //following down
                        else if (snake[i].yy < snake[i - 1].yy) {
                            drawRotatedImage(snakeBodyImage, (snake[i].xx * 32), (snake[i].yy * 32), 270);

                        }
                    }

                }

                context.drawImage(foodImage, (food.xx * 32), (food.yy * 32));

            }

            function drawRotatedImage(image, x, y, angle) {
                var TO_RADIANS = Math.PI / 180;

                // save the current co-ordinate system 
                // before we screw with it
                context.save();

                // move to the middle of where we want to draw our image
                context.translate(x, y);

                // rotate around that point, converting our 
                // angle from degrees to radians 
                context.rotate(angle * TO_RADIANS);

                // draw it up and to the left by half the width
                // and height of the image 
                context.drawImage(image, -(image.width / 2), -(image.height / 2));

                // and restore the co-ords to how they were when we began
                context.restore();
            }
        },
        init: () => {
            var colorPick = localStorage.getItem("colorPick");
            if (!colorPick) {

                colorPick = 3;
                localStorage.setItem("colorPick", colorPick);
            }

            var myHi = localStorage.getItem("myHi");
            if (!myHi) {

                myHi = 0;
                localStorage.setItem("myHi", myHi);
            }

            var body = UI.byTag("body"),
                startBTN = UI.createEle("button"),
                myHiChart = UI.createEle("td"),
                myTable = UI.createEle("table"),
                mySnakes = UI.createEle("table");

            startBTN.className = "startBTN";
            startBTN.innerHTML = "START";
            startBTN.onclick = UI.startProcess(startBTN);

            myHiChart.className = "myHiChart";
            myHiChart.innerHTML = "" + myHi + "";

            myTable.innerHTML = "<h2><strong>Highscore</strong></h2>";

            myTable.appendChild(myHiChart);

            mySnakes.innerHTML = "sneks";

            for (var k = 0; k < 4; k++) {
                var elems = UI.createEle("td");

                elems.innerHTML = "&nbsp;";
                elems.style.backgroundColor = colors[k];
                elems.className = "snekBox";
                elems.onclick = UI.colorSelected(elems, k);

                mySnakes.appendChild(elems);
            }
            body[0].appendChild(startBTN);
            body[0].appendChild(myTable);
            body[0].appendChild(mySnakes);

            UI.checkSnek(elems);
        },
        checkSnek: () => {
            var colorPick = localStorage.getItem("colorPick"), elems;

            elems = UI.bySelAll(".snekBox");

            elems[0].style.boxShadow = "0 0 10px rgba(0,0,0,0)";
            elems[1].style.boxShadow = "0 0 10px rgba(0,0,0,0)";
            elems[2].style.boxShadow = "0 0 10px rgba(0,0,0,0)";
            elems[3].style.boxShadow = "0 0 10px rgba(0,0,0,0)";

            elems[colorPick].style.boxShadow = "0 0 10px yellow";
        },
        colorSelected: (elems, k) => {
            return () => {
                localStorage.setItem("colorPick", k);

                UI.checkSnek();
            }
        },
        startProcess: (startBTN) => {
            return () => {
                startBTN.remove();
                setTimeout(() => {
                    UI.myLoad();
                }, 200);
            }
        },
        gameOverFunc: () => {
            location.reload();
        }
    };
    window.onload = () => {
        UI.init();
        //localStorage.clear();
    };
	app.start();

})();
