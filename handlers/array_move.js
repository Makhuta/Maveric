module.exports = {
    async run(hodnotyin) {
        let array = []
        let number_to_shift = hodnotyin.number_to_shift

        for (i = 0; i < hodnotyin.array.length; i++) {
            array.push(hodnotyin.array[i])
        }

            for (s = 0; s < number_to_shift; s++) {
            let cached_number = array.shift();
            array.push(cached_number)
        }



        return array
    }
}