startGame();

// funkcja obsługująca całą grę
function startGame() {
    var paperButton = document.getElementById('paperButton');
    var rockButton = document.getElementById('rockButton');
    var scissorsButton = document.getElementById('scissorsButton');
    var newGame = document.getElementById('newGame');
    var numberOfRounds = 0;
    var playerPoints = 0;
    var computerPoints = 0;

    disableButtons();
    infoPressNewGame ();

    // przypisanie akcji do przycisków - paper rock scissors newgame
    paperButton.addEventListener('click', function () {
        playerMove('PAPER');
    });
    rockButton.addEventListener('click', function () {
        playerMove('ROCK');
    });
    scissorsButton.addEventListener('click', function () {
        playerMove('SCISSORS');
    });
    newGame.addEventListener('click', function () {
        runNewGame();
    });


    // funkcja playerMove 
    function playerMove(playerClicked) {
        var compMove = computerMove();
        var roundWinner = compare(playerClicked, compMove);
        clearBox(output);
        roundResultDisplay(roundWinner);
        output.insertAdjacentHTML('beforeend', ' You chose ' + playerClicked + ' and computer chose ' + compMove + '<br><br>');
        pointCounter();
    }

    // funkcja comprMove - losuje ruch komputera
    function computerMove() {
        var cMove = Math.floor(Math.random() * 3 + 1);
        if (cMove == 1) {
            cMove = 'PAPER';
        }
        else if (cMove == 2) {
            cMove = 'ROCK';
        }
        else cMove = 'SCISSORS';
        return cMove;
    }

    // porównanie wyboru gracza i komputera, dodanie punktów 
    function compare(playerClicked, computerMove) {

        //sytuacje kiedy wygrywa komputer
        if (
            (computerMove === 'ROCK' && playerClicked === 'SCISSORS') ||
            (computerMove === 'SCISSORS' && playerClicked === 'PAPER') ||
            (computerMove === 'PAPER' && playerClicked === 'ROCK')) {
            roundWinner = '<b>COMPUTER WON:</b> ';
            computerPoints += 1;
        }
        // remis
        else if (playerClicked === computerMove) {
            roundWinner = 'It is a tie. <b>NO ONE WINS:</b>';
        }
        // wygrana gracza
        else {
            roundWinner = '<b>YOU WON:</b>';
            playerPoints += 1;
        }
        return roundWinner;
    }

    // function: displays round's results         
    function roundResultDisplay(whoWins) {
        output.insertAdjacentHTML('afterbegin', whoWins);
    }

    // function: clears a div
    function clearBox(elementID) {
        elementID.innerHTML = "";
    }


    function pointCounter() {
        clearBox(results);
        var leftToWin = 0;
        results.innerHTML= 'PLAYER POINTS:  ' + playerPoints + ' ----- ' + ' COMPUTER POINTS: ' + computerPoints;
        if (computerPoints === numberOfRounds){
            results.insertAdjacentHTML('beforeend','<br><br>'+ '<span style="color:#FF0000">COMPUTER WINS THE GAME! ');
            disableButtons();
            setTimeout(infoPressNewGame, 2000);
        }
        else if (playerPoints === numberOfRounds) {
            results.insertAdjacentHTML('beforeend','<br><br>'+ '<span style="color:#FF0000">YOU WIN THE GAME! ');
            disableButtons();
            setTimeout(infoPressNewGame, 2000);
        }
        else {
            leftToWin = numberOfRounds - playerPoints;
            results.insertAdjacentHTML('beforeend','<br><br>'+ 'You need to win ' + leftToWin + ' rounds more.');
        }
    }
    
    
    function runNewGame() {
        
        enableButtons();
        
        computerPoints = 0;
        playerPoints = 0;
        clearBox(output);
        clearBox(results);
        numberOfRounds = window.prompt('How many rounds to win the game ? Please enter a number');
        numberOfRounds = parseInt(numberOfRounds);
        if (isNaN(numberOfRounds)) {
            results.innerHTML = '<br>This is not a number. Please type in a number.' + '<br><br>' + output.innerHTML;
            disableButtons();
            setTimeout(infoPressNewGame, 2000)
        }
        else if (numberOfRounds<1) {
            results.innerHTML = '<br>Please enter at least 1.';
            disableButtons();
            setTimeout(infoPressNewGame, 2000)
        }
        else if (numberOfRounds>20) {
            results.innerHTML = '<br>Are you serious you want to play ' + numberOfRounds + ' rounds ?';
            results.insertAdjacentHTML('beforeend','<br>'+ 'Please enter a smaller number');
            disableButtons();
            setTimeout(infoPressNewGame, 3000)
        }
        else {
            computerPoints = 0;
            playerPoints = 0;
            pointCounter();
        }
    }
    

    function disableButtons() {
        document.getElementsByClassName('player-buttons')[0].disabled = true;
        document.getElementsByClassName('player-buttons')[1].disabled = true;
        document.getElementsByClassName('player-buttons')[2].disabled = true;
        
    }
    
    function enableButtons() {
        document.getElementsByClassName('player-buttons')[0].disabled = false;
        document.getElementsByClassName('player-buttons')[1].disabled = false;
        document.getElementsByClassName('player-buttons')[2].disabled = false;
    }

    function infoPressNewGame (){
        clearBox(output);
        clearBox(results);
        results.insertAdjacentHTML('beforeend','<br>'+ '<b><span style="color:#FF0000">PRESS "NEW GAME" BUTTON');
    }

} // koniec funkcji startGame 