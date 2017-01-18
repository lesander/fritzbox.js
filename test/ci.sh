#/usr/bin/env/sh
set -e
pwd

# Check for runtime errors.
echo '   Checking index.js for runtime errors..'
node index.js
echo ' ✓ No syntax errors found.'

# Test some features.
echo '   Running test scripts..'
node test/login.js
node test/calls.js
node test/smartdevices.js
node test/tam.js
node test/phonebook.js

echo " ✓ Finished with tests."
