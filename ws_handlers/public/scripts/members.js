window.onload = function() {
    let canvas = document.getElementById("avatar_canvas");
    let context = canvas.getContext("2d");

    context.beginPath()
    context.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2 - 3, 0, 2 * Math.PI, false);
    context.fillStyle = "#ffffff";
    context.fill();
    context.lineWidth = 6;
    context.strokeStyle = "#ffffff";
    context.stroke();
    context.closePath();


    let c = document.getElementById("xp_canvas");
    ctx = c.getContext("2d");
    ctx.beginPath()
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.font = "30px Verdana";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText(`XP / XP to next Level`, c.width / 2, 44);
    context.closePath();
    change_avatar_canvas("https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/da/dad3cddae08c3e6404d5ccdb5f69aa0eb888bc49_full.jpg")
};

function user_select() {
    var u = document.getElementById("users")
    var avatar = u.options[u.selectedIndex].getAttribute("data-avatar")
    var u_xp = u.options[u.selectedIndex].getAttribute("data-xp")
    var u_xpToNextLevel = u.options[u.selectedIndex].getAttribute("data-xpToNextLevel")
    var u_level = u.options[u.selectedIndex].getAttribute("data-level")
    var u_allxp = u.options[u.selectedIndex].getAttribute("data-allxp")
    var u_xp_color = u.options[u.selectedIndex].getAttribute("data-xp_color")

    document.getElementById("level").value = u_level
    document.getElementById("allxp").value = u_allxp
    change_xp_canvas(u_xp, u_xpToNextLevel, u_xp_color)
    change_avatar_canvas(avatar)
}

function change_xp_canvas(xp, xpToNextLevel, xp_colors) {
    var c = document.getElementById("xp_canvas");
    var ctx = c.getContext("2d");
    var procenta = ((100 / (xpToNextLevel)) * xp)
    var sirka = procenta * (c.width / 100);
    ctx.beginPath()
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = xp_colors;
    ctx.fillRect(0, 0, sirka, c.height);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.font = "30px Verdana";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${xp}/${xpToNextLevel} XP`, c.width / 2, 44);
}

async function change_avatar_canvas(avatar) {
    var c = document.getElementById("avatar_canvas");
    var ctx = c.getContext("2d");
    ctx.beginPath()
    ctx.clearRect(0, 0, c.width, c.height);
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, 150, 150);
    }
    ctx.arc(c.width / 2, c.height / 2, c.height / 2 - 3, 0, Math.PI * 2, true);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#2f3136";
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    img.src = avatar;

}