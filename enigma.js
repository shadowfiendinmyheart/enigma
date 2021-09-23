const letter = 'HELLOWORLD';

// TODO: 1. Добавить прокрутку для среднего и медленного роторов (+)
//       2. Добавить механизм для нормализации position ротора (+)
//       3. Супер сильно потестить всё
//       4. Добавить панель для смены букв (+)
//
//       ?. Возможно поменять функции encrypt и decrypt (соеденить в одну, проход как массив и
//          двигаться по нему с разных направлений); (+)
//       ?. Раскидать прогу по файлам

const alphabet = ['A', 'B', 'C', 'D', 'E', 
                   'F', 'G', 'H', 'I', 'J', 
                   'K', 'L', 'M', 'N', 'O',
                   'P', 'Q', 'R', 'S', 'T',
                   'U', 'V', 'W', 'X', 'Y', 'Z'];

const fastRotor = {
    dictionary: [[0, 11], [1, 23], [2, 1], [3, 9], [4, 5], 
                 [5, 12], [6, 10], [7, 21], [8, 18], [9, 8], 
                 [10, 3], [11, 19], [12, 20], [13, 25], [14, 22], 
                 [15, 0], [16, 14], [17, 15], [18, 7], [19, 4], 
                 [20, 16], [21, 13], [22, 24], [23, 6], [24, 17], [25, 2]],
    position: 0
} 

const mediumRotor = {
    dictionary: [[0, 13], [1, 15], [2, 11], [3, 10], [4, 7], 
                 [5, 14], [6, 23], [7, 3], [8, 6], [9, 4], 
                 [10, 18], [11, 12], [12, 17], [13, 25], [14, 24], 
                 [15, 19], [16, 16], [17, 1], [18, 8], [19, 21], 
                 [20, 22], [21, 9], [22, 20], [23, 2], [24, 5], [25, 0]],
    position: 0
}

const slowRotor = {
    dictionary: [[0, 20], [1, 23], [2, 21], [3, 18], [4, 14], 
                 [5, 24], [6, 19], [7, 8], [8, 3], [9, 2], 
                 [10, 16], [11, 13], [12, 25], [13, 17], [14, 7], 
                 [15, 6], [16, 9], [17, 1], [18, 11], [19, 10], 
                 [20, 0], [21, 12], [22, 15], [23, 22], [24, 4], [25, 5]],
    position: 0 
}

const reflector = {
    dictionary: [[0, 9], [1, 13], [2, 16], [3, 6], [4, 19], 
                 [5, 22], [7, 11], [8, 25], [10, 18], [12, 15], 
                 [14, 21], [17, 24], [20, 23]],
}

const plugBoard = [['I', 'T'], ['Q', 'W'], ['L', 'A']];

const setRotorsPosition = (fastRotorPosition, mediumRotorPosition, slowRotorPosition) => {
    fastRotor.position = fastRotorPosition;
    mediumRotor.position = mediumRotorPosition;
    slowRotor.position = slowRotorPosition;
}

const rotorChanger = (rotor, inputPos, forward) => {
    let step;
    let changer;
    if (forward) {
        changer = rotor.dictionary[(inputPos + rotor.position) % alphabet.length];
        step = changer[1] - changer[0];
    } else {
        const finder = rotor.dictionary.findIndex(rotorChanger => {
            return rotorChanger[1] == ((inputPos + rotor.position) % alphabet.length);
        });
        changer = rotor.dictionary[finder];
        step = changer[0] - changer[1];
    }
    const outputPos = (inputPos + step) % alphabet.length;
    if (outputPos >= 0) {
        return outputPos;
    } else {
        return alphabet.length + outputPos;
    }
}

const reflectorChanger = (reflector, inputPos) => {
    const changer = reflector.dictionary.find(reflectorGate => {
        return reflectorGate[0] === inputPos || reflectorGate[1] === inputPos;
    });
    
    const outputPos = inputPos === changer[0] ? changer[1] : changer[0];
    return outputPos;
}

const plugBoardChanger = (word) => {
    const changer = plugBoard.find(plugWord => plugWord[0] === word || plugWord[1] === word);
    if (!changer) return word;
    return word === changer[0] ? changer[1] : changer[0];
}

const runMachine = (inputLetter, rotorsPosition) => {
    const words = inputLetter.toUpperCase().split(' ').join('').split('');
    const outputLetter = [];
    setRotorsPosition(...rotorsPosition);
    
    for (let i = 0; i < words.length; i++) {
        const inputChangedWord = plugBoardChanger(words[i]);
        const inputPos = alphabet.findIndex(alphabetWord => alphabetWord === inputChangedWord);

        const fastRotorOutput = rotorChanger(fastRotor, inputPos, true);
        const mediumRotorOutput = rotorChanger(mediumRotor, fastRotorOutput, true);
        const slowRotorOutput = rotorChanger(slowRotor, mediumRotorOutput, true);
        const reflectorOutput = reflectorChanger(reflector, slowRotorOutput);
        const slowRotorOutputBack = rotorChanger(slowRotor, reflectorOutput, false);
        const mediumRotorOutputBack = rotorChanger(mediumRotor, slowRotorOutputBack, false);
        const fastRotorOutputBack = rotorChanger(fastRotor, mediumRotorOutputBack, false);

        const outputChangedWord = plugBoardChanger(alphabet[fastRotorOutputBack]);
        outputLetter.push(outputChangedWord);

        fastRotor.position++;
        if (i % fastRotor.dictionary.length === 0 && i !== 0) {
            mediumRotor.position++;
        }
        if (i % (mediumRotor.dictionary.length * slowRotor.dictionary.length) === 0 && i !== 0) {
            slowRotor.position++;
        }
    }

    setRotorsPosition(...rotorsPosition);
    return outputLetter.join('');
} 

console.log('source letter: ', letter);

const encryptLetter = runMachine(letter, [5, 1, 2]);
console.log('encrypt letter:', encryptLetter);
const decryptLetter = runMachine(encryptLetter, [5, 1, 2]);
console.log('decrypt letter:', decryptLetter);
