
console.log('Welcome to Tic Tac Toe');

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    const getBoard = () => board;

    const resetBoard = () => {
        //Create game board
    for(let i=0;i<rows;i++){
        board[i] = [];
        for(let j=0;j<columns;j++){
            board[i].push(Cell());
        }
    }
    };

    const markCell = (row, column, playerMark) => {
        if(!board[row][column].getValue()){
            board[row][column].addMarker(playerMark);
            return true;
        };
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
      };

    return { getBoard, markCell, printBoard, resetBoard };
}

function Cell() {
    let value = '';

    const addMarker = (playerMark) => {
        value = playerMark;
    }

    const getValue = () => value;

    return {
        addMarker,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const updatePlayerName = (player,name) => {
            name ? players[player].name = name.charAt(0).toUpperCase() + name.slice(1) : player == 0 ? players[player].name = `Player One` : players[player].name = 'Player Two';
            message = `${getActivePlayer().name}'s turn.`;
    }

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        message = `${activePlayer.name}'s turn`;
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        message = `${getActivePlayer().name}'s turn.`;
        console.log(message);
    };

    const playRound = (row, column) => {
        if(board.markCell(row, column, getActivePlayer().token)) {
            console.log(`Marking ${getActivePlayer().name}'s marker into row ${row} column ${column}...`);
            if(checkWinner()){
                message = `${getActivePlayer().name} is the winner!`;
                console.log(message);
            }else if(checkDraw()){
                message = `Cat's Game. Try again?`;
                console.log(message);
            }else{
                switchPlayerTurn();
                printNewRound();
            }
        }

    };

    const checkWinner = () => {
        const currentBoard = board.getBoard();
        //Check Rows
        for(let i=0;i<3;i++){
            let a = currentBoard[i][0].getValue();
            let b = currentBoard[i][1].getValue();
            let c = currentBoard[i][2].getValue();

            if(a != '' && a==b && b==c){
                return true;
            }
        }
        //Check Columns
        for(let i=0;i<3;i++){
            a = currentBoard[0][i].getValue();
            b = currentBoard[1][i].getValue();
            c = currentBoard[2][i].getValue();

            if(a != '' && a==b && b==c){
                return true;
            }
        }
        //Diag L to R
        a = currentBoard[0][0].getValue();
        b = currentBoard[1][1].getValue();
        c = currentBoard[2][2].getValue();

        if(a != '' && a==b && b==c){
            return true;
        }
        //Diag R to L
        a = currentBoard[0][2].getValue();
        b = currentBoard[1][1].getValue();
        c = currentBoard[2][0].getValue();

        if(a != '' && a==b && b==c){
            return true;
        }
    }

    const checkDraw = () => {
        const currentBoard = board.getBoard();
        let count = 0;

        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(currentBoard[i][j].getValue()){count++}
            }
        }
        return count > 8;
    }

    const resetGame = () => {
        board.resetBoard();
        activePlayer = players[0];
        printNewRound();
    }

    const getMessage = () => message;

    resetGame();

    return {
        playRound,
        getActivePlayer,
        resetGame,
        getBoard: board.getBoard,
        getMessage,
        updatePlayerName
    };
    
}

function ScreenController() {
    const game = GameController();
    const boardTable = document.getElementById('board-table').children[0];
    const output = document.getElementById('output');
    const newGameButton = document.querySelector('.new-game');
    const playerOneInput = document.getElementById("player-one");
    const playerTwoInput = document.getElementById("player-two");

    playerOneInput.addEventListener("keyup", (e) => {
        game.updatePlayerName(0,e.target.value);
        if(output.textContent.charAt(output.textContent.length-1)=='.'){
        updateMessage();
        }
    });

    playerTwoInput.addEventListener("keyup", (e) => {
        game.updatePlayerName(1,e.target.value);
        if(output.textContent.charAt(output.textContent.length-1)=='.'){
            updateMessage();
            }
    });

    boardTable.addEventListener("click", function(e){
        console.log(e.target.id);
        game.playRound(e.target.id.charAt(0),e.target.id.charAt(1));
        updateScreen();
        updateMessage();
    })

    const updateScreen = () => {
        const currentBoard = game.getBoard();
        for(row of boardTable.children){
            for(cell of row.children){
                cell.innerText = currentBoard[cell.id.charAt(0)][cell.id.charAt(1)].getValue();
            }
        }
    }

    const updateMessage = () => {
        output.innerText = game.getMessage();
        newGameButton.hidden = output.innerText.charAt(output.innerText.length-1)=='.' ? true : false
    }

    const newGame = () => {
        game.resetGame();
        updateScreen();
        updateMessage();
    }

    updateMessage();

    return {
        updateScreen,
        boardTable,
        getBoard: game.getBoard,
        newGame,
        getMessage: game.getMessage
    }
}

const screen = ScreenController();




