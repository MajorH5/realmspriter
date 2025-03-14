export const hexToRGB = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    return { r, g, b }
};

export const RGBtohex = ({ r, g, b }: { r: number, b: number, g: number }) => {
    const toHex = (c: number) => {
        const hex = Math.round(c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const upscale = (pixels: Uint8ClampedArray, width: number, height: number, scale: number): Uint8ClampedArray => {
    // calculate new size for the final image
    const newWidth = width * scale;
    const newHeight = height * scale;

    // store pixels for the new upscaled image
    const resultPixels = new Uint8ClampedArray(newWidth * newHeight * 4).fill(0);

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const sourceX = Math.floor(x / scale);
            const sourceY = Math.floor(y / scale);

            const sourceIndex = (sourceY * width + sourceX) * 4;
            const destinationIndex = (y * newWidth + x) * 4;

            for (let channel = 0; channel < 4; channel++) {
                resultPixels[destinationIndex + channel] = pixels[sourceIndex + channel];
            }
        }
    }

    return resultPixels;
};

export const outline = (pixels: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
    // copy pixels
    pixels = new Uint8ClampedArray(pixels);

    const outline = new Set();

    function getIndex(x: number, y: number) {
        return (y * width + x) * 4;
    }

    function isTransparent(x: number, y: number) {
        if (x < 0 || y < 0 || x >= width || y >= height) return true; // Handling out of bounds
        const index = getIndex(x, y);
        return pixels[index + 3] === 0;
    }

    function applyOutline(x: number, y: number) {
        const index = getIndex(x, y);
        pixels[index] = 0; // R
        pixels[index + 1] = 0; // G
        pixels[index + 2] = 0; // B
        pixels[index + 3] = 255; // A
        outline.add(`${x},${y}`);

    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (isTransparent(x, y)) {
                continue;
            }

            if (outline.has(`${x},${y}`)) {
                continue;
            }

            if (isTransparent(x, y - 1)) applyOutline(x, y - 1); // Top
            if (isTransparent(x - 1, y)) applyOutline(x - 1, y); // Left
            if (isTransparent(x + 1, y)) applyOutline(x + 1, y); // Right
            if (isTransparent(x, y + 1)) applyOutline(x, y + 1); // Down
            if (isTransparent(x - 1, y - 1)) applyOutline(x - 1, y - 1); // Top-left
            if (isTransparent(x + 1, y - 1)) applyOutline(x + 1, y - 1); // Top-right
            if (isTransparent(x - 1, y + 1)) applyOutline(x - 1, y + 1); // Bottom-left
            if (isTransparent(x + 1, y + 1)) applyOutline(x + 1, y + 1); // Bottom-right
        }
    }

    return pixels;
}

export const RotMGify = (pixels: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
    // add two pixels of padding to the image
    let newWidth = width + 2, newHeight = height + 2;
    let resultPixels = new Uint8ClampedArray(newWidth * newHeight * 4).fill(0) as Uint8ClampedArray; // ???

    // copy the original pixels to the new array
    // and move them to the right and down by one pixel
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sourceIndex = (y * width + x) * 4;
            const destinationIndex = ((y + 1) * newWidth + (x + 1)) * 4;

            for (let channel = 0; channel < 4; channel++) {
                resultPixels[destinationIndex + channel] = pixels[sourceIndex + channel];
            }
        }
    }

    // now we can upscale the image by 5x
    resultPixels = upscale(resultPixels, newWidth, newHeight, 5);

    // apply the black outline
    resultPixels = outline(resultPixels, newWidth * 5, newHeight * 5);

    return resultPixels;
};

export const normalizeMousePosition = (
    x: number,
    y: number,
    canvas: HTMLCanvasElement
): [number, number] => {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (x - rect.left) * scaleX;
    const mouseY = (y - rect.top) * scaleY;

    return [mouseX, mouseY];
};

export const mapRange = (value: number, low1: number, high1: number, low2: number, high2: number): number => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

export const hslToHex = (h: number, s: number, l: number): string => {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number, l: number = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                h = 0;
        }

        h /= 6;
    }

    return [h, s, l];
};
