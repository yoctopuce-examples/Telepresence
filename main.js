const {app, BrowserWindow, dialog} = require('electron');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow()
{
    //startVirtualHub();

    let isfull = app.commandLine.hasSwitch('fullscreen');

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        icon: "logo_black.png",
        fullscreen: isfull
    });
    // and load the index.html of the app.
    win.loadFile('index.html');

    // Open the DevTools.
    if (app.commandLine.hasSwitch('debug')) {
        win.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

let execFile = require('child_process').execFile;
let os = require("os");
let vhub_process = null;

function startVirtualHub()
{
    let start_vhub = !app.commandLine.hasSwitch('no_vhub');

    if (start_vhub) {
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
            vhub_process = execFile("VirtualHub/" + executablePath, ['-y'], function (error, stdout, stderr) {
                if (error) {
                    console.error(error);
                    dialog.showErrorBox('VirtualHub error', error);
                    return;
                }
                if (stderr) {
                    console.log("ERR:" + stderr.toString());
                    dialog.showErrorBox('VirtualHub error', stderr.toString());
                } else {
                    console.log(stdout.toString());
                }
            });

        }
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

app.on('quit', () => {
    if (vhub_process != null) {
        vhub_process.kill('SIGKILL');
    }
});
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});
