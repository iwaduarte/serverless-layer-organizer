import fs from "fs/promises";
import path from "path";

const MODE_0755 = parseInt("0755", 8);

const createFolders = (folders = []) =>
  Promise.all(
    folders.map(
      (dirToCreate) =>
        dirToCreate &&
        fs.mkdir(dirToCreate, { recursive: true, mode: MODE_0755 }),
    ),
  );

const createSymlink = async (src, target = "node_modules") => {
  const targetPath = path.join(process.cwd(), target);
  const symlinkPath = path.join(process.cwd(), src);
  return fs.symlink(targetPath, symlinkPath, "junction");
};

export { createSymlink, createFolders };
