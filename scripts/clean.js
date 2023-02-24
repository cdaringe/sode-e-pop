const cp = require("child_process");
const { localModsDirname, pkg } = require("./common");
const fs = require("fs");

const modBasenames = fs
  .readdirSync(localModsDirname)
  .filter((x) => x.includes(pkg.name));

for (const basename of modBasenames) {
  const params = [
    "rm",
    ["-rf", `${localModsDirname}/${basename}`],
    {
      stdio: "inherit",
    },
  ];

  console.log(...params);
  cp.spawn(...params);
}
console.log("cleaned.");
