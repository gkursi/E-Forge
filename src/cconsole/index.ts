let x = [""];

module.exports.warn = function _l(t, l) {
  console.log(
    "\x1b[97m [\x1b[91m WARN\x1b[97m ]\x1b[37m Warning from \x1b[32m%s: \n\x1b[97m [\x1b[91m WARN\x1b[95m:2\x1b[97m ] \x1b[37m%s\x1b[97m",
    l,
    t
  );
  x.push(l, t, "\n");
};
module.exports.info = function _l(t, l) {
  console.log(
    "\x1b[97m [\x1b[96m INFO\x1b[97m ]\x1b[37m Info from \x1b[32m%s: \n\x1b[97m [\x1b[96m INFO\x1b[94m:2\x1b[97m ] \x1b[37m%s\x1b[97m",
    l,
    t
  );
  x.push(l, t, "\n");
};

module.exports.getAllLogs = function __e() {
  let r = "";
  x.reverse();
  x.reverse().forEach((v) => (r += v + "\n"));
  return r;
};
