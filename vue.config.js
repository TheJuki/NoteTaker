module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        nsis: {
          oneClick: false,
          perMachine: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          deleteAppDataOnUninstall: true,
          createDesktopShortcut: true,
          installerIcon: "build/icons/icon.ico",
          uninstallerIcon: "build/icons/icon.ico",
          uninstallDisplayName: "Uninstall Note Taker",
          license: "EULA.html",
          runAfterFinish: true
        },
        mac: {
          icon: "build/icons/icon.icns"
        },
        win: {
          icon: "build/icons/icon.ico"
        },
        linux: {
          icon: "build/icons"
        },
        appId: "com.thejuki.note-taker",
        productName: "Note Taker",
        copyright: "Copyright © 2018 Justin Kirk"
      }
    }
  }
}
