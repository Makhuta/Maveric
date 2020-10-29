module.exports = {
    run: (hodnoty) => {
        let counter = hodnoty.array.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = hodnoty.array[counter];
            hodnoty.array[counter] = hodnoty.array[index];
            hodnoty.array[index] = temp;
        }
        return hodnoty.array;
    }
}