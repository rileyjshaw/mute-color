/**
 * Takes a color that's meant to stand out against your editor's background and
 * makes it shy.
 *
 * Usage:
 *
 * const foreground = '#a8b8b8';
 * const toMuted = require('mute-color')(foreground);
 * toMuted('#aabbcc');  // "#a6b0ba"
 *
 *
 * @param  {string} fg   Your hand-picked muted `foreground` value.
 * @return {function}    Curry. Mmm...
 */
module.exports = function muteColor (fg) {
	// Extract `fg`'s "lightness". We'll set the lightness of all returned
	// colors to this.
	const [r, g, b] = normalize(fg);
	const l = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;

	/**
	 * Takes an input color, matches its lightness to `fg`, and reduces its
	 * saturation. Maintains hue.
	 *
	 * @param  {string} hex   Original color in the form #aabbcc.
	 * @return {string}       "Muted" (desaturated/dark) color in the form
	 *                            #aabbcc.
	 */
	return function toMuted (hex) {
		const [h, s] = toHueAndSaturation(...normalize(hex));
		// Reduce the original saturation but keep hue unchanged.
		return toHex(h, s / 2, l);
	};
}

  //////////////////////////////////////
 // Util functions from here on out. //
//////////////////////////////////////

/**
 * Normalizes a 6-digit hex string.
 *
 * @param  {string} hex   Hex string in the form #aabbcc.
 * @return {float[]}      Array containing RGB components. Range: [0, 1].
 */
function normalize (hex) {
	return /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
		.exec(hex)
		.slice(1)
		.map(n => parseInt(n, 16) / 255)
		;
}

/**
 * Extract the hue and saturation from an array of normalized RGB values.
 *
 * @param  {float} r   Range: [0, 1].
 * @param  {float} g   Range: [0, 1].
 * @param  {float} b   Range: [0, 1].
 * @return {float[]}   Hue and saturation values. Range: [0, 1].
 */
function toHueAndSaturation (r, g, b) {
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	const diff = max - min;
	// Exit early if achromatic.
	if (!diff) {return [0, 0];}

	const saturation = diff / (1 - Math.abs(max + min - 1));

	let hue;
	switch (max) {
		case r: hue = (g - b) / diff + (g < b ? 6 : 0);
		break;
		case g: hue = (b - r) / diff + 2;
		break;
		case b: hue = (r - g) / diff + 4;
		break;
	}
	return [hue / 6, saturation];
}

/**
 * Transforms normalized HSL color components into a CSS hex string.
 * Mostly dark magic.
 *
 * @param  {float} h   Range: [0, 1].
 * @param  {float} s   Range: [0, 1].
 * @param  {float} l   Range: [0, 1].
 * @return {string}    Equivalent color in the form #aabbcc.
 */
function toHex (h, s, l) {
	function hueToRgb (p, q, t) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1/6) return p + (q - p) * 6 * t;
		if (t < 1/2) return q;
		if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	}

	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;

	const r = hueToRgb(p, q, h + 1/3);
	const g = hueToRgb(p, q, h);
	const b = hueToRgb(p, q, h - 1/3);

	return '#' + [r, g, b].map(
		c => (Math.round(c * 255).toString(16) + '0').slice(0, 2)).join('');
}
