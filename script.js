// script.js
let display = document.getElementById('display');
let currentInput = '';
let lastOperation = '';
let shouldResetDisplay = false;

// Initialize display
updateDisplay();

function updateDisplay() {
    display.textContent = currentInput || '0';
    
    // Add animation for visual feedback
    display.classList.add('animation');
    setTimeout(() => display.classList.remove('animation'), 200);
}

function handleSpecialFunctions(value) {
    try {
        switch(value) {
            case 'sin':
                return Math.sin(parseInput()).toString();
            case 'cos':
                return Math.cos(parseInput()).toString();
            case 'tan':
                return Math.tan(parseInput()).toString();
            case 'log':
                return Math.log10(parseInput()).toString();
            case 'ln':
                return Math.log(parseInput()).toString();
            case 'sqrt':
                return Math.sqrt(parseInput()).toString();
            case 'pow':
                return `(${parseInput()})**2`;
            case 'exp':
                return Math.exp(parseInput()).toString();
            case 'π':
                return currentInput + Math.PI;
            case 'e':
                return currentInput + Math.E;
            case 'fact':
                const num = parseInt(parseInput());
                if (num < 0) throw new Error('Negative numbers have no factorial');
                return factorial(num).toString();
            case 'mod':
                return currentInput + '%';
            default:
                return currentInput;
        }
    } catch (error) {
        return 'Error';
    }
}

function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function parseInput() {
    try {
        // Handle empty input
        if (!currentInput) return 0;
        
        // Replace symbols with JavaScript operators
        const expression = currentInput
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/−/g, '-');
            
        const result = eval(expression);
        return isNaN(result) ? 0 : result;
    } catch (error) {
        return 0;
    }
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        
        // Clear All
        if (value === 'AC') {
            currentInput = '';
            updateDisplay();
            return;
        }
        
        // Clear Entry
        if (value === 'C') {
            currentInput = currentInput.slice(0, -1) || '';
            updateDisplay();
            return;
        }
        
        // Equals
        if (value === '=') {
            try {
                // Replace symbols with JavaScript operators
                const expression = currentInput
                    .replace(/÷/g, '/')
                    .replace(/×/g, '*')
                    .replace(/−/g, '-');
                    
                // Evaluate expression
                const result = eval(expression);
                
                if (result === undefined || isNaN(result)) {
                    throw new Error('Invalid calculation');
                }
                
                currentInput = result.toString();
                updateDisplay();
            } catch (error) {
                display.textContent = 'Error';
                currentInput = '';
                setTimeout(() => updateDisplay(), 1000);
            }
            return;
        }
        
        // Handle scientific functions
        if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pow', 'exp', 'π', 'e', 'fact', 'mod'].includes(value)) {
            currentInput = handleSpecialFunctions(value);
            updateDisplay();
            return;
        }
        
        // Handle operators
        if (['+', '-', '*', '/', '%'].includes(value)) {
            // Replace previous operator if needed
            if (currentInput && ['+', '-', '*', '/', '%'].includes(currentInput.slice(-1))) {
                currentInput = currentInput.slice(0, -1);
            }
            currentInput += value;
            updateDisplay();
            return;
        }
        
        // Handle decimal point
        if (value === '.' && currentInput.slice(-1) === '.') return;
        
        // Handle parentheses
        if (value === '(' || value === ')') {
            currentInput += value;
            updateDisplay();
            return;
        }
        
        // Handle numbers
        if (currentInput === '0' || shouldResetDisplay) {
            currentInput = value;
            shouldResetDisplay = false;
        } else {
            currentInput += value;
        }
        
        updateDisplay();
    });
});