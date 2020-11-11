module.exports = {
    async run (token) {
        return await require(`./${token}`).run()
    }
}