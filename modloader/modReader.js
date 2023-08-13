const fs = require("fs");
const fsp = require("fs/promises");
const LOGGER = require("../cconsole");
const decompress = require("decompress");
const path = require("path");

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fsp
      .mkdir(dir)
      .then(() => LOGGER.info("Created directory!", "MODREADER#mkdir:9"))
      .catch((err) => {
        LOGGER.warn("Caught error: " + err, "MODREADER#mkdir:11");
      });
  }
}

function rmdir(dir) {
  if (fs.existsSync(dir)) {
    fsp
      .rmdir(dir)
      .then(() => LOGGER.info("Removed directory!", "MODREADER#rmdir:21"))
      .catch((err) => {
        LOGGER.warn("Caught error: " + err, "MODREADER#rmdir:23");
      });
  }
}

function applyCSS(css, webvar) {
  webvar.executeJavascript(
    `
    document.querySelector("html")[0].innerHTML = docHead.innerHTML + "<style>` +
      css.replace(/(\r\n|\n|\r)/gm, "") +
      `</style>"`
  );
}

module.exports = class ModReader {
  constructor(modDir) {
    this.modDir = modDir;
    this._modDir = modDir + "/unpacked/";
    this.modFilePaths = [];
    this.modFiles = [];
    this.extractedFolderPaths = [];
    rmdir(this._modDir);
    mkdir(this._modDir);
  }

  loadMod(filename) {
    this.modFilePaths.push(filename);
    decompress(this.modDir + "/" + filename, this._modDir)
      .then((files) => {
        LOGGER.info(files, "MODREADER->ModReader#loadMod:44");
      })
      .catch((error) => {
        LOGGER.warn(
          "Caught error: " + error,
          "MODREADER->ModReader#loadMod:47"
        );
      });
    this.extractedFolderPaths.push(
      this._modDir + path.basename(filename).replace(".mod", "")
    );
  }

  applyMods(webvar) {}
};


// todo: read mods mod.js, extract mod content, apply mod content