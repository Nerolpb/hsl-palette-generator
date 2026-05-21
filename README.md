# HSL Palette Generator

A lightweight, zero-dependency tool to generate Tailwind-style color scales (50–950) from any base color.

## Features

- Pick any base color and instantly generate an 11-step HSL scale
- Fine-tune hue and saturation with sliders
- Click any swatch to copy its hex code
- Export the palette as SVG — ready to paste directly into Figma

## Usage

Just open `generateur_palette_couleur.html` in your browser. No build step, no dependencies.

Or use it live via :

## How it works

The generator takes your base color, converts it to HSL, and applies fixed lightness values (95% → 6%) across the scale while preserving your chosen hue and saturation. Hue and saturation adjustments let you shift the tone across the whole scale at once.

## Export

- **Copy SVG (Figma)** — copies an SVG to your clipboard that you can paste directly into a Figma frame as individual named swatches
- **Download SVG** — saves the palette as a `.svg` file named after the base hex