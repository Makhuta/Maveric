module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value





        console.log("Main")
        res.render(view_hbs, { title: title, host_value: host_value });
    }
}