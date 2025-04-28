import { Player } from './player';

export class ScreenController {
    constructor() {
        this.humanPlayer = new Player(false);
        this.computerPlayer = new Player(true);

        this.computerPlayer.randomPlaceAllShips();

        this.isHorizontal = true;
        this.isGameStarted = false;
        this.shipNames = ['Battleship', 'Cruiser', 'Submarine', 'Destroyer'];

        this.createGameContainer();

        this.humanBoardElement = document.querySelector('.player-board');
        this.computerBoardElement = document.querySelector('.computer-board');

        this.mainMessageElement = document.querySelector('.main-message');
        this.altMessageElement = document.querySelector('.alt-message');

        this.updateHumanBoardElement();
        this.updateComputerBoardElement();

        this.setupShipPlacementEventListener();

        this.setupSettingEventListeners();
    }

    createGameContainer() {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';

        const mainMessage = document.createElement('h1');
        mainMessage.className = 'main-message';
        mainMessage.textContent = 'Place your ships to start';

        const altMessage = document.createElement('h3');
        altMessage.className = 'alt-message';
        altMessage.textContent = 'Place your Carrier';

        messageContainer.appendChild(mainMessage);
        messageContainer.appendChild(altMessage);

        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container';

        const resetButton = document.createElement('button');
        resetButton.id = 'reset-button';
        resetButton.textContent = 'Reset';

        const alignmentButton = document.createElement('button');
        alignmentButton.id = 'alignment-button';
        alignmentButton.textContent = 'Horizontal Placement';

        const startButton = document.createElement('button');
        startButton.id = 'start-button';
        startButton.textContent = 'Start';

        settingsContainer.appendChild(resetButton);
        settingsContainer.appendChild(alignmentButton);
        settingsContainer.appendChild(startButton);

        const gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';

        const boardsContainer = document.createElement('div');
        boardsContainer.className = 'boards-container';

        const playerSection = document.createElement('div');
        playerSection.className = 'board-section';

        const playerTitle = document.createElement('h2');
        playerTitle.textContent = 'Your Board';

        const playerBoard = document.createElement('div');
        playerBoard.className = 'player-board game-board';

        playerSection.appendChild(playerTitle);
        playerSection.appendChild(playerBoard);

        const computerSection = document.createElement('div');
        computerSection.className = 'board-section';

        const computerTitle = document.createElement('h2');
        computerTitle.textContent = "Computer's Board";

        const computerBoard = document.createElement('div');
        computerBoard.className = 'computer-board game-board';

        computerSection.appendChild(computerTitle);
        computerSection.appendChild(computerBoard);

        boardsContainer.appendChild(playerSection);
        boardsContainer.appendChild(computerSection);

        gameContainer.appendChild(messageContainer);
        gameContainer.appendChild(settingsContainer);
        gameContainer.appendChild(boardsContainer);

        document.body.appendChild(gameContainer);
    }

    updateHumanBoardElement() {
        const boardElement = this.humanBoardElement;
        const gameboard = this.humanPlayer.gameboard;
        boardElement.textContent = '';

        for (let row = 0; row < 10; row++) {
            for (let column = 0; column < 10; column++) {
                const cell = document.createElement('div');
                const gameboardCell = gameboard.board[row][column];
                cell.className = `cell`;
                cell.dataset.row = row;
                cell.dataset.column = column;
                if (gameboardCell !== null && gameboardCell.ship) {
                    cell.classList.add('ship');
                }
                if (gameboard.attacks.some((attack) => attack.row === row && attack.column === column)) {
                    cell.classList.add('hit');
                    cell.textContent = '×';
                }
                boardElement.appendChild(cell);
            }
        }
    }

    updateComputerBoardElement() {
        const boardElement = this.computerBoardElement;
        const gameboard = this.computerPlayer.gameboard;
        boardElement.textContent = '';

        for (let row = 0; row < 10; row++) {
            for (let column = 0; column < 10; column++) {
                const cell = document.createElement('div');
                const gameboardCell = gameboard.board[row][column];
                cell.className = `cell`;
                cell.dataset.row = row;
                cell.dataset.column = column;
                if (gameboard.attacks.some((attack) => attack.row === row && attack.column === column)) {
                    cell.classList.add('hit');
                    cell.textContent = '×';
                    if (gameboardCell !== null && gameboardCell.ship) {
                        cell.classList.add('ship');
                    }
                }
                boardElement.appendChild(cell);
            }
        }
    }

    setupShipPlacementEventListener() {
        const boardElement = this.humanBoardElement;

        boardElement.addEventListener('click', (e) => {
            const selectedRow = parseInt(e.target.dataset.row);
            const selectedColumn = parseInt(e.target.dataset.column);
            if (isNaN(selectedRow) || isNaN(selectedColumn)) return;
            const isSuccessful = this.humanPlayer.manualPlaceShip(selectedRow, selectedColumn, this.isHorizontal);
            if (isSuccessful) {
                if (this.humanPlayer.ships.length === 0) {
                    this.altMessageElement.textContent =
                        'Press the start button or the reset button to place your ships again.';
                } else {
                    this.altMessageElement.textContent = `Place your ${this.shipNames.shift()}`;
                }
            }
            this.updateHumanBoardElement();
        });

        boardElement.addEventListener('mouseover', (e) => {
            const selectedRow = parseInt(e.target.dataset.row);
            const selectedColumn = parseInt(e.target.dataset.column);
            if (isNaN(selectedRow) || isNaN(selectedColumn)) return;
            if (this.humanPlayer.ships[0]) {
                this.highlightCells(selectedRow, selectedColumn, this.humanPlayer.ships[0].length, this.isHorizontal);
            }
        });

        boardElement.addEventListener('mouseout', () => {
            this.clearHighlights();
        });
    }

    highlightCells(row, column) {
        const playerGameboard = this.humanPlayer.gameboard;
        const currentShip = this.humanPlayer.ships[0];
        if (playerGameboard.isValidPlacement(currentShip, row, column, this.isHorizontal)) {
            for (let i = 0; i < currentShip.length; i++) {
                let targetCell;
                if (this.isHorizontal) {
                    targetCell = document.querySelector(`.cell[data-row="${row}"][data-column="${column + i}"]`);
                } else {
                    targetCell = document.querySelector(`.cell[data-row="${row + i}"][data-column="${column}"]`);
                }
                if (targetCell) {
                    targetCell.classList.add('highlight');
                }
            }
        }
    }

    clearHighlights() {
        document.querySelectorAll('.cell.highlight').forEach((cell) => {
            cell.classList.remove('highlight');
        });
    }

    setupSettingEventListeners() {
        const resetButton = document.querySelector('#reset-button');
        const alignmentButton = document.querySelector('#alignment-button');
        const startButton = document.querySelector('#start-button');

        resetButton.addEventListener('click', () => {
            this.humanPlayer = new Player(false);
            this.computerPlayer = new Player(true);
            this.computerPlayer.randomPlaceAllShips();

            // Replace the computer board to remove event listeners
            const newComputerBoardElement = this.computerBoardElement.cloneNode(true);
            this.computerBoardElement.parentNode.replaceChild(newComputerBoardElement, this.computerBoardElement);
            this.computerBoardElement = newComputerBoardElement;

            this.updateHumanBoardElement();
            this.updateComputerBoardElement();
            this.shipNames = ['Battleship', 'Cruiser', 'Submarine', 'Destroyer'];
            this.mainMessageElement.textContent = 'Place your ships to start';
            this.altMessageElement.textContent = 'Place your Carrier';
            this.isGameStarted = false;
        });

        alignmentButton.addEventListener('click', () => {
            this.isHorizontal = !this.isHorizontal;
            if (this.isHorizontal) {
                alignmentButton.textContent = 'Horizontal Placement';
            } else {
                alignmentButton.textContent = 'Vertical Placement';
            }
        });

        startButton.addEventListener('click', () => {
            if (!this.isGameStarted && this.humanPlayer.ships.length === 0) {
                this.isGameStarted = true;
                this.mainMessageElement.textContent = "Sink all the ships on the computer's board!";
                this.altMessageElement.textContent = 'Choose a location to attack';
                this.setupAttackEventListeners();
            } else {
                console.log('Cannot start, not all ships are placed or the game is already started');
            }
        });
    }

    setupAttackEventListeners() {
        const boardElement = this.computerBoardElement;

        boardElement.addEventListener('click', (e) => {
            if (!this.isGameStarted) return;
            if (e.target.matches('.hit')) return;

            const selectedRow = parseInt(e.target.dataset.row);
            const selectedColumn = parseInt(e.target.dataset.column);
            let message = '';

            if (isNaN(selectedRow) || isNaN(selectedColumn)) return;

            if (this.humanPlayer.manualAttack(this.computerPlayer.gameboard, selectedRow, selectedColumn)) {
                const attackedShip = this.computerPlayer.gameboard.board[selectedRow][selectedColumn]['ship'];
                if (attackedShip.isSunk()) {
                    message += "You sunk one of the computer's ships.";
                } else {
                    message += "You hit one of the computer's ships.";
                }
            } else {
                message += 'You missed.';
            }

            this.updateComputerBoardElement();

            if (this.computerPlayer.gameboard.allShipsSunk()) {
                this.mainMessageElement.textContent = 'Congratualions! You won.';
                this.altMessageElement.textContent = 'Click reset button to play again.';
                this.isGameStarted = false;
                return;
            }

            if (this.computerPlayer.randomAttack(this.humanPlayer.gameboard)) {
                const { row, column } =
                    this.humanPlayer.gameboard.attacks[this.humanPlayer.gameboard.attacks.length - 1];
                const attackedShip = this.humanPlayer.gameboard.board[row][column]['ship'];
                if (attackedShip.isSunk()) {
                    message += ' The computer sunk one of your ships.';
                } else {
                    message += ' The computer hit one of your ships.';
                }
            } else {
                message += ' The computer missed.';
            }

            this.altMessageElement.textContent = message;

            if (this.humanPlayer.gameboard.allShipsSunk()) {
                this.mainMessageElement.textContent = 'You lost.';
                this.altMessageElement.textContent = 'Click reset button to play again.';
                this.isGameStarted = false;
            }
            this.updateHumanBoardElement();
        });

        boardElement.addEventListener('mouseover', (e) => {
            if (!this.isGameStarted) return;

            if (e.target.matches('.hit')) return;

            const selectedRow = parseInt(e.target.dataset.row);
            const selectedColumn = parseInt(e.target.dataset.column);
            if (isNaN(selectedRow) || isNaN(selectedColumn)) return;

            e.target.classList.add('focused');
            e.target.textContent = '•';
        });

        boardElement.addEventListener('mouseout', () => {
            document.querySelectorAll('.cell.focused').forEach((cell) => {
                cell.classList.remove('focused');
                cell.textContent = '';
            });
        });
    }
}
