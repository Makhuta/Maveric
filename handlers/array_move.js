module.exports = {
    async run(hodnotyin) {
        let array = hodnotyin.array
        let number_to_shift = hodnotyin.number_to_shift

        for (s = 0; s < number_to_shift; s++) {
            let cached_number = array.shift();
            array.push(cached_number)
        }




    }
}