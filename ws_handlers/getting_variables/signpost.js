const fs = require("fs");

module.exports = {
    async run(token) {
        let exist = false
        fs.readdir("./", async (err, files) => {
            let out_name
            if (err) console.log(err);

            let jsfile = files.find(f => f.split(".").pop() === "js");
            if (jsfile.length <= 0) {
                return;
            }


            if (jsfile != token) {
                exist = exist
            }

            else {
                exist = true
            }
        });

        if (!exist) return

        let output = await require(`./${token}`)
        console.log(output.run())
        return output
    }
}