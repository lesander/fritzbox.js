#/usr/bin/env/sh
set -e

# Check for runtime errors.
echo "[*] Checking index.js for runtime errors."
node index.js

# No automated tests for testfiles exist yet.

echo "[*] Finished with tests"
