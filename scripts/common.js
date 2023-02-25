const os = require("os");
const path = require("path");
const pkg = require("../package.json");
const info = require("../info.json");
const fs = require("fs-extra");

const platform = os.platform();
const localDataDirname = platform.match(/linux/)
  ? path.join(process.env.HOME, ".factorio")
  : platform.match(/darwin/)
  ? path.join(process.env.HOME, "Library", "Application Support", "factorio")
  : (() => {
      throw new Error(`${platform} not supported`);
    })();

const localModsDirname = path.join(localDataDirname, "mods");

const localModDirname = path.join(
  localModsDirname,
  `${info.name}_${info.version}`
);

const getModBasenames = () =>
  fs
    .readdirSync(localModsDirname)
    .filter((f) => !f.endsWith("json") && !f.endsWith("dat"));

module.exports = {
  getModBasenames,
  localDataDirname,
  localModsDirname,
  localModDirname,
  pkg,
  info,
};
