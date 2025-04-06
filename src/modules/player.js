import { Gameboard } from './gameboard';

export class Player {
    constructor(isComputer = false) {
        this.isComputer = isComputer;
        this.gameboard = new Gameboard();
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
