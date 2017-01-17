# FritzBox.js
[![GitHub release](https://img.shields.io/github/release/lesander/fritzbox.js.svg?maxAge=1)]()
[![Completion Status](https://img.shields.io/badge/completion-45%25-yellowgreen.svg)]()
[![Build Status](https://travis-ci.org/lesander/fritzbox.js.svg?branch=master&cache=pls)](https://travis-ci.org/lesander/fritzbox.js)

[![npm](https://img.shields.io/npm/dt/fritzbox.js.svg?maxAge=1)]()

[![Code Climate](https://codeclimate.com/github/lesander/fritzbox.js/badges/gpa.svg)](https://codeclimate.com/github/lesander/fritzbox.js)
[![BCH compliance](https://bettercodehub.com/edge/badge/lesander/fritzbox.js?maxAge=-1)](https://bettercodehub.com)



The most powerful, simple and complete AVM Fritz!Box API. **This project is still a work in progress.** Written in Node.js

## Getting Started
This module is written in ECMAscript 2015 [ES6](https://github.com/mjavascript/practical-es6) and is promise-based. You should use the latest version (`^7.0.0`) of NodeJS.

This package was tested on Fritz!Box 7390 and 7490 with firmware versions `6.53` and `6.51`.
```
npm install fritzbox.js
```

A simple example showing how to get the history of calls made with a [Fritz!Fon](https://en.avm.de/products/fritzfon) can be seen below.

```js
const fritz = require('fritzbox.js')
const options = {
  username: 'xxx',
  password: 'xxx',
  server: 'fritz.box',
  protocol: 'https' }

fritz.getCalls(options)
.then((callHistory) => {
  console.log(callHistory)
})
.catch((error) => {
  console.log(error)
})

```

## Documentation
Want to get started with FritzBox.js? Cool! The API is
[documented and available here](/DOCS.md), and you can
[see some examples](/test) in the `test/` folder.

## Contributing
If you'd like to contribute to FritzBox.js, or file a bug or feature request,
please head over to [the issue tracker](/issues) or [open a pull request](/pulls).


## License
This software is open-sourced under the MIT License ([see the LICENSE file for
the full license](/LICENSE)). So within some limits, you can do with the code whatever
you want. However, if you like and/or want to re-use it, I'd really appreciate
a reference to this project page.

The software is provided as is. It might work as expected - or not.
Just don't blame me.
