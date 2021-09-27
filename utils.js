const alphabet = ['A', 'B', 'C', 'D', 'E', 
                  'F', 'G', 'H', 'I', 'J', 
                  'K', 'L', 'M', 'N', 'O',
                  'P', 'Q', 'R', 'S', 'T',
                  'U', 'V', 'W', 'X', 'Y', 'Z'];

const isValidInput = (alphabet, input) => {
    const check = input.filter(word => {
        return alphabet.indexOf(word) !== -1;
    });

    if (check.length !== input.length) return false;

    return true;
}

export { alphabet, isValidInput };