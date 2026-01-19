/**
 * Turns first character of string into uppercase letter (e.g. patients --> Patients)
 * @param {string} string - String to replace first letter with uppercase
 * @returns {string} - Updated string
 */
function firstLetterUppercase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Removes "s" from the ending, e.g. patients --> patient, incidents --> incident
 * @param string
 * @returns {*}
 */
function removeSFromString(string) {
  if (string.endsWith("s")) {
    return string.replace("s", "");
  }
}

export { firstLetterUppercase, removeSFromString };