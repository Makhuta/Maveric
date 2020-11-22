const ghosts = require("../../../botconfig/phasmaphobia.json")
const evidences = require("../../../botconfig/phasmaphobia_evidence.json")


module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        let duchove = []
        ghosts.forEach(ghost => {
            duchove.push({ name: ghost.name, evidence: [evidences[ghost.evidences[0]], evidences[ghost.evidences[1]], evidences[ghost.evidences[2]]], popis: ghost.popis })
        })

        console.log(duchove)


        res.render(view_hbs, { title: title, host_value: host_value, duchove: duchove });
    }
}