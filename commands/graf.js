const { prefix } = require("../botconfig.json")
const predates = require("../events/member_graph_local_database").database
const { MessageAttachment } = require("discord.js");
const colors = require("../colorpaletes/colors.json")
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")
const { CanvasRenderService } = require("chartjs-node-canvas")

const day_miliseconds = 86400000;
var sirka = 1000;
var vyska = 333;

const chartCallback = (ChartJS) => {
    ChartJS.plugins.register({
        beforeDraw: (chartInstance) => {
            const { ctx } = chartInstance.chart
            ctx.fillStyle = colors.mid_gray
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height)
        }
    })
}

const name = "graf"
const description = "Pošle graf memberů za poslední měsíc."
const usage = prefix + name
const accessableby = ["Member"]
const aliases = ["g"]

async function graf(data_edited) {
    let datumy = []
    let hodnoty_uzivatelu = []

    data_edited.forEach(dat => {
        datumy.push(dat.date)
        hodnoty_uzivatelu.push(dat.num_of_members)
    })

    const canvas = new CanvasRenderService(
        sirka,
        vyska,
        chartCallback
    )
    const configuration = {
        type: "bar",
        data: {
            labels: datumy,
            datasets: [
                {
                    label: "Discord Members",
                    data: hodnoty_uzivatelu,
                    backgroundColor: colors.light_blue,
                },
            ],
        },
    }
    const image = await canvas.renderToBuffer(configuration)

    const attachment = new MessageAttachment(image)
    let hodnoty = ({ zprava: attachment, roomname: require("../botconfig/roomnames.json").botcommand })
    find_channel_by_name.run(hodnoty)
}

module.exports.run = async (message, args) => {
    let dates = predates.dates
    let dates_length = dates.length
    let data_edited = []
    if (dates_length > 28) {
        dates = dates.slice(dates_length - 29, dates_length - 1)
    }
    dates.forEach(datum => {
        let DATE = new Date(datum.date * 1 - day_miliseconds)
        let datum_formatovane = DATE.getMonth() + 1 + "." + DATE.getDate() + "."
        data_edited.push({ date: datum_formatovane, num_of_members: datum.num_of_members })
    });

    graf(data_edited)

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}