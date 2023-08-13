// start
if (require('electron-squirrel-startup')) return; // prevent from running twice


///////////////////////////// IMPORTS //////////////////////////////////////
const { app, BrowserWindow, webContents, session } = require('electron')
const fsp = require('fs/promises');
const fs = require('fs');
const os = require('os');
const { doesNotReject } = require('assert');

const ModReader = require('./modloader/modReader')
const LOGGER = require('./cconsole')
// LOGGER.warn("Warnng text", "location");
// LOGGER.info("Info text", "location");

///////////////////////////////////// CONFIG ///////////////////////////////////////////

let modDirToRead = "mods/"
let fileDirectory = os.homedir() + "/e-forge/"


////////////////////////////////////////////// SETUP /////////////////////////////////////////////////////
const globModReader = new ModReader(fileDirectory+modDirToRead);




/*try {
    fsp.readFile(fileDirectory+fileDirToRead, "utf-8")
      .then((value) => {
        // console.log(value);
        cssContent = value;
      })
      .catch((err) => {
        fsError = true;
        console.error(err);
      })
} catch (err){
    fsError = true;    
    console.error(err);
}*/






function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fsp.mkdir(dir)
      .then(() => LOGGER.info("Created directory!", "INDEX#mkdir:52"))
      .catch((err) => {
        LOGGER.warn("Caught error: "+err, "INDEX#mkdir:54")
        fsError = true;
      })
  }
}

let cssContent = [];
let fsError = false;



mkdir(fileDirectory + modDirToRead)
fs.readdirSync(fileDirectory + modDirToRead).forEach(file => {
  if (file.toLowerCase().endsWith(".css")) {
    let tempdata = "";
    try {
      fsp.readFile(fileDirectory + modDirToRead + file, "utf-8")
        .then((value) => {
          LOGGER.info("File value: " + value, "INDEX:72");
          cssContent.push(value);
        })
        .catch((err) => {
          fsError = true;
          LOGGER.warn("Got error while reading styles: " + err, "INDEX:77");
        })
    } catch (err) {
      fsError = true;
      LOGGER.warn("Caught error: "+err, "INDEX:81")
    }
  } else if(file.toLowerCase().endsWith(".mod")) {
    globModReader.loadMod(file);
  }
});



function applyCSS() {
  setTimeout(function () {
    cssContent.forEach((value, index, array) => {
      LOGGER.info("Applying this CSS: "+value)
      BrowserWindow.getAllWindows()[0].webContents.executeJavaScript(`
        console.log("Web content created event, applying css...");

        docHead = document.querySelector("head")
        docMain = document.querySelector("body")

        docHead.innerHTML = docHead.innerHTML + "<style>`+ value.replace(/(\r\n|\n|\r)/gm, "") + `</style>"
    `).then((value) => LOGGER.info("Executed CSS!", "INDEX#applyCSS:101"))
        .catch((err) => {
          LOGGER.warn("Caught error: "+err, "INDEX#applyCSS:103");
        });
    })
  }, 1);
}

//////////////////////////////////// WINDOWS /////////////////////////////////////////

const createWindow = () => {

  if (fsError) {
    const win = new BrowserWindow({
      width: 700,
      height: 200,
      resizable: false,
      fullscreenable: false,
      frame: true,
      darkTheme: true,
      movable: false,
      title: "Main load error"
      //   webPreferences: {
      //     preload: path.join(__dirname, './html/js/preload.js')
      //   }
    })

    // win.loadFile('html/index.html')
    win.loadFile("html/css_not_found.html")

    win.webContents.on("dom-ready", () => {
      LOGGER.info("DOM event triggered", "INDEX?webcontents#dom-ready:132");
      applyCSS();
    })

  } else {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      //   resizable: false,
      fullscreenable: false,
      frame: true,
      darkTheme: true,
      movable: true,
      title: "Loading..",
      //   webPreferences: {
      //     preload: path.join(__dirname, './html/js/preload.js')
      //   }
    })

    // win.loadFile('html/index.html')
    win.loadURL("https://e-klase.lv");

    win.webContents.on("dom-ready", () => {
      LOGGER.info("DOM event triggered", "INDEX?webcontents#dom-ready:155");
      applyCSS();
      globModReader.applyMods(BrowserWindow.getAllWindows()[0].webContents);
    })

  }
}

/////////////////////////////////////////// EVENTS /////////////////////////////////////////////////

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('web-contents-created', (webContents) => {

  LOGGER.info("Web content created! (event)", "INDEX?web-contents-created:178")
  applyCSS();
  setTimeout(() => {
    // globModReader.applyMods(BrowserWindow.getAllWindows()[0].webContents);
  }, 1);
})

