// todo: make a readable modreader / creator

const fs = require('fs')
const LOGGER = require('../cconsole')

function mkdir(dir) {
    if (!fs.existsSync(dir)) {
      fsp.mkdir(dir)
        .then(() => LOGGER.info("Created directory!", "MODREADER#mkdir:9"))
        .catch((err) => {
          LOGGER.warn("Caught error: "+err, "MODREADER#mkdir:11")
          fsError = true;
        })
    }
}


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