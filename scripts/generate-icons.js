const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons for each size
sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background - gray-900 (#111827)
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, size, size);

  // Add rounded corners effect
  ctx.globalCompositeOperation = 'destination-out';
  const radius = size * 0.15;
  ctx.beginPath();
  ctx.moveTo(0, radius);
  ctx.lineTo(0, size);
  ctx.lineTo(radius, size);
  ctx.arc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
  ctx.lineTo(size - radius, size);
  ctx.lineTo(size, radius);
  ctx.arc(size - radius, radius, radius, 1.5 * Math.PI, 0);
  ctx.lineTo(size, size - radius);
  ctx.lineTo(radius, size);
  ctx.arc(radius, size - radius, radius, 0, 0.5 * Math.PI);
  ctx.lineTo(0, size - radius);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';

  // Draw "SR" text - red (#dc2626)
  ctx.fillStyle = '#dc2626';
  ctx.font = `bold ${size * 0.35}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SR', size / 2, size / 2);

  // Add a subtle speed arrow
  const arrowSize = size * 0.1;
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(size * 0.75, size * 0.55);
  ctx.lineTo(size * 0.85, size * 0.5);
  ctx.lineTo(size * 0.75, size * 0.45);
  ctx.closePath();
  ctx.fill();

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buffer);

  console.log(`Generated icon-${size}x${size}.png`);
});

console.log('All icons generated successfully!');
