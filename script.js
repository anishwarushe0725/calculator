// Calculator state variables
let currentInput = '';
let previousInput = '';
let operator = null;
let waitingForNext = false;
let calculationHistory = '';

// Get display elements
const display = document.getElementById('display');
const history = document.getElementById('history');

// Update display function
function updateDisplay(value) {
    // Limit display length to prevent overflow
    if (value.length > 12) {
        if (value.includes('e')) {
            display.textContent = parseFloat(value).toExponential(2);
        } else {
            display.textContent = parseFloat(value).toFixed(8).replace(/\.?0+$/, '');
        }
    } else {
        display.textContent = value;
    }
}

// Update history display
function updateHistory(text) {
    calculationHistory = text;
    history.textContent = text;
}

// Get operator symbol for display
function getOperatorSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

// Input number function
function inputNumber(num) {
    if (waitingForNext) {
        currentInput = num;
        waitingForNext = false;
    } else {
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }
    updateDisplay(currentInput);
    
    // Update history to show current operation with new number
    if (operator && previousInput && !waitingForNext) {
        updateHistory(previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput);
    }
}

// Input decimal point
function inputDecimal() {
    if (waitingForNext) {
        currentInput = '0.';
        waitingForNext = false;
    } else if (currentInput === '') {
        currentInput = '0.';
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay(currentInput);
    
    // Update history to show current operation with decimal
    if (operator && previousInput && !waitingForNext) {
        updateHistory(previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput);
    }
}

// Set operation
function setOperation(op) {
    if (currentInput === '') {
        if (previousInput !== '') {
            operator = op;
            // Update history to show operator change
            updateHistory(previousInput + ' ' + getOperatorSymbol(op));
        }
        return;
    }

    if (previousInput !== '' && operator && !waitingForNext) {
        calculate();
        // After calculation, set new operator
        operator = op;
        previousInput = currentInput;
        updateHistory(currentInput + ' ' + getOperatorSymbol(op));
        waitingForNext = true;
    } else {
        operator = op;
        previousInput = currentInput;
        updateHistory(previousInput + ' ' + getOperatorSymbol(op));
        waitingForNext = true;
    }
}

// Calculate result
function calculate() {
    if (previousInput === '' || currentInput === '' || !operator) {
        return;
    }

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    // Show complete calculation in history
    const fullCalculation = previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput + ' =';
    
    try {
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    throw new Error('Cannot divide by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Format result
        if (result === Math.floor(result)) {
            currentInput = result.toString();
        } else {
            currentInput = result.toString();
        }

        // Update displays
        updateHistory(fullCalculation);
        updateDisplay(currentInput);
        
        // Reset for next calculation
        previousInput = currentInput;
        operator = null;
        waitingForNext = true;

    } catch (error) {
        updateDisplay('Error');
        updateHistory('Error');
        clearAll();
    }
}

// Clear all
function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = null;
    waitingForNext = false;
    calculationHistory = '';
    updateDisplay('0');
    updateHistory('');
}

// Clear entry
function clearEntry() {
    currentInput = '';
    updateDisplay('0');
    
    // Update history to show current operation state
    if (operator && previousInput) {
        updateHistory(previousInput + ' ' + getOperatorSymbol(operator));
    }
}

// Backspace
function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
    } else {
        currentInput = '';
        updateDisplay('0');
    }
}

// Toggle sign
function toggleSign() {
    if (currentInput && currentInput !== '0') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay(currentInput);
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default for calculator keys
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
        event.preventDefault();
    }

    // Handle number keys
    if ('0123456789'.includes(key)) {
        inputNumber(key);
    }
    
    // Handle operators
    else if (key === '+') {
        setOperation('+');
    } else if (key === '-') {
        setOperation('-');
    } else if (key === '*') {
        setOperation('*');
    } else if (key === '/') {
        setOperation('/');
    }
    
    // Handle special keys
    else if (key === '.') {
        inputDecimal();
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearAll();
    }
});

// Initialize display when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay('0');
    updateHistory('');
});