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
./node_modules/standard/bin/cmd.js
echo ' ✓ Code is complaint with StandardJS.'

# Run documentation.js linter
./node_modules/documentation/bin/documentation.js lint src/**
echo ' ✓ Code documentation is complaint with JSDoc.'

# Test some features.
echo '   Running test scripts..'
node $flags test/version.js
node $flags test/login.js
node $flags test/calls.js
node $flags test/smartdevices.js
node $flags test/tam.js
node $flags test/phonebook.js

node $flags test/activecalls.js
#node $flags test/dial.js 550@hd-telefonie.avm.de
#node $flags test/markread.js
#node $flags test/tamdownload.js
#node $flags test/toggleswitch.js

echo " ✓ Finished with tests."
