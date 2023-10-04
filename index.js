import { createFolders, createSymlink } from "./file.js";
import { join } from "path";
import { rimraf } from "rimraf";

class Packager {
  constructor(serverless, cliOptions) {
    this.serverless = serverless;
    this.cliOptions = cliOptions;
  }
  hooks = {
    "before:package:initialize": this.packageLayer.bind(this),
    "after:package:finalize": this.cleaningLayer.bind(this),
  };

  async packageLayer() {
    const { service } = this.serverless || {};
    const { name, runtime } = service || {};

    if (name !== "aws" || !runtime.toLowerCase().includes("nodejs")) {
      this.skipCleanup = true;
      return;
    }
    const symlinkPath = "nodejs/node_modules";

    await createFolders(["nodejs"]);
    await createSymlink(symlinkPath);
    console.log("Organizing Layers...");

    this.removeFolderPath = symlinkPath;
  }
  cleaningLayer() {
    if (this.skipCleanup) return;
    if (this.removeFolderPath)
      return rimraf(join(process.cwd(), this.removeFolderPath));
  }
}
export default Packager;
