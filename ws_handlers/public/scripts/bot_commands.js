function select_command(id) {
    var u = document.getElementById(id)
    var name = u.id
    var description = u.getAttribute("data-command_description")
    var usage = u.getAttribute("data-command_usage")
    var accessableby = u.getAttribute("data-command_accessableby")
    var aliases = u.getAttribute("data-command_aliases")
    document.getElementById("name").innerHTML = name
    document.getElementById("description").innerHTML = description
    document.getElementById("usage").innerHTML = usage
    document.getElementById("accessableby").innerHTML = accessableby
    document.getElementById("aliases").innerHTML = aliases
}