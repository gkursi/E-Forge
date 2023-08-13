module.exports.warn = function _l(text, location) {
  console.log(
    "\x1b[97m [\x1b[91m WARN\x1b[97m ]\x1b[37m Info from \x1b[32m%s: \n\x1b[97m [\x1b[91m WARN\x1b[95m:2\x1b[97m ] \x1b[37m%s\x1b[97m",
    location,
    text
  );
};
module.exports.info = function _l(text, location) {
  console.log(
    "\x1b[97m [\x1b[96m INFO\x1b[97m ]\x1b[37m Info from \x1b[32m%s: \n\x1b[97m [\x1b[96m INFO\x1b[94m:2\x1b[97m ] \x1b[37m%s\x1b[97m",
    location,
    text
  );
};
