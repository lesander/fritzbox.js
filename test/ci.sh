#/usr/bin/env/sh
set -e
pwd

# Check for runtime errors.
echo "[*] Checking index.js for runtime errors."
node index.js

# Test some features.
node test/login.js
node test/calls.js
node test/smartdevices.js
node test/tam.js
node test/phonebook.js

echo "[*] Finished with tests"
