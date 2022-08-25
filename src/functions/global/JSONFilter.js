module.exports = function ({ JSONObject, SearchedElement, ElementValue }) {
  return Object.entries(JSONObject).reduce((a, [Element, ElementData]) => {
    ElementData[SearchedElement] == ElementValue ? (a[Element] = ElementData) : "";
    return a;
  }, {});
};
