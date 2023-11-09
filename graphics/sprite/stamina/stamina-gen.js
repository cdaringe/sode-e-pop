// node graphics/sprite/svg/stamina-gen.js
function polarToCartesian(centerX, centerY, radius, angleInDegrees, strokeW) {
  const angleInRadians = -Math.PI / 2 + (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians) + strokeW / 2,
    y: centerY + radius * Math.sin(angleInRadians) + strokeW / 2,
  };
}

function svgArc(radius, startAngle, endAngle) {
  const strokeW = 20;
  const start = polarToCartesian(radius, radius, radius, startAngle, strokeW);
  const end = polarToCartesian(radius, radius, radius, endAngle, strokeW);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  const sweepFlag = endAngle >= startAngle ? 1 : 0;
  return `<svg
style='display: block;width: 40px; height: 40px'
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 ${radius * 2 + strokeW} ${radius * 2 + strokeW}">
<path stroke="#00df00" stroke-width="${strokeW}" fill="none" d="
M ${start.x} ${start.y}
A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}"/>
</svg>`;
}
function svgArcUri(radius, startAngle, endAngle) {
  return `data:image/svg+xml;utf8,${svgArc(radius, startAngle, endAngle)}`;
}

const numSvg = 60;
const svgs = [...new Array(numSvg)].map((_, i) => {
  const percent = (numSvg - i) / numSvg;
  const svgStr = svgArc(50, 0.001, 360 * percent);
  return svgStr;
});

const fs = require("fs");
const cp = require("child_process");

svgs.forEach((svg, i) => {
  const filenameSansExt = `${__dirname}/stamina_${i}`;
  const svgFilename = `${filenameSansExt}.svg`;
  const pngFilename = `${filenameSansExt}.png`;
  fs.writeFileSync(svgFilename, svg);
  cp.execSync(
    `convert ${svgFilename} -fill none -background none -fuzz 50% -transparent white -resize 32 ${pngFilename}`,
    {
      cwd: __dirname,
      stdio: "inherit",
    }
  );
  fs.unlinkSync(svgFilename);
});

// create a sprite sheet
// cp.exec(
//   "convert -append *.svg -fill none -background none -fuzz 50% -transparent white -resize 32 stamina_spritesheet.png",
//   {
//     cwd: __dirname,
//     stdio: "inherit",
//   }
// );
console.log("ok");
