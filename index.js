import { createFolders, createSymlink, removeFolders } from "./file.js";
import { join } from "path";

class Packager {
  constructor(serverless) {
    this.serverless = serverless;
    this.removeFoldersPath = [];
    this.skipCleanup = false;
  }
  hooks = {
    "before:package:initialize": this.packageLayer.bind(this),
    "after:package:finalize": this.cleaningLayer.bind(this),
  };

  async packageLayer() {
    const { service: { layers, custom } = {} } = this.serverless || {};

    const { layers: customLayers = {} } =
      custom["serverless-layer-organizer"] || {};

    await Promise.all(
      Object.keys(customLayers).map(async (customLayer, index) => {
        if (!layers[customLayer]) return;

        console.log(`Organizing ${customLayer} layer...`);

        const organizerFolder = `organizer${index}`;
        this.removeFoldersPath.push(organizerFolder);

        const { path: originalPath } = layers[customLayer];
        layers[customLayer].path = organizerFolder;

        const { pathPrefix } = customLayers[customLayer];
        const symlinkPath = join(organizerFolder, pathPrefix, originalPath);

        await createFolders([join(organizerFolder, pathPrefix)]);
        await createSymlink(symlinkPath, originalPath);
      }),
    ).catch((err) => {
      console.log("[Serverless-Layer-Organizer] Error", err);
      removeFolders(this.removeFoldersPath);
      this.skipCleanup = true;
    });
  }
  cleaningLayer() {
    if (this.skipCleanup) return;
    removeFolders(this.removeFoldersPath);
  }
}
export default Packager;
