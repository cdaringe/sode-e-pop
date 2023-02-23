const os = require("os");
const path = require("path");
const pkg = require("../package.json");
const info = require("../info.json");

const platform = os.platform();
const localDataDirname = platform.match(/linux/)
  ? path.join(process.env.HOME, ".factorio")
  : platform.match(/darwin/)
  ? path(process.env.HOME, "Library", "Application Support", "factorio")
  : (() => {
      throw new Error(`${platform} not supported`);
    })();

const localModsDirname = path.join(localDataDirname, "mods");

const localModDirname = path.join(
  localModsDirname,
  `${info.name}_${info.version}`
);

module.exports = {
  localDataDirname,
  localModsDirname,
  localModDirname,
  pkg,
  info,
};
