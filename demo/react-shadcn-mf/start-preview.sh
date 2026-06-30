#!/bin/bash
# Start all 4 preview servers for the micro-frontend demo
# Usage: ./start-preview.sh
# Then run tests: URL=http://localhost:5174/ node ../../../_test/test.mjs

BASE="$(cd "$(dirname "$0")" && pwd)"

echo "Building remotes..."
(cd "$BASE/level1" && npm run build) &
(cd "$BASE/level2" && npm run build) &
(cd "$BASE/level3" && npm run build) &
wait

# Workaround for vite-plugin-federation 1.4.x bug: dynamicLoadingCss receives a
# string but calls .forEach on it. Wrap the string in an array after each build.
# Note: uses macOS sed (-i ''). On Linux use: sed -i "s/.../.../g" "$FILE"
echo "Patching remoteEntry.js (workaround for vite-plugin-federation 1.4.x CSS bug)..."
for dir in level1 level2 level3; do
  FILE="$BASE/$dir/dist/assets/remoteEntry.js"
  [ -f "$FILE" ] && sed -i '' "s/a(\`__v__css__\([^,]*\)\`,/a([\`__v__css__\1\`],/g" "$FILE"
done

echo "Building shell..."
(cd "$BASE/shell" && npm run build)

echo "Starting preview servers..."
(cd "$BASE/level1" && npm run preview) &
(cd "$BASE/level2" && npm run preview) &
(cd "$BASE/level3" && npm run preview) &
(cd "$BASE/shell"  && npm run preview) &

echo ""
echo "  Shell:  http://localhost:5174"
echo "  Level1: http://localhost:5175"
echo "  Level2: http://localhost:5176"
echo "  Level3: http://localhost:5177"
echo ""
echo "Press Ctrl+C to stop all servers."
wait
