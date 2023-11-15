let x = [""];

function getErrorObject(){
  try { throw Error('') } catch(err) { return err; }
}

module.exports.warn = function _l(t) {

  try {
    var err = getErrorObject();
    var caller_line = err.stack.split("\n")[4];
  } catch {}
  var l = caller_line

  console.log(
    "\x1b[97m [\x1b[91m WARN\x1b[97m ]\x1b[37m Warning from \x1b[32m%s: \n\x1b[97m [\x1b[91m WARN\x1b[95m:2\x1b[97m ] \x1b[37m%s\x1b[97m",
    l,
    t
  );
  x.push("[INFO] "+t+" ( "+l+" )\n");
};
module.exports.info = function _l(t) {

  try {
    var err = getErrorObject();
    var caller_line = err.stack.split("\n")[4];
  } catch {}
  var l = caller_line

  
  console.log(
    "\x1b[97m [\x1b[96m INFO\x1b[97m ]\x1b[37m Info from \x1b[32m%s: \n\x1b[97m [\x1b[96m INFO\x1b[94m:2\x1b[97m ] \x1b[37m%s\x1b[97m",
    l,
    t
  );
  x.push("[INFO] "+t+" ( "+l+" )\n");
};

module.exports.getAllLogs = function __e() {
  let r = "";
  x.reverse();
  x.reverse().forEach((v) => (r += v));
  return r;
};
