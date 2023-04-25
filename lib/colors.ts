/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore

// thanks to https://github.com/javisperez/tailwindcolorshades

import colorNamer from "color-namer";

export type Palette = {
    name: string;
    colors: {
        [key: number]: string;
    };
};

type Rgb = {
    r: number;
    g: number;
    b: number;
};

function hexToRgb(hex: string): Rgb | null {
    const sanitizedHex = hex.replaceAll("##", "#");
    const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        sanitizedHex
    );

    if (!colorParts) {
        return null;
    }

    const [, r, g, b] = colorParts;

    return {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16)
    } as Rgb;
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getTextColor(color: string): "#FFF" | "#333" {
    const rgbColor = hexToRgb(color);

    if (!rgbColor) {
        return "#333";
    }

    const { r, g, b } = rgbColor;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luma < 120 ? "#FFF" : "#333";
}

function lighten(hex: string, intensity: number): string {
    const color = hexToRgb(`#${hex}`);

    if (!color) {
        return "";
    }

    const r = Math.round(color.r + (255 - color.r) * intensity);
    const g = Math.round(color.g + (255 - color.g) * intensity);
    const b = Math.round(color.b + (255 - color.b) * intensity);

    return rgbToHex(r, g, b);
}

function darken(hex: string, intensity: number): string {
    const color = hexToRgb(hex);

    if (!color) {
        return "";
    }

    const r = Math.round(color.r * intensity);
    const g = Math.round(color.g * intensity);
    const b = Math.round(color.b * intensity);

    return rgbToHex(r, g, b);
}

export function getColorName(color: string): string {
    const { name } = colorNamer(`#${color}`.replace("##", "#")).ntc[0];
    const sanitizedName = name
        .replace(/['/]/gi, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

    return sanitizedName;
}

export function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "" + h + " " + s + "% " + l + "%";
}

export function generatePalette(baseColor: string): Palette {
    const name = getColorName(baseColor);

    const response: Palette = {
        name,
        colors: {
            500: `#${baseColor}`.replace("##", "#")
        }
    };

    const intensityMap: {
        [key: number]: number;
    } = {
        50: 0.95,
        100: 0.9,
        200: 0.75,
        300: 0.6,
        400: 0.3,
        600: 0.9,
        700: 0.75,
        800: 0.6,
        900: 0.49
    };

    [50, 100, 200, 300, 400].forEach(level => {
        response.colors[level] = lighten(baseColor, intensityMap[level]);
    });

    [600, 700, 800, 900].forEach(level => {
        response.colors[level] = darken(baseColor, intensityMap[level]);
    });

    return response as Palette;
}
