import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

const root = path.resolve(app.getAppPath(), "index.html");

let win: BrowserWindow | null;

// create our window
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile(root);

  if (process.env.GAME_ENV === "debug") {
    win.webContents.openDevTools({ mode: "detach" });
  }

  // what happens when you close the window
  win.on("closed", () => {
    win = null;
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win !== null) {
    createWindow();
  }
});

// Receiving a quit event from the game
ipcMain.on("quit", () => {
  app.quit();
});

app.on("ready", createWindow);
