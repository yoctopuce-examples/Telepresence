const {app, BrowserWindow, Tray} = require('electron');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow()
{
    //startVirtualHub();

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        icon: "logo_black.png",
        fullscreen: true
    });
    // and load the index.html of the app.
    win.loadFile('index.html');
    //win.setMenu(null);
    //win.removeMenu();

    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

let child = require('child_process').execFile;
let os = require("os");

function startVirtualHub()
{
    let arch = os.arch();
    let ostype = os.type().toLowerCase();
    let executablePath = "";
    if (ostype.startsWith("win")) {
        executablePath = "windows/VirtualHub.exe";
    } else if (ostype === 'linux') {
        if (arch === 'x64') {
            executablePath = "linux/64bits/VirtualHub.exe";
        } else if (arch === 'ia32') {
            executablePath = "linux/32bits/VirtualHub.exe";
        } else if (arch === 'armv7l') {
            executablePath = "linux/armhf/VirtualHub.exe";
        }
    } else if (ostype === 'darwin') {
        executablePath = "osx/VirtualHub.exe";
    }

    if (executablePath !== "") {
        console.log("Start VirtualHub (" + executablePath + ")");
        child("VirtualHub/" + executablePath, function (err, data) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(data.toString());
        });
    }
    createWindow();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', startVirtualHub);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});
