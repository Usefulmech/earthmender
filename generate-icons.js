const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgCode = `
<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(5, 5)">
    <circle cx="25" cy="25" r="22" fill="#fafafa" stroke="#eaeaea" stroke-width="1" />
    <path d="M25 5C30 5 35 10 35 15" stroke="#10B981" stroke-width="3" stroke-linecap="round" />
    <path d="M45 25C45 30 40 35 35 35" stroke="#000000" stroke-width="3" stroke-linecap="round" />
    <path d="M25 45C20 45 15 40 15 35" stroke="#10B981" stroke-width="3" stroke-linecap="round" />
    <path d="M5 25C5 20 10 15 15 15" stroke="#000000" stroke-width="3" stroke-linecap="round" />
    <path d="M20 25L30 25M25 20L25 30" stroke="#10B981" stroke-width="3" stroke-linecap="round" />
  </g>
</svg>
`;

async function generate() {
  const iconDir = path.join(__dirname, 'public', 'icons');
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  const sizes = [192, 512];
  
  for (const size of sizes) {
    await sharp(Buffer.from(svgCode))
      .resize(size, size)
      .png()
      .toFile(path.join(iconDir, `icon-${size}x${size}.png`));
    console.log(`Generated ${size}x${size} icon.`);
  }
}

generate().catch(console.error);
