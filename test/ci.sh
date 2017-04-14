#/usr/bin/env/sh
set -e
pwd

echo '  FritzBox.js CI Test'

# Check for runtime errors.
node --harmony-async-await index.js
echo ' ✓ No syntax errors found.'

# Run StandardJS linter
standard
echo ' ✓ Code is complaint with StandardJS.'

# Run documentation.js linter
documentation lint src/**
echo ' ✓ Code documentation is complaint with JSDoc.'

# Test some features.
echo '   Running test scripts..'
node --harmony-async-await test/version.js      # async ready
node --harmony-async-await test/login.js        # async ready
node --harmony-async-await test/calls.js        # async ready
node --harmony-async-await test/smartdevices.js # async ready
node --harmony-async-await test/tam.js          # async ready
node --harmony-async-await test/phonebook.js    # async ready

node --harmony-async-await test/activecalls.js  # async ready
#node --harmony-async-await test/dial.js         # async ready
node --harmony-async-await test/markread.js     # async ready
node --harmony-async-await test/tamdownload.js  # async ready
node --harmony-async-await test/toggleswitch.js # async ready

echo " ✓ Finished with tests."
