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

console.log(
  cp
    .execSync(
      `rsync -r --exclude node_modules ${exclude
        .map((e) => `--exclude '${e}'`)
        .join(" ")} ./ ${common.localModDirname}`
    )
    .toString()
);

console.log(`tree: ${common.localModDirname}`);
console.log(cp.execSync(`tree ${common.localModDirname}`).toString());
