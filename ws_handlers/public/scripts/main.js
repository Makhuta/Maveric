function main_restart_time(start) {
    setdate(start)

    setInterval(() => {
        setdate(start)
    }, 1000)
}

function setdate(start) {
    let cas_rozdil = Date.now() - start

    let roky = Math.floor(cas_rozdil / 1000 / 60 / 60 / 24 / 365);
    let dny = Math.floor((cas_rozdil / 1000 / 60 / 60 / 24) % 365);
    let hodiny = Math.floor((cas_rozdil / 1000 / 60 / 60) % 24);
    let minuty = Math.floor((cas_rozdil / 1000 / 60) % 60);
    let sekundy = Math.floor(cas_rozdil / 1000 % 60);

    if (dny < 10) dny = "00" + dny
    if (hodiny < 10) hodiny = "0" + hodiny
    if (minuty < 10) minuty = "0" + minuty
    if (sekundy < 10) sekundy = "0" + sekundy

    var datum = [roky, dny, hodiny, minuty, sekundy]
    datum = datum.join(":")
    document.getElementById("time").innerHTML = datum
}