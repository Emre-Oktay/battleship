import { Gameboard } from './gameboard';
import { Ship } from './ship';

export class Player {
    constructor(isComputer = false) {
        this.isComputer = isComputer;
        this.gameboard = new Gameboard();
        this.ships = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];
    }

    manualPlaceShip(row, column, isHorizontal) {
        if (this.ships.length > 0) {
            const ship = this.ships.shift();
            const isSuccessful = this.gameboard.placeShip(ship, row, column, isHorizontal);
            if (isSuccessful) {
                return true;
            } else {
                this.ships.unshift(ship);
                return false;
            }
        }
        return false;
    }

    randomPlaceAllShips() {
        const originalShips = [...this.ships];
        this.ships = [];

        for (const ship of originalShips) {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;

            while (!placed && attempts < maxAttempts) {
                attempts++;
                const isHorizontal = Math.random() < 0.5;
                let row, column;

                if (isHorizontal) {
                    row = Math.floor(Math.random() * 10);
                    column = Math.floor(Math.random() * (10 - ship.length + 1));
                } else {
                    row = Math.floor(Math.random() * (10 - ship.length + 1));
                    column = Math.floor(Math.random() * 10);
                }

                placed = this.gameboard.placeShip(ship, row, column, isHorizontal);
            }

            if (!placed) {
                console.log(`Could not place ship of length ${ship.length} after ${maxAttempts} attempts`);
                this.ships.push(ship);
            }
        }
    }

    manualAttack(enemyGameboard, row, column) {
        if (this.isComputer) {
            throw new Error('Computer players cannot make manual attacks');
        }

        if (column < 0 || column >= 10 || row < 0 || row >= 10) {
            throw new Error('Invalid attack coordinates');
        }

        return enemyGameboard.receiveAttack(row, column);
    }

    randomAttack(enemyGameboard) {
        if (!this.isComputer) {
            throw new Error('Only computer players can make random attacks');
        }

        const attacks = [];

        for (let row = 0; row < 10; row++) {
            for (let column = 0; column < 10; column++) {
                const alreadyAttacked = enemyGameboard.attacks.some(
                    (attack) => attack.row === row && attack.column === column
                );

                if (!alreadyAttacked) {
                    attacks.push({ row, column });
                }
            }
        }

        if (attacks.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * attacks.length);
        const { row, column } = attacks[randomIndex];

        return enemyGameboard.receiveAttack(row, column);
    }
}
