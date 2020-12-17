function select_from_list(id) {
    var u = document.getElementById(id)
    var name = u.id
    var evidence = u.getAttribute("evidence")
    var popis = u.getAttribute("popis")
    document.getElementById("name").innerHTML = name
    document.getElementById("evidence").innerHTML = evidence
    document.getElementById("popis").innerHTML = popis
}