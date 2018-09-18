startGame();

// funkcja obsługująca całą grę
function startGame() {
    var newGame = document.getElementById('newGame');
    var params = {
        roundNumber: 0,
        numberOfRounds: 0,
        playerPoints: 0,
        computerPoints: 0,
        progress: [],
    };

    disableButtons(true);
    infoPressNewGame();

    // przypisanie akcji do przycisków - paper rock scissors
    var playerButtons = document.querySelectorAll('.player-move');
    for (i = 0; i < playerButtons.length; i++) {
        playerButtons[i].addEventListener('click', function () {
            var clickValue = this.getAttribute("data-move");
            playerMove(clickValue);
        });
    }
    // przypisanie akcji do przycisku newgame
    newGame.addEventListener('click', function () {
        runNewGame();
    });


    // funkcja playerMove 
    function playerMove(playerClicked) {
        params.roundNumber += 1;
        var compMove = computerMove();
        var roundWinner = compare(playerClicked, compMove);
        clearBox(output);
        roundResultDisplay(roundWinner);
        output.insertAdjacentHTML('beforeend', ' You chose ' + playerClicked + ' and computer chose ' + compMove + '<br><br>');
        // wywołanie funkcji, ktora dodaje do tablicy wyniki dla danej rundy
        roundResultsCounter();
        pointCounter();
    }

    // funkcja comprMove - losuje ruch komputera
    function computerMove() {
        var cMove = Math.floor(Math.random() * 3 + 1);
        if (cMove === 1) {
            cMove = 'PAPER';
        }
        else if (cMove === 2) {
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
            roundWinner = '<b>COMPUTER WON</b> ';
            params.computerPoints += 1;
        }
        // remis
        else if (playerClicked === computerMove) {
            roundWinner = 'It is a tie. <b>NO ONE WINS</b>';
        }
        // wygrana gracza
        else {
            roundWinner = '<b>YOU WON</b>';
            params.playerPoints += 1;
        }
        return roundWinner;
    }

    // function: displays round's results         
    function roundResultDisplay(whoWins) {
        output.insertAdjacentHTML('afterbegin', whoWins);
    }

    // function: clears a div
    function clearBox(elementID) {
        elementID.innerHTML = '';
    }

    function pointCounter() {
        clearBox(results);
        var leftToWin = 0;
        results.innerHTML = 'PLAYER POINTS:  ' + params.playerPoints + ' ----- ' + ' COMPUTER POINTS: ' + params.computerPoints;
        if (params.computerPoints === params.numberOfRounds) {
            displayGameWinner('COMPUTER WINS THE GAME !');
        }
        else if (params.playerPoints === params.numberOfRounds) {
            displayGameWinner('YOU WIN THE GAME !');
        }
        else {
            leftToWin = params.numberOfRounds - params.playerPoints;
            results.insertAdjacentHTML('beforeend', '<br><br>' + 'You need to win ' + leftToWin + ' rounds more.');
        }
    }

    function roundResultsCounter() {
        params.progress.push(params.roundNumber);
    } 

    function runNewGame() {
        disableButtons(false);
        params.roundNumber = 0;
        params.numberOfRounds = 0;
        params.computerPoints = 0;
        params.playerPoints = 0;
        clearBox(output);
        clearBox(results);
        clearBox(resultsModal); 
        params.numberOfRounds = window.prompt('How many rounds to win the game ? Please enter a number');
        params.numberOfRounds = parseInt(params.numberOfRounds);
        if (isNaN(params.numberOfRounds)) {
            results.innerHTML = '<br>This is not a number. Please type in a number.' + '<br><br>' + output.innerHTML;
            disableButtons(true);
            setTimeout(infoPressNewGame, 2000)
        }
        else if (params.numberOfRounds < 1) {
            results.innerHTML = '<br>Please enter at least 1.';
            disableButtons(true);
            setTimeout(infoPressNewGame, 2000)
        }
        else if (params.numberOfRounds > 20) {
            results.innerHTML = '<br>Are you serious you want to play ' + params.numberOfRounds + ' rounds ?';
            results.insertAdjacentHTML('beforeend', '<br>' + 'Please enter a smaller number');
            disableButtons(true);
            setTimeout(infoPressNewGame, 3000)
        }
        else {
            params.computerPoints = 0;
            params.playerPoints = 0;
            pointCounter();
        }
    }
    function disableButtons(value) {
        for (i = 0; i < 3; i++) {
            document.getElementsByClassName('player-buttons')[i].disabled = value;
        }
    }

    function infoPressNewGame() {
        clearBox(output);
        clearBox(results);
        results.insertAdjacentHTML('beforeend', '<br>' + '<b><span style="color:#FF0000">PRESS "NEW GAME" BUTTON');
    }

    function displayGameWinner(gamewinner) {
        disableButtons(true);
        // wyświetlenie modala
        document.querySelector("#modal-overlay").classList.add("show");
        document.querySelector(".modal").classList.add("show");
        clearBox(resultsModal); 
        
        // wyświetlenie wyniku gry
        resultsModal.innerHTML="";
        resultsModal.insertAdjacentHTML('beforebegin', '<br><br>' + '<span style="color:#FF0000">' + gamewinner);

        //wyświetlenie tabeli z wynikami rund
        resultsModal.insertAdjacentHTML('beforeend', '<br>' + '<span style="color:#000000">' + params.roundNumber);
        

        
        //funkcja - zamykanie modala
        var hideModal = function (event) {
            event.preventDefault();
            document.querySelector('#modal-overlay').classList.remove('show');
        };
        // sprawdzenie czy został kliknięty przycisk "x"
        var closeButton = document.querySelector('.modal .close');
        closeButton.addEventListener('click', hideModal);
        // sprawdzenie czy zostało kliknięte tło 
        document.querySelector('#modal-overlay').addEventListener('click', hideModal);
    

        // setTimeout(infoPressNewGame, 2000);
    }

} // koniec funkcji startGame 