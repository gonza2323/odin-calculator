"use strict";


const display = document.querySelector(".display"); 
const keypad = document.querySelector(".keypad");

add.symbol = "+";
minus.symbol = "−";
multiply.symbol = "×";
divide.symbol = "÷";
equal.symbol = "";


let numberInMemory;
let currentOperation;
let awaitingArgument;


clearAll();


function getOperationFromSymbol(symbol) {
    switch (symbol) {
        case "+": return add;
        case "−": return minus;
        case "×": return multiply;
        case "÷": return divide;
        case "=": return equal;
    }
}

function readNumberFromDisplay() {
    return parseFloat(display.textContent);
}

function writeNumberToDisplay(number) {
    display.textContent = number;
}

function operate(operation) {
    if (awaitingArgument) {
        display.textContent = display.textContent.replace(currentOperation.symbol, '') + operation.symbol;
        currentOperation = operation;
        return;
    }

    const numberInDisplay = readNumberFromDisplay();
    const result = currentOperation(numberInMemory, numberInDisplay);
    numberInMemory = result;
    writeNumberToDisplay(result);
    
    currentOperation = operation;
    display.textContent += operation.symbol;
    awaitingArgument = true;
}

function add(a, b) {
    return a + b;
}

function minus(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function equal(a, b) {
    return b;
}

function inputNumber(number) {
    if (display.textContent === "0" ||
        display.textContent === "-0"
    ) {
        display.textContent = display.textContent.replace('0', number);
    }
    else
        display.textContent += number;
}

function inputDecimal() {
    if (!display.textContent.includes("."))
        display.textContent += ".";
}

function clearEntry() {
    display.textContent = "0";
}

function clearAll() {
    currentOperation = equal;
    numberInMemory = 0;
    awaitingArgument = false;
    clearEntry();
    // todo
}

function inputPlusMinusSign() {
    if (display.textContent.startsWith("-"))
        display.textContent = display.textContent.slice(1);
    else
        display.textContent = "-" + display.textContent;
}

function isNumericInput(input) {
    const numericButtons = ["CE", "±", "."];
    const number = parseInt(input);

    return numericButtons.includes(input) || !isNaN(number);
}

function onButtonPress(event) {
    const key = event.target.textContent;
    
    if (!key) return;

    if (key === "AC") {
        clearAll();
        return;
    }
    
    const operation = getOperationFromSymbol(key);
    if (operation) {
        operate(operation);
        return;
    }

    if (isNumericInput(key)) {
        if (awaitingArgument) {
            clearEntry();
            awaitingArgument = false;
        }

        switch (key) {
            case "CE":
                clearEntry();
                return;
            case "±":
                inputPlusMinusSign();
                return;
            case ".":
                inputDecimal();
                return;
            default:
                inputNumber(parseInt(key));
                return;
        }
    }
}


keypad.addEventListener("click", onButtonPress);
