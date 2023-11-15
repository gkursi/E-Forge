/*
  TODO list: fix error debugging

*/

// start
if (require("electron-squirrel-startup")) return; // prevent from running twice

///////////////////////////// IMPORTS //////////////////////////////////////
const { app, BrowserWindow, webContents, session } = require("electron");
const fsp = require("fs/promises");
const fs = require("fs");
const os = require("os");

const ModReader = require("./modloader/modReader");
const LOGGER = require("./cconsole");
LOGGER.warn("Test warning", "INDEX:13");
LOGGER.info("Test info", "INDEX:14");

///////////////////////////////////// CONFIG ///////////////////////////////////////////

let modDirToRead = "mods/";
let fileDirectory = os.homedir() + "/e-forge/";

////////////////////////////////////////////// SETUP /////////////////////////////////////////////////////
const globModReader = new ModReader(fileDirectory + modDirToRead);

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
    fsp
      .mkdir(dir)
      .then(() => LOGGER.info("Created directory!", "INDEX#mkdir:52"))
      .catch((err) => {
        LOGGER.warn("Caught error: " + err, "INDEX#mkdir:54");
        fsError = true;
      });
  }
}

let cssContent = [];
let fsError = false;
let fullModError = "";

mkdir(fileDirectory + modDirToRead);
fs.readdirSync(fileDirectory + modDirToRead).forEach((file) => {
  if (file.toLowerCase().endsWith(".css")) {
    let tempdata = "";
    try {
      fsp
        .readFile(fileDirectory + modDirToRead + file, "utf-8")
        .then((value) => {
          LOGGER.info("File value: " + value, "INDEX:72");
          cssContent.push(value);
        })
        .catch((err) => {
          fsError = true;
          LOGGER.warn("Got error while reading styles: " + err, "INDEX:77");
        });
    } catch (err) {
      fsError = true;
      LOGGER.warn("Caught error: " + err, "INDEX:81");
    }
  } else if (file.toLowerCase().endsWith(".mod")) {
    globModReader.loadMod(file);
  }
});

function applyCSS() {
  setTimeout(function () {
    cssContent.forEach((value, index, array) => {
      BrowserWindow.getAllWindows()[0]
        .webContents.executeJavaScript(
          `
        docHead = document.querySelector("head")
        docMain = document.querySelector("body")

        docHead.innerHTML = docHead.innerHTML + "<style>` +
            value.replace(/(\r\n|\n|\r)/gm, "") +
            `</style>"
    `
        )
        .then((value) => LOGGER.info("Executed CSS!", "INDEX#applyCSS:101"))
        .catch((reason) => {
          LOGGER.warn("Caught error: " + reason, "INDEX#applyCSS:103");
        });
    });
  }, 1);
}

//////////////////////////////////// WINDOWS /////////////////////////////////////////

const createWindow = () => {
  if (globModReader.isErrorThrown()) {
    const popup = new BrowserWindow({
      width: 700,
      height: 200,
      title: "Mod load error",
      icon: "./assets/favicon.ico",
      //   webPreferences: {
      //     preload: path.join(__dirname, './html/js/preload.js')
      //   }
    });

    // win.loadFile('html/index.html')
    popup.loadFile("html/css_not_found.html");
  }

  if (fsError) {
    const win = new BrowserWindow({
      width: 700,
      height: 200,
      frame: true,
      darkTheme: true,
      title: "Main load error",
      icon: "./assets/favicon-err.ico",
      alwaysOnTop: true,
      //   webPreferences: {
      //     preload: path.join(__dirname, './html/js/preload.js')
      //   }
    });

    // win.loadFile('html/index.html')
    win.loadFile("html/css_not_found.html");

    win.webContents.on("dom-ready", () => {
      LOGGER.info("DOM event triggered", "INDEX?webcontents#dom-ready:132");
      applyCSS();
    });
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
      icon: "./assets/favicon.ico",
      //   webPreferences: {
      //     preload: path.join(__dirname, './html/js/preload.js')
      //   }
    });

    // win.loadFile('html/index.html')
    win.loadURL("https://e-klase.lv");

    win.webContents.on("dom-ready", () => {
      LOGGER.info("DOM event triggered", "INDEX?webcontents#dom-ready:155");
      applyCSS();
      setTimeout(() => {
        globModReader.applyMods(BrowserWindow.getAllWindows()[0].webContents);
      }, 1);
      
    });
  }
};

/////////////////////////////////////////// EVENTS /////////////////////////////////////////////////

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  globModReader.exit(LOGGER);
  if (process.platform !== "darwin") app.quit();
});

app.on("web-contents-created", (webContents) => {
  LOGGER.info("Web content created! (event)", "INDEX?web-contents-created:178");
  applyCSS();
  setTimeout(() => {
    globModReader.applyMods(BrowserWindow.getAllWindows()[0].webContents);
  }, 1);
});
