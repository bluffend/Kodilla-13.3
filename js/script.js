'use strict'

startGame();

// funkcja obsługująca całą grę
function startGame() {
    var newGame = document.getElementById('newGame');
    var output = document.getElementById('output');
    var results = document.getElementById('results');
    var headerModal = document.getElementById('headerModal');
    var resultsModal = document.getElementById('resultsModal');
    var params = {
        roundNumber: 0,
        numberOfRounds: 0,
        playerPoints: 0,
        computerPoints: 0,
        progress: [],
    };
    var currentRoundFullResults = {
        currentRoundNumber: 0, // numer aktualnej rundy
        playerChoice: "", // wybór gracza
        computerChoice: "", // wybór (wylosowany) komputera
        currentRoundWinner: "", // zwycięzca aktualnej rundy
        gameResultsAfterCurrentRound: "", // wynik gry po aktualnej rundzie
    };

    disableButtons(true);
    infoPressNewGame();

    // przypisanie akcji do przycisków - paper rock scissors
    var playerButtons = document.querySelectorAll('.player-move');
    for (var i = 0; i < playerButtons.length; i++) {
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
        roundResultsCounter(playerClicked, compMove, roundWinner);
        pointCounter();
    }

    // funkcja comprMove - losuje ruch komputera
    function computerMove() {
        var cMove = Math.floor(Math.random() * 3 + 1);
        if (cMove === 1) {
            return 'PAPER';
        }
        else if (cMove === 2) {
            return 'ROCK';
        }
        else
            return 'SCISSORS';
    }

    // porównanie wyboru gracza i komputera, dodanie punktów 
    function compare(playerClicked, computerMove) {
        var roundWinner;
        //sytuacje kiedy wygrywa komputer
        if (
            (computerMove === 'ROCK' && playerClicked === 'SCISSORS') ||
            (computerMove === 'SCISSORS' && playerClicked === 'PAPER') ||
            (computerMove === 'PAPER' && playerClicked === 'ROCK')) {
            params.computerPoints += 1;
            return 'COMPUTER WON';

        }
        // remis
        else if (playerClicked === computerMove) {
            return 'It is a tie. NO ONE WINS';
        }
        // wygrana gracza
        else {
            params.playerPoints += 1;
            return 'YOU WON';
        }
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

    function roundResultsCounter(playerClicked, compMove, roundWinner) {
        var currentResult = params.playerPoints + "-" + params.computerPoints;

        currentRoundFullResults = {
            currentRoundNumber: params.roundNumber, // numer aktualnej rundy
            playerChoice: playerClicked, // wybór gracza
            computerChoice: compMove, // wybór (wylosowany) komputera
            currentRoundWinner: roundWinner, // zwycięzca aktualnej rundy
            gameResultsAfterCurrentRound: currentResult, // wynik gry po aktualnej rundzie
        };
        params.progress.push(currentRoundFullResults);
    }

    function runNewGame() {
        disableButtons(false);
        params.roundNumber = 0;
        params.numberOfRounds = 0;
        params.computerPoints = 0;
        params.playerPoints = 0;
        params.progress = [];
        currentRoundFullResults = {
            currentRoundNumber: 0, // numer aktualnej rundy
            playerChoice: "", // wybór gracza
            computerChoice: "", // wybór (wylosowany) komputera
            currentRoundWinner: "", // zwycięzca aktualnej rundy
            gameResultsAfterCurrentRound: "", // wynik gry po aktualnej rundzie
        };
        clearBox(output);
        clearBox(results);
        clearBox(resultsModal);
        var getNumberOfRounds;
        getNumberOfRounds = window.prompt('How many rounds to win the game ? Please enter a number');
        params.numberOfRounds = parseInt(getNumberOfRounds);
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
        var buttons = document.getElementsByClassName('player-buttons');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = value;
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
        headerModal.innerHTML = gamewinner;

        //wyświetlenie tabeli z wynikami rund
        generateTable();

        //funkcja - zamykanie modala
        var hideModal = function (event) {
            event.preventDefault();
            document.querySelector('#modal-overlay').classList.remove('show');
            infoPressNewGame();
        };
        // sprawdzenie czy został kliknięty przycisk "x"
        var closeButton = document.querySelector('.modal .close');
        closeButton.addEventListener('click', hideModal);
        // sprawdzenie czy zostało kliknięte tło 
        document.querySelector('#modal-overlay').addEventListener('click', hideModal);

        //stop propagation
        document.querySelector(".modal").addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }

    // na podstawie dokumentacji z: developer.mozilla.org
    function generateTable() {

        // get the reference for the body 
        var body = document.getElementById('resultsModal');

        // creates a <table> element and a <tbody> element
        var tbl = document.createElement("table");
        var tblHead = document.createElement("thead");
        var tblBody = document.createElement("tbody");
        tblBody.setAttribute("id", "tBody");

        // create table row with column names
        var row = document.createElement("tr");
        createTableCell("Round no.", row);
        createTableCell("Player move", row);
        createTableCell("Computer move", row);
        createTableCell("Round's results", row);
        createTableCell("Game results", row);

        // add the column names' row to the end of the table head
        tblHead.appendChild(row);

        
        // creating cells with results

        function createTableCell(input, newRow) {
            var cell = document.createElement("td");
            var cellText = document.createTextNode(input);
            cell.appendChild(cellText);
            newRow.appendChild(cell);
        };

        for (var i = 0; i < params.roundNumber; i++) {
            // creates a table row
            var row = document.createElement("tr");
            createTableCell(params.progress[i].currentRoundNumber, row);
            createTableCell(params.progress[i].playerChoice, row);
            createTableCell(params.progress[i].computerChoice, row);
            createTableCell(params.progress[i].currentRoundWinner, row);
            createTableCell(params.progress[i].gameResultsAfterCurrentRound, row);

            // add the row to the end of the table body
            tblBody.appendChild(row);
        }
        // put the <tbody> and <thead> in the <table> 
        tbl.appendChild(tblHead);
        tbl.appendChild(tblBody);
        // appends <table> into <body>
        body.appendChild(tbl);


        if (params.roundNumber > 5) {
            document.getElementById("tBody").style.width = "555px";
        };
    }

} // koniec funkcji startGame 