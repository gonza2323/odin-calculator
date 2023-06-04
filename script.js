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
        return a;
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

function clearDisplay() {
    display.textContent = '0';
    displayShouldClear = true;
}

function restart() {
    numberA = 0;
    numberB = 0;
    currentOp = operations.add;
    displayShouldClear = true;
    display.textContent = '0';
}

numberButtons.forEach(noButton => {
    noButton.addEventListener('click', e => {
        writeToDisplay(e.target.textContent);
    })
})

operationButtons.forEach(opButton => {
    opButton.addEventListener('click', e => {
        const result = currentOp(numberA, numberB);
        currentOp = operations[e.target.getAttribute('data-op')];
        numberA = result;
        numberB = null;
        display.textContent = result.toString() + currentOp.symbol;
        displayShouldClear = true;
    })
})

clearButton.addEventListener('click', clearDisplay);
restartButton.addEventListener('click', restart);

window.addEventListener('keydown', e => {
    const button = document.querySelector(`[data-key="${e.key}"]`);
    if (button) button.click();
})

restart();