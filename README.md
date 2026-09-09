# Chess.com Rating and Results Hider

Hides ratings, results and stats on chess.com so you can play without
watching your Elo.

## Install

- Chrome: [Chrome Web Store](https://chromewebstore.google.com/detail/bdhedpdfafpkhjiodiobddcngokkgemn)
- Firefox and Firefox for Android: addons.mozilla.org (pending review)

## Options

Three switches on the options page, for ratings, results and stats. All on by
default. Reload any open chess.com tabs after changing them.

## Build

```sh
./build.sh
```

Writes `dist/firefox-<version>.zip` and `dist/chrome-<version>.zip`. No build
tools and nothing minified, it just copies the files and zips them. The Chrome
manifest is the same file with `browser_specific_settings` removed, because the
Chrome Web Store rejects that key and Firefox needs it.

To release, bump `version` in `manifest.json`, run the script, upload each zip.

## License

[MPL-2.0](LICENSE)
