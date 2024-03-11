// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect bet amount
// 4. Spin the slot machine
// 5. Check if the user has won
// 6. Give winnings to user
// 7. Play again?

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
};



const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const depositAmountToNumber = parseFloat(depositAmount);

        if (isNaN(depositAmountToNumber) || depositAmountToNumber <= 0){
            console.log("Invalid deposit amount. Try again!");
        } else {
            return depositAmountToNumber;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter a number of lines you want to bet on (1-3): ");
        const linesToNumber = parseFloat(lines);

        if (isNaN(linesToNumber) || linesToNumber <= 0 || linesToNumber > 3){
            console.log("Invalid deposit amount. Try again!");
        } else {
            return linesToNumber;
        }
    }
};

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the total bet per line: ");
        const betToNumber = parseFloat(bet);

        if (isNaN(betToNumber) || betToNumber <= 0 || betToNumber * lines > balance) {
            console.log("Invalid bet. Try again!");
        } else {
            return betToNumber;
        }
    }
};


const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS)){
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const getWinnings = (rows, lines, bet) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
};

const game = () => {
    let balance = deposit();

    while (true){
        console.log("Your current balance: $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const spinTheWheel = spin();
        const rows = transpose(spinTheWheel);
        console.log(spinTheWheel);
        console.log(rows);
        printRows(rows);
        const winnings = getWinnings(rows, numberOfLines, bet);
        balance += winnings;
        console.log("You won $" + winnings.toString());

        if (balance <= 0){
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)? ");
        if (playAgain != "y") break;
    }
    
};



