const cp = require("child_process");
const { localModsDirname, pkg, getModBasenames } = require("./common");
const fs = require("fs-extra");

const modBasenames = getModBasenames().filter((x) => x.includes(pkg.name));

for (const basename of modBasenames) {
  fs.removeSync(`${localModsDirname}/${basename}`);
}

console.log("remaining mods:");
console.log(getModBasenames());

console.log("cleaned.");
