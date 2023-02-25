const cp = require("child_process");
const common = require("./common");
const exclude = [
  ".git*",
  "node_modules",
  "scripts",
  ".gitignore",
  ".nvmrc",
  "*.ts",
  "*.md",
  "tsconfig.json",
  "build",
];

const cmd = `rsync -r --exclude node_modules ${exclude
  .map((e) => `--exclude '${e}'`)
  .join(" ")} ./ "${common.localModDirname}"`;

console.log(`> ${cmd}`);
console.log(cp.execSync(cmd).toString());

const treeCmd = `tree "${common.localModDirname}"`;
console.log(treeCmd);
console.log(cp.execSync(treeCmd).toString());
