# mute-color

Takes a color that's meant to stand out against your editor's background and
makes it shy. Used in [literate-theme](https://github.com/rileyjshaw/literate-theme).

## Installation

```sh
npm i -S mute-color
```

## Usage

Pass a hand-picked muted color into the module. A function is returned that
brings other colors to the same level of muted-ness.

```js
const mutedColor = '#a8b8b8';
const toMuted = require('mute-color')(mutedColor);
toMuted('#aabbcc');  // "#a6b0ba"
```

## License
[MIT](./LICENSE)
