function getUpperCase(str) {
  return str.toUpperCase();
}

function getLowerCase(str) {
  return str.toLowerCase();
}

function getSentenceCase(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getProperCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
