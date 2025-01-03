"use strict";


const display = document.querySelector(".display");
const keypad = document.querySelector(".keypad");

const actions = {
    "equal": () => equal(),
    "add": () => inputOperation(add),
    "subtract": () => inputOperation(subtract),
    "multiply": () => inputOperation(multiply),
    "divide": () => inputOperation(divide),
    "clear-all": () => clearAll(),
    "clear-entry": () => numericInput("clear-entry"),
    "add-decimal": () => numericInput("add-decimal"),
    "negate": () => numericInput("negate"),
    "0": () => numericInput(0),
    "1": () => numericInput(1),
    "2": () => numericInput(2),
    "3": () => numericInput(3),
    "4": () => numericInput(4),
    "5": () => numericInput(5),
    "6": () => numericInput(6),
    "7": () => numericInput(7),
    "8": () => numericInput(8),
    "9": () => numericInput(9),
}

const keyboardControls = {
    "Enter": "equal",
    "Escape": "clear-all",
    "r": "clear-all",
    "Backspace": "clear-entry",
    "Delete": "clear-entry",
    "c": "clear-entry",
    ".": "add-decimal",
    ",": "add-decimal",
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    "n": "negate",
}

const states = {
    INPUT_OPERAND: 0,
    INPUT_OPERATION: 1,
    RESULT: 2,
    ERROR: 3,
}


let operandA;
let operandB;
let currentOperation;
let previousOperation;
let currentState;


function clearAll() {
    operandA = null;
    operandB = null;
    currentOperation = null;
    previousOperation = null;
    currentState = states.INPUT_OPERAND;
    clearEntry();
}


function numericInput(input) {
    switch (currentState) {
        case states.ERROR:
        case states.RESULT:
            clearAll();
            break;
        case states.INPUT_OPERATION:
            clearEntry();
            break;
    }

    currentState = states.INPUT_OPERAND;

    switch (input) {
        case "clear-entry":
            clearEntry();
            return;
        case "negate":
            inputPlusMinusSign();
            return;
        case "add-decimal":
            inputDecimal();
            return;
        default:
            inputNumber(input);
            return;
    }
}


function inputOperation(operation) {
    switch (currentState) {
        case states.INPUT_OPERATION:
            display.textContent = display.textContent.replace(currentOperation.symbol, '');
            break;
        case states.INPUT_OPERAND:
        case states.RESULT:
            if (currentOperation) {
                operandB = readNumberFromDisplay();
                const success = operate(currentOperation);
                if (!success) return throwError();
            } else {
                operandA = readNumberFromDisplay();
            }
            currentState = states.INPUT_OPERATION;
            break;
        case states.ERROR:
            return;
    }

    currentOperation = operation;
    display.textContent += operation.symbol;
}


function equal() {
    switch (currentState) {
        case states.INPUT_OPERATION:
            writeNumberToDisplay(operandA);
            break;
        case states.INPUT_OPERAND:
            operandB = readNumberFromDisplay();
        case states.RESULT:
            const operation = currentOperation || previousOperation;
            if (operandB === null)
                operandB = readNumberFromDisplay();

            if (!operation) break;

            const success = operate(operation);
            if (!success) return throwError();

            break;
        case states.ERROR:
            return;
    }

    currentOperation = null;
    currentState = states.RESULT;
}


function operate(operation) {
    const result = operation(operandA, operandB);
    operandA = result;
    writeNumberToDisplay(result);
    previousOperation = operation;

    return Number.isFinite(result);
}


function throwError() {
    clearAll();
    display.textContent = "ERROR";
    currentState = states.ERROR;
}


const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

add.symbol = "+";
subtract.symbol = "−";
multiply.symbol = "×";
divide.symbol = "÷";


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


function readNumberFromDisplay() {
    return parseFloat(display.textContent);
}


function writeNumberToDisplay(number) {
    display.textContent = number;
}


function inputPlusMinusSign() {
    if (display.textContent.startsWith("-"))
        display.textContent = display.textContent.slice(1);
    else
        display.textContent = "-" + display.textContent;
}


function performAction(actionName) {
    const action = actions[actionName];
    if (action) action();
}


function onButtonClick(event) {
    event.stopPropagation();

    const action = event.target.dataset.action;
    performAction(action);
}


function onKeyPressDown(event) {
    event.stopPropagation();

    const key = event.key;

    const action = keyboardControls[key] || key;
    performAction(action);

    const button = document.querySelector(`button[data-action="${action}"]`);
    if (button) button.classList.add("active");

    if (key === '/') event.preventDefault();
}


function onKeyPressUp(event) {
    event.stopPropagation();

    const key = event.key;
    const action = keyboardControls[key] || key;
    const button = document.querySelector(`button[data-action="${action}"]`);
    if (button) button.classList.remove("active");
}


clearAll();

keypad.addEventListener("click", onButtonClick);
window.addEventListener("keydown", onKeyPressDown);
window.addEventListener("keyup", onKeyPressUp);
