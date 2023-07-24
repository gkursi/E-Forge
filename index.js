// start
if (require('electron-squirrel-startup')) return; // prevent from running twice


///////////////////////////// IMPORTS //////////////////////////////////////
const { app, BrowserWindow, webContents, session } = require('electron')
const fsp = require('fs/promises');
const fs = require('fs');
const os = require('os');
const { doesNotReject } = require('assert');

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
      .then(() => console.log("Created directory!"))
      .catch((err) => {
        console.error(err);
        fsError = true;
      })
  }
}

let cssContent = [];
let fsError = false;



///////////////////////////////////// CONFIG ///////////////////////////////////////////

let fileDirToRead = "styles/"
let fileDirectory = os.homedir() + "/e-forge/"

////////////////////////////////////////////// SETUP /////////////////////////////////////////////////////

mkdir(fileDirectory + fileDirToRead)
fs.readdirSync(fileDirectory + fileDirToRead).forEach(file => {
  console.log(file);
  if (file.endsWith(".css")) {
    let tempdata = "";

    try {
      fsp.readFile(fileDirectory + fileDirToRead + file, "utf-8")
        .then((value) => {
          console.log("File value: " + value);
          cssContent.push(value);
        })
        .catch((err) => {
          fsError = true;
          console.error("Got error while reading styles: " + err);
        })
    } catch (err) {
      fsError = true;
      console.error(err);
    }
  }
});



function applyCSS() {
  setTimeout(function () {
    cssContent.forEach((value, index, array) => {
      console.log("Applying this CSS: "+value)
      BrowserWindow.getAllWindows()[0].webContents.executeJavaScript(`
        console.log("Web content created event, applying css...");

        docHead = document.querySelector("head")
        docMain = document.querySelector("body")

        docHead.innerHTML = docHead.innerHTML + "<style>`+ value.replace(/(\r\n|\n|\r)/gm, "") + `</style>"
    `).then((value) => console.log("Executed CSS!"))
        .catch((err) => {
          console.error(err);
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
      console.log("DOM event triggered");
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
      console.log("DOM event triggered");
      applyCSS();
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

  console.log("Web content created! (event)")
  applyCSS();
})

