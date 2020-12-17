function select_from_list(id) {
    var u = document.getElementById(id + "_container")
    var name = u.getAttribute("data-name")
    var evidence = u.getAttribute("data-evidence")
    var popis = u.getAttribute("data-popis")
    document.getElementById("name").innerHTML = name
    document.getElementById("evidence").innerHTML = evidence
    document.getElementById("popis").innerHTML = popis
}