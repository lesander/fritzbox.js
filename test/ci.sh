#/usr/bin/env/sh
set -e
pwd

# Get Node version
version=$(node -v)
versionNumber=$(echo $version | tr -d '.' | tr -d 'v')

if (( $versionNumber < 700 )); then
  echo ' NodeJS version is not supported (<7.0.0)'
  exit 1
fi

if (( $versionNumber >= 700 && $versionNumber < 760 )); then
  flags='--harmony-async-await'
else
  flags=''
fi

echo '  FritzBox.js CI Test (Node '$version')'

# Check for runtime errors.
node $flags index.js
echo ' ✓ No syntax errors found.'

# Run StandardJS linter
standard
echo ' ✓ Code is complaint with StandardJS.'

# Run documentation.js linter
documentation lint src/**
echo ' ✓ Code documentation is complaint with JSDoc.'

# Test some features.
echo '   Running test scripts..'
node $flags test/version.js      # async ready
node $flags test/login.js        # async ready
node $flags test/calls.js        # async ready
node $flags test/smartdevices.js # async ready
node $flags test/tam.js          # async ready
node $flags test/phonebook.js    # async ready

node $flags test/activecalls.js  # async ready
#node $flags test/dial.js        # async ready
node $flags test/markread.js     # async ready
node $flags test/tamdownload.js  # async ready
node $flags test/toggleswitch.js # async ready

echo " ✓ Finished with tests."
