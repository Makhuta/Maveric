require("module-alias/register");
require("dotenv").config();
const predates = require("@events/member_graph_local_database").database
const { MessageAttachment } = require("discord.js");
const colors = require("@colorpaletes/colors.json")
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
const accessableby = ["Member"]
const aliases = ["g"]
const response = "COMMAND_ROOM_NAME";
const category = ["Statistics", "All"]

async function graf(data_edited, botconfig, message) {
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
        type: "line",
        data: {
            labels: datumy,
            datasets: [
                {
                    label: "Discord Members",
                    data: hodnoty_uzivatelu,
                    backgroundColor: "transparent",
                    borderColor: colors.light_blue,
                    lineTension: 0,
                },
            ],
        },
        scales: {
            yAxes: [{
                ticks: {
                    userCallback(label, index, labels) {
                        // only show if whole number
                        if (Math.floor(label) === label) {
                            return label;
                        }
                    },
                }
            }]
        },
    }
    const image = await canvas.renderToBuffer(configuration)

    const attachment = new MessageAttachment(image)
    let hodnoty = ({ zprava: attachment, roomname: botconfig.find(config => config.name == response).value, message: message })
    require("@handlers/find_channel_by_name").run(hodnoty)
}

module.exports.run = async (message, args, botconfig, user_lang_role) => {
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

    graf(data_edited, botconfig, message)

}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}