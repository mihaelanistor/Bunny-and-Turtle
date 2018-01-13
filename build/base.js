
var player = true;
var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];


console.log(player1);
console.log(player2);

function updateScore() {
    var params = "player=";
    
    if (player) {
        params = params + player2; 
    } else {
        params = params + player1; 
    }


   console.log("Params is ");
   console.log(params);

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
		console.log("Score updated");
	}
    };
    xhttp.open("POST", "/update-score", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params); 

    loadScore();
}

function loadScore() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("scor").innerHTML = this.responseText;
       }
    };
    xhttp.open("GET", "/get-score", true);
    xhttp.send(); 
}


function changePlayer() {

        if (player) {
            document.getElementById('player1').style.fontSize = "xx-large";
            document.getElementById('player2').style.fontSize = "x-large";
            
        } else {
            document.getElementById('player2').style.fontSize = "xx-large";
            document.getElementById('player1').style.fontSize = "x-large";
        }

        player = !player;
}

function initBoard() {
    console.log("Initializing board");
    
    loadScore();

    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
        if ((' ' + elems[i].className + ' ').indexOf(' cell ') > -1) {

            elems[i].addEventListener("click", function () {

                var x = this.getAttribute("i");
                var y = this.getAttribute("j");

                if (board[x][y] != 0) {
                    return;
                }
                if (player == false) {
                    this.innerHTML = '<img src="images/bunny.png">';
                }
                else {
                    this.innerHTML = '<img src="images/turtle.png">';
                }

                var val;
                if (player) {
                    val = 2;
                } else {
                    val = 1;
                }

                board[x][y] = val;
                checkWinner();
                checkFullBoard();

		changePlayer();
                
            });
        }
    }
}

function gameOver(val) {
	    if (val == 1) {
            	alert("A castigat jucatorul " + player1);
	    } else {
            	alert("A castigat jucatorul " + player2);
	    }

	updateScore();
        resetBoard();            
}

function checkWinner() {
    console.log(board);
    
    for (var i = 0; i < 3; i++) {
        //verificare pe linii
        if((board[i][0] == board[i][1]) && (board[i][1] == board[i][2]) && board[i][0] != 0) {
	    gameOver(board[i][0]);
            return;
        }

        //verificare pe coloane
        if ((board[0][i] == board[1][i]) && (board[1][i] == board[2][i]) && board[0][i] != 0) {
	    gameOver(board[0][i]);
            return;

        }
    }

    if ((board[0][0] == board[1][1]) && (board[1][1] == board[2][2]) && board[0][0] != 0) {
	gameOver(board[0][0]);
        return;
    }

    if ((board[0][2] == board[1][1]) && (board[1][1] == board[2][0]) && board[0][2] != 0) {
	gameOver(board[0][2]);
        return;
    }

}

function checkFullBoard() {
    
    for(var i = 0; i < 3; i++)
    {
        for(var j = 0; j < 3; j++)
        {
            if(board[i][j] == 0)
            return;
        }
    }
    alert("Remiza!");
    resetBoard();
}



function resetBoard() {
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    changePlayer();

    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
        if ((' ' + elems[i].className + ' ').indexOf(' cell ') > -1) {
            elems[i].innerHTML = '<img src="images/none.png" class="darkableImage" onmouseout="this.style.opacity=1" onmouseover="this.style.opacity=0.5" />';
        }
    }
}

function startGame() {
    console.log("game started");
    resetBoard();
    initBoard();
}


document.addEventListener("DOMContentLoaded", startGame);
