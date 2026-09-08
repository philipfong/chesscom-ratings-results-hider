#!/usr/bin/env bash
# Builds the store packages into dist/.
#
# Chrome and Firefox need different packages. The Chrome Web Store validator
# rejects "browser_specific_settings", but Firefox needs that key for the
# extension ID, the data collection declaration, and Android compatibility.
# So the Chrome manifest is this manifest with that one key removed.
set -euo pipefail

cd "$(dirname "$0")"

version=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")
shared_files="content.js options.html options.js icons"

rm -rf dist
mkdir -p dist/firefox dist/chrome

cp -R $shared_files dist/firefox/
cp -R $shared_files dist/chrome/

cp manifest.json dist/firefox/manifest.json

python3 - <<'PY'
import json

with open('manifest.json') as f:
    manifest = json.load(f)

del manifest['browser_specific_settings']

with open('dist/chrome/manifest.json', 'w') as f:
    json.dump(manifest, f, indent=2)
    f.write('\n')
PY

(cd dist/firefox && zip -r -q -X "../firefox-$version.zip" .)
(cd dist/chrome && zip -r -q -X "../chrome-$version.zip" .)

rm -rf dist/firefox dist/chrome

echo "Built:"
echo "  dist/firefox-$version.zip  -> addons.mozilla.org"
echo "  dist/chrome-$version.zip   -> Chrome Web Store"
