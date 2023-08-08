# NeoFritzBox.js
[![GitHub release](https://img.shields.io/github/release/lesander/fritzbox.js.svg?maxAge=1)]()
[![Completion Status](https://img.shields.io/badge/completion-70%25-green.svg)]()
[![Build Status](https://travis-ci.org/lesander/fritzbox.js.svg?branch=master&cache=pls)](https://travis-ci.org/lesander/fritzbox.js)
[![npm](https://img.shields.io/npm/dt/fritzbox.js.svg?maxAge=1)]()
[![Code Climate](https://codeclimate.com/github/lesander/fritzbox.js/badges/gpa.svg)](https://codeclimate.com/github/lesander/fritzbox.js)
[![BCH compliance](https://bettercodehub.com/edge/badge/lesander/fritzbox.js?maxAge=-1)](https://bettercodehub.com)

The most powerful, simple and complete [AVM](https://avm.de) Fritz!Box [API](https://avm.de/Schnittstellen).

**This project is a fork of [fritzbox.js](https://github.com/lesander/fritzbox.js) is mostly a refactoring excerise. But it already welcomes some new changes**

## Getting Started
This module is future-proof and uses async/await promises.

This means that you need to run NodeJS version `7.6.0` or newer. If your NodeJS version is between `7.0.0` and `7.5.0` you can use the harmony flag `--harmony-async-await` to make use of the async/await promises.

This package was tested on Fritz!Box 7520, with firmware versions `7.50`.

## Installing

```
npm install neofritzbox.js
```

## Usage

A simple example showing how to get the history of calls made with a [Fritz!Fon](https://en.avm.de/products/fritzfon) can be seen below.

```js
const fritz = require('fritzbox.js')
const options = {
  username: 'xxx',
  password: 'xxx',
  server: 'fritz.box',
  protocol: 'https' }

;(async () => {

  const calls = await fritz.getCalls(options)
  if (calls.error) return console.log('Error: ' + calls.error.message)
  console.log('Got ' + calls.length + 'calls.')

})()
```

To minimize overhead and limit login requests made to the Fritz!Box it is recommended to store the SID once one has been obtained using [`fritz.getSessionId`](https://fritzbox.js.org/api/#fritzLogin.getSessionId).

## Documentation
The only available documentation is from the base repository and does not include any additional feature that have been implemented see [fritzbox.js documentation](https://fritzbox.js.org/api).

Tests for new features have been written and you can [see some examples](/test) in the `test/` folder.

## Contributing
If you'd like to contribute to NeoFritzBox.js, or file a bug or feature request,
please head over to [the issue tracker](/issues) or [open a pull request](/pulls).

## License
This software is open-sourced under the MIT License ([see the LICENSE file for
the full license](/LICENSE)).

You are required to include a copy of this project's license and copyright notice in your modified or distributed version of FritzBox.js
