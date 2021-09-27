import { alphabet, isValidInput } from './utils.js';
import { runMachine } from './enigma.js';

const increaseFastRotorBtn = document.getElementById('increaseFastRotorBtn');
const decreaseFastRotorBtn = document.getElementById('decreaseFastRotorBtn');
const fastRotorDisplay = document.getElementById('fastRotorDisplay');

const increaseMediumRotorBtn = document.getElementById('increaseMediumRotorBtn');
const decreaseMediumRotorBtn = document.getElementById('decreaseMediumRotorBtn');
const mediumRotorDisplay = document.getElementById('mediumRotorDisplay');

const increaseSlowRotorBtn = document.getElementById('increaseSlowRotorBtn');
const decreaseSlowRotorBtn = document.getElementById('decreaseSlowRotorBtn');
const slowRotorDisplay = document.getElementById('slowRotorDisplay');

const inputLetter = document.getElementById('letterInput');
const runBtn = document.getElementById('runBtn');
const outputDisplay = document.getElementById('output');

runBtn.addEventListener('click', () => {
    const input = inputLetter.value.toUpperCase().split(' ').join('').split('');
    
    if (!isValidInput(alphabet, input)) {
        outputDisplay.innerHTML = 'Error';
        return false;
    }

    const outputLetter = runMachine(
        input,
        [
            Number(fastRotorDisplay.innerHTML),
            Number(mediumRotorDisplay.innerHTML),
            Number(slowRotorDisplay.innerHTML),
        ],
        chains
    )
    
    outputDisplay.innerHTML = String(outputLetter);
})

const increaseRotor = (display) => {
    if (Number(display.innerHTML) === alphabet.length - 1) {
        display.innerHTML = 0;
        return
    }
    display.innerHTML = Number(display.innerHTML) + 1;
    return;
}

const decreaseRotor = (display) => {
    if (Number(display.innerHTML) === 0) {
        display.innerHTML = alphabet.length - 1;
        return
    }
    display.innerHTML = Number(display.innerHTML) - 1;
    return;
}

increaseFastRotorBtn.addEventListener('click', () => {
    increaseRotor(fastRotorDisplay);
});

decreaseFastRotorBtn.addEventListener('click', () => {
    decreaseRotor(fastRotorDisplay);
});

increaseMediumRotorBtn.addEventListener('click', () => {
    increaseRotor(mediumRotorDisplay);
});

decreaseMediumRotorBtn.addEventListener('click', () => {
    decreaseRotor(mediumRotorDisplay);
});

increaseSlowRotorBtn.addEventListener('click', () => {
    increaseRotor(slowRotorDisplay);
});

decreaseSlowRotorBtn.addEventListener('click', () => {
    decreaseRotor(slowRotorDisplay);
});

const chains = [];
const addChainBtn = document.getElementById('addChainBtn');
const chainWrapper = document.getElementById('chainWrapper');
const leftChain = document.getElementById('leftChain');
const rightChain = document.getElementById('rightChain');

alphabet.map(letter => {
    leftChain.innerHTML += `<option>${letter}</option>`; 
    rightChain.innerHTML += `<option>${letter}</option>`;
});

addChainBtn.addEventListener('click', () => {
    const leftValue = leftChain.value;
    const rightValue = rightChain.value;

    if (leftValue === rightValue) {
        alert('it is pointless...');
        return;
    }

    chains.push([leftValue, rightValue]);
    
    const newChainDisplay = document.createElement('span');
    newChainDisplay.innerHTML = `${leftValue} <===> ${rightValue}`;
    chainWrapper.appendChild(newChainDisplay);
    
    const usedWords = chains.flat();
    const updatedAlphabet = alphabet.filter(letter => !usedWords.includes(letter));
    leftChain.innerHTML = ''; 
    rightChain.innerHTML = '';
    updatedAlphabet.map(letter => {
        leftChain.innerHTML += `<option>${letter}</option>`; 
        rightChain.innerHTML += `<option>${letter}</option>`;
    });
});

export { chains };