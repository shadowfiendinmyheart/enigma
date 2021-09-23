const letter = 'FFFFFFFFFFFFFFFFFF';

// TODO: 1. Добавить прокрутку для среднего и медленного роторов (+)
//       2. Добавить механизм для нормализации position ротора (+)
//       3. Супер сильно потестить всё
//       4. Добавить панель для смены букв
//
//       ?. Возможно поменять функции encrypt и decrypt (соеденить в одну, проход как массив и
//          двигаться по нему с разных направлений); (+)
//       ?. Раскидать прогу по файлам

// const alphabets = ['A', 'B', 'C', 'D', 'E', 
//                    'F', 'G', 'H', 'I', 'J', 
//                    'K', 'L', 'M', 'N', 'O',
//                    'P', 'Q', 'R', 'S', 'T',
//                    'U', 'V', 'W', 'X', 'Y', 'Z'];
const alphabets = ['A', 'B', 'C', 'D', 'E', 'F'];

const fastRotor = {
    dictionary: [[0, 2], [1, 4], [2, 0], [3, 1], [4, 3], [5, 5]],
    position: 0
} 

const mediumRotor = {
    dictionary: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [5, 5]],
    position: 0
}

const slowRotor = {
    dictionary: [[0, 4], [1, 0], [2, 2], [3, 1], [4, 3], [5, 5]],
    position: 0 
}

const reflector = {
    dictionary: [[0, 3], [1, 5], [2, 4]],
}

const setRotorsPosition = (fastRotorPosition, mediumRotorPosition, slowRotorPosition) => {
    fastRotor.position = fastRotorPosition;
    mediumRotor.position = mediumRotorPosition;
    slowRotor.position = slowRotorPosition;
}

const rotorChanger = (rotor, inputPos, forward) => {
    let step;
    let changer;
    if (forward) {
        changer = rotor.dictionary[(inputPos + rotor.position) % alphabets.length];
        step = changer[1] - changer[0];
    } else {
        const finder = rotor.dictionary.findIndex(rotorChanger => {
            return rotorChanger[1] == ((inputPos + rotor.position) % alphabets.length);
        });
        changer = rotor.dictionary[finder];
        step = changer[0] - changer[1];
    }
    const outputPos = (inputPos + step) % alphabets.length;
    if (outputPos >= 0) {
        return outputPos;
    } else {
        return alphabets.length + outputPos;
    }
}

const reflectorChanger = (reflector, inputPos) => {
    const changer = reflector.dictionary.find(reflectorGate => {
        return reflectorGate[0] === inputPos || reflectorGate[1] === inputPos;
    });
    
    const outputPos = inputPos === changer[0] ? changer[1] : changer[0];
    return outputPos;
}


const runMachine = (inputLetter, rotorsPosition) => {
    const words = inputLetter.toUpperCase().split(' ').join('').split('');
    const outputLetter = [];
    setRotorsPosition(...rotorsPosition);
    
    for (let i = 0; i < words.length; i++) {
        const inputPos = alphabets.findIndex(alphabetsWord => alphabetsWord === words[i]);
        const fastRotorOutput = rotorChanger(fastRotor, inputPos, true);
        const mediumRotorOutput = rotorChanger(mediumRotor, fastRotorOutput, true);
        const slowRotorOutput = rotorChanger(slowRotor, mediumRotorOutput, true);
        const reflectorOutput = reflectorChanger(reflector, slowRotorOutput);
        const slowRotorOutputBack = rotorChanger(slowRotor, reflectorOutput, false);
        const mediumRotorOutputBack = rotorChanger(mediumRotor, slowRotorOutputBack, false);
        const fastRotorOutputBack = rotorChanger(fastRotor, mediumRotorOutputBack, false);
        outputLetter.push(alphabets[fastRotorOutputBack]);

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

const encryptLetter = runMachine(letter, [0, 0, 0]);
console.log('encrypt letter:', encryptLetter);
const decryptLetter = runMachine(encryptLetter, [0, 0, 0]);
console.log('decrypt letter:', decryptLetter);
