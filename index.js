const { join } = require("path");

global.root = __dirname;
global.src = join(root, "src");
global.commands = join(src, "commands");
global.events = join(src, "events");
global.canvases = join(src, "canvases");
global.pictures = join(src, "pictures");
global.colorpaletes = join(src, "colorpaletes");
global.fonts = join(src, "fonts");

require("./src/events/start").run();
