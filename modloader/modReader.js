// todo: make a readable modreader / creator

const fs = require('fs')
const LOGGER = require('../cconsole')

function mkdir(dir) {
    if (!fs.existsSync(dir)) {
      fsp.mkdir(dir)
        .then(() => console.log("Created directory!"))
        .catch((err) => {
          console.error(err);
          fsError = true;
        })
    }
}

LOGGER.warn("Warning text", "warning location")

module.exports = class ModReader{

    constructor(modDir){
        this.modDir = modDir;
        this.modFilePaths = [];
        this.modFiles = [];
        mkdir
    }

    loadMod(modPath) {
        this.modFilePaths.push(modPath);

    }

    applyMods(webvar){
        
    }

}