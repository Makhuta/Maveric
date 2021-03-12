module.exports = function map_to_string(map) {
    let jsonObject = {};
    map.forEach((value, key) => {
        jsonObject[key] = value
    });
    jsonObject = JSON.stringify(jsonObject)
    return jsonObject
}