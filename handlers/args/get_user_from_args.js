module.exports = {
    run: (input) => {
        let input_length = input.length
        let output = input.slice(3, input_length - 1)

        return output
    }
}