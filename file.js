import fs from "fs/promises";
import { rimraf } from "rimraf";
import { join } from "path";

const MODE_0755 = parseInt("0755", 8);

const createFolders = (folders = []) =>
  Promise.all(
    folders.map(
      (dirToCreate) =>
        dirToCreate &&
        fs.mkdir(dirToCreate, { recursive: true, mode: MODE_0755 }),
    ),
  );
const removeFolders = (folders = []) =>
  folders.forEach((folder) => rimraf(join(process.cwd(), folder)));

const createSymlink = async (src, target) => {
  const targetPath = join(process.cwd(), target);
  const symlinkPath = join(process.cwd(), src);
  return fs.symlink(targetPath, symlinkPath, "junction");
};

export { createSymlink, createFolders, removeFolders };
