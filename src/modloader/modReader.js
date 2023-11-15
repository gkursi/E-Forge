const fs = require("fs");
const fsp = require("fs/promises");
const LOGGER = require("../cconsole");
const decompress = require("decompress");
const path = require("path");
const { log } = require("console");


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

function modError(error) {
  alert("Got error while loading mods: " + error);
}

function rmdir(dir) {
  if (fs.existsSync(dir)) {
    fsp
      .rm(dir, { recursive: true, force: true })
      .then(() => LOGGER.info("Removed directory!", "MODREADER#rmdir:21"))
      .catch((err) => {
        LOGGER.warn("Caught error: " + err, "MODREADER#rmdir:23");
      });
  }
}

function applyCSS(css, webvar) {
  LOGGER.info(">>>>>>>>>>>>>>>>>>>>>>>> "+css)
  webvar.executeJavascript(
    `
    document.querySelector("html")[0].innerHTML = docHead.innerHTML + "<style>` +
      css.toString().replace(/(\r\n|\n|\r)/gm, "") +
      `</style>"`
  );
}

function applyJS(js, webvar) {
  webvar.executeJavascript(js.replace(/(\r\n|\n|\r)/gm, ""));
}

module.exports = class ModReader {
  constructor(modDir) {
    this.modDir = modDir;
    this._modDir = modDir + "/unpacked/";
    this.modFilePaths = [];
    this.modScriptFiles = [];
    this.modStyleFiles = [];
    this.extractedFolderPaths = [];
    this.errors = [];
    rmdir(this._modDir);
    mkdir(this._modDir);
  }

  isErrorThrown() {
    return this.errors != [];
  }

  async loadMod(filename) {
    this.modFilePaths.push(filename);
    decompress(this.modDir + "/" + filename, this._modDir)
      .then((files) => {
        LOGGER.info("Unlocked mod "+filename, "MODREADER->ModReader#loadMod:69");
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

  applyMods(webvar) {
    this.extractedFolderPaths.forEach((value, index, array) => {
      let mod;
      try {
        mod = require(value+"/mod.js");
        mod.mod_content.forEach((content, i, a) => {
          if(content["type"] == "style"){

            fsp.readFile(value+content["value"])
            .then((cdsh) => {
              this.modStyleFiles.push(cdsh);
            })
            .catch((err) => {
              this.errors.push(err);
            })
          } else if(content["type"] == "script"){

            fsp.readFile(value+content["value"], "utf-8")
            .then((cdsh) => {
              console.log(cdsh)
              this.modScriptFiles.push(cdsh);
            })
            .catch((err) => {
              this.errors.push(err);
            })
          }
        })

      } catch (error) {
        this.errors.push(error)
      }
      
    });

    this.modStyleFiles.forEach((value) => {
      applyCSS(value, webvar);
    });

    this.modScriptFiles.forEach((value) => {
      applyJS(value, webvar);
    });
    
    if (!this.errors == []) {
      LOGGER.warn(
        "Warning: Some mods produced errors! " + this.errors,
        "MODREADER#applyMods:119"
      );
    }
  }

  exit(globalLogger) {
    let errorOutput = "";
    this.errors.forEach((value) => (errorOutput += "[ " + value + " ]\n"));
    fsp
      .writeFile(
        this.modDir + "/../latest.log",
        `Latest E-Forge log!\n\n` +
          `ERRORS: ` +
          errorOutput +
          `INDEX_LOGS: ` +
          globalLogger.getAllLogs() +
          `MODREADER_LOGS: ` +
          LOGGER.getAllLogs()
      )

      .then((value) => {
        LOGGER.info("Saved latest logs!", "code_end");
      })
      .catch((err) => {
        LOGGER.warn("Unable to save logs!", "code_end");
      });
  }
};

// todo: read mods mod.js, extract mod content, apply mod content
