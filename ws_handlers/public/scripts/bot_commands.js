function select_command(id) {
    var u = document.getElementById(id)
    var name = u.id
    var description = u.getAttribute("command_description")
    var usage = u.getAttribute("command_usage")
    var accessableby = u.getAttribute("command_accessableby")
    var aliases = u.getAttribute("command_aliases")
    document.getElementById("name").innerHTML = name
    document.getElementById("description").innerHTML = description
    document.getElementById("usage").innerHTML = usage
    document.getElementById("accessableby").innerHTML = accessableby
    document.getElementById("aliases").innerHTML = aliases
}