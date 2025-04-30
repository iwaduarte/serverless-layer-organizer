import { createFolders, createSymlink, removeFolders } from "./file.js";
import { join, sep } from "path";

class Packager {
  constructor(serverless) {
    this.serverless = serverless;
    this.removeFoldersPath = [];
    this.skipCleanup = false;

    ["exit", "SIGINT", "uncaughtException", "unhandledRejection"].forEach(
      (evt) =>
        process.once(evt, async () => {
          await removeFolders(this.removeFoldersPath);
          if (evt !== "exit") process.exit(0);
        }),
    );
  }
  hooks = {
    "before:package:initialize": this.packageLayer.bind(this),
    "after:package:finalize": this.cleaningLayer.bind(this),
  };

  async packageLayer() {
    const { service: { layers, custom = {} } = {} } = this.serverless || {};

    const { layers: customLayers = {} } =
      custom["serverless-layer-organizer"] || {};

    await Promise.all(
      Object.keys(customLayers).map(async (customLayer, index) => {
        const layer = layers[customLayer];

        if (!layer) return;

        console.log(`[SLO] Organising layer "${customLayer}".`);
        const { pathPrefix } = customLayers[customLayer];
        const organizerFolder = join(".serverless", `slo-layer-${index}`);
        this.removeFoldersPath.push(organizerFolder);

        const { path: originalPath, package: pkg = {} } = layer || {};
        layer.path = organizerFolder;

        const patterns = Array.isArray(pkg.patterns) ? pkg.patterns : [];
        const unixPref = join(pathPrefix, originalPath).split(sep).join("/");

        pkg.patterns = patterns.map((p) => {
          const neg = p.startsWith("!") ? "!" : "";
          const body = p.slice(neg.length);

          // patterns starting with **/* or */* remain valid
          if (body.startsWith("*")) return p;
          return `${neg}${unixPref}/${body}`;
        });
        layer.package = pkg;

        const symlinkPath = join(organizerFolder, pathPrefix, originalPath);

        await createFolders([join(organizerFolder, pathPrefix)]);
        await createSymlink(symlinkPath, originalPath);
      }),
    ).catch(async (err) => {
      console.log("[SLO] Error", err);
      await removeFolders(this.removeFoldersPath);
      this.skipCleanup = true;
    });
  }
  async cleaningLayer() {
    if (this.skipCleanup) return;
    await removeFolders(this.removeFoldersPath);
  }
}
export default Packager;
