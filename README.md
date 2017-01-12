# FritzBox.js
[![GitHub release](https://img.shields.io/github/release/lesander/fritzbox.js.svg?maxAge=2592000&cache=plz)]()
[![Code Climate](https://codeclimate.com/github/lesander/fritzbox.js/badges/gpa.svg)](https://codeclimate.com/github/lesander/fritzbox.js)
[![BCH compliance](https://bettercodehub.com/edge/badge/lesander/fritzbox.js?cache=ugh)](https://bettercodehub.com)
[![Build Status](https://travis-ci.org/lesander/fritzbox.js.svg?branch=master&cache=pls)](https://travis-ci.org/lesander/fritzbox.js)


The most powerful, simple and complete AVM Fritz!Box API in Node.js

### Getting Started
This module is written in ECMAscript 2015 [ES6](https://github.com/mjavascript/practical-es6), and thus you should use the latest version (`^7.0.0`) of NodeJS.
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
  protocol: 'http' }

fritz.getCalls(options)
.then((callHistory) => {
  console.log(callHistory)
})
.catch((error) => {
  console.log(error)
})

```

### Documentation

*Full documentation coming soon..*


### Contributing
If you'd like to contribute to FritzBox.js, or file a bug or feature request,
please head over to [the issue tracker](/issues) or [open a pull request](/pulls).


### License
This software is open-sourced under the MIT License ([see the LICENSE file for
the full license](/LICENSE)). So within some limits, you can do with the code whatever
you want. However, if you like and/or want to re-use it, I'd really appreciate
a reference to this project page.

The software is provided as is. It might work as expected - or not.
Just don't blame me.
