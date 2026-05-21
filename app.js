const baseColorInput = document.getElementById('baseColor');
const hueAdjInput = document.getElementById('hueAdj');
const satAdjInput = document.getElementById('satAdj');
const hueValDisplay = document.getElementById('hueVal');
const satValDisplay = document.getElementById('satVal');
const swatchContainer = document.getElementById('swatchContainer');
const toast = document.getElementById('toast');
const copySvgBtn = document.getElementById('copySvgBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');

const scaleSteps = [
    { name: '50',  l: 95 },
    { name: '100', l: 90 },
    { name: '200', l: 80 },
    { name: '300', l: 70 },
    { name: '400', l: 60 },
    { name: '500', l: 50 },
    { name: '600', l: 40 },
    { name: '700', l: 30 },
    { name: '800', l: 20 },
    { name: '900', l: 12 },
    { name: '950', l: 6  },
];

function hexToHSL(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = '0x' + hex[1] + hex[1];
        g = '0x' + hex[2] + hex[2];
        b = '0x' + hex[3] + hex[3];
    } else if (hex.length === 7) {
        r = '0x' + hex[1] + hex[2];
        g = '0x' + hex[3] + hex[4];
        b = '0x' + hex[5] + hex[6];
    }
    r /= 255; g /= 255; b /= 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 60)       { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else              { r = c; g = 0; b = x; }

    const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getAdjustedHSL() {
    const base = hexToHSL(baseColorInput.value);
    let h = (base.h + parseInt(hueAdjInput.value)) % 360;
    if (h < 0) h += 360;
    const s = Math.max(0, Math.min(100, base.s + parseInt(satAdjInput.value)));
    return { h, s };
}

function showToast(message) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function copyToClipboard(text, message = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => showToast(message));
}

function generateSVG() {
    const rectWidth = 100;
    const rectHeight = 100;
    const gap = 16;
    const totalWidth = rectWidth * scaleSteps.length + gap * (scaleSteps.length - 1);
    const { h, s } = getAdjustedHSL();

    let svg = `<svg width="${totalWidth}" height="${rectHeight}" viewBox="0 0 ${totalWidth} ${rectHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">\n`;

    scaleSteps.forEach((step, i) => {
        const x = i * (rectWidth + gap);
        const hex = hslToHex(h, s, step.l);
        const textColor = step.l < 55 ? '#ffffff' : '#0f172a';

        svg += `  <g id="Swatch-${step.name}" transform="translate(${x}, 0)">\n`;
        svg += `    <rect width="${rectWidth}" height="${rectHeight}" rx="12" fill="${hex}" />\n`;
        svg += `    <text x="50" y="45" fill="${textColor}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">${step.name}</text>\n`;
        svg += `    <text x="50" y="65" fill="${textColor}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" opacity="0.8" text-anchor="middle">${hex.toUpperCase()}</text>\n`;
        svg += `  </g>\n`;
    });

    svg += `</svg>`;
    return svg;
}

function downloadSVG() {
    const svg = generateSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${baseColorInput.value.substring(1)}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('SVG file downloaded!');
}

function generatePalette() {
    swatchContainer.innerHTML = '';
    const { h, s } = getAdjustedHSL();
    const hueAdj = parseInt(hueAdjInput.value);
    const satAdj = parseInt(satAdjInput.value);

    hueValDisplay.innerText = hueAdj > 0 ? `+${hueAdj}°` : `${hueAdj}°`;
    satValDisplay.innerText = satAdj > 0 ? `+${satAdj}%` : `${satAdj}%`;

    scaleSteps.forEach(step => {
        const hex = hslToHex(h, s, step.l);
        const textColor = step.l < 55 ? '#ffffff' : '#0f172a';

        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = hex;
        swatch.style.color = textColor;
        swatch.onclick = () => copyToClipboard(hex);
        swatch.innerHTML = `<div class="swatch-name">${step.name}</div><div class="swatch-hex">${hex}</div>`;

        swatchContainer.appendChild(swatch);
    });
}

copySvgBtn.addEventListener('click', () => copyToClipboard(generateSVG(), 'SVG palette copied for Figma!'));
downloadSvgBtn.addEventListener('click', downloadSVG);
baseColorInput.addEventListener('input', generatePalette);
hueAdjInput.addEventListener('input', generatePalette);
satAdjInput.addEventListener('input', generatePalette);

generatePalette();
