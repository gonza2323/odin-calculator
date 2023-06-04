'use strict';

const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('[data-op]');
const clearButton = document.querySelector('#ce');
const restartButton = document.querySelector('#ac');
const display = document.querySelector('.display');

let numberA;
let numberB;
let currentOp;
let displayShouldClear;

const operations = {
    add(a, b) {
        return a + b;
    },
    
    sub(a, b) {
        return a - b;
    },
    
    mult(a, b) {
        return a * b;
    },
    
    div(a, b) {
        return a / b;
    },
    
    mod(a, b) {
        return a % b;
    },

    equal(a, b) {
        return b;
    },
}

operations.add.symbol = '+';
operations.sub.symbol = '-';
operations.mult.symbol = '×';
operations.div.symbol = '÷';
operations.mod.symbol = '%';
operations.equal.symbol = '';

function writeToDisplay(value) {
    if (displayShouldClear) {
        display.textContent = '';
        displayShouldClear = false;
    }

    display.textContent += value;
    numberB = Number.parseFloat(display.textContent);
}

function clearEntry() {
    display.textContent = '0';
    displayShouldClear = true;
}

function clearAll() {
    numberA = 0;
    numberB = 0;
    currentOp = operations.add;
    displayShouldClear = true;
    display.textContent = '0';
}

function operate(newOperation) {
    const result = currentOp(numberA, numberB);
    currentOp = newOperation;
    numberA = result;
    numberB = result;
    display.textContent = result.toString() + currentOp.symbol;
    displayShouldClear = true;
}

numberButtons.forEach(noButton => {
    noButton.addEventListener('click', e => {
        writeToDisplay(e.target.textContent);
    })
});

operationButtons.forEach(opButton => {
    opButton.addEventListener('click', e => operate(operations[e.target.getAttribute('data-op')]));
});

clearButton.addEventListener('click', clearEntry);
restartButton.addEventListener('click', clearAll);

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'Escape': return clearAll();
        case 'c':
        case 'Backspace': return clearEntry();
        case '+': return operate(operations.add);
        case '-': return operate(operations.sub);
        case '*': return operate(operations.mult);
        case '/': return operate(operations.div);
        case '%': return operate(operations.mod);
        case '=':
        case 'Enter': return operate(operations.equal);
    }

    if (!isNaN(e.key) || e.key === '.') {
        writeToDisplay(e.key);
    }
});

clearAll();