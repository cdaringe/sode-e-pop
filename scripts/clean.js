const cp = require("child_process");
const { pkg } = require("./common");

cp.spawn("rm", ["-rf", `${pkg.name}*`], { stdio: "inherit" });
console.log("cleaned.");
