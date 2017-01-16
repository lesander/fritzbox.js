# FritzBox.js
[![GitHub release](https://img.shields.io/github/release/lesander/fritzbox.js.svg?maxAge=1&cache=plz)]()
[![Code Climate](https://codeclimate.com/github/lesander/fritzbox.js/badges/gpa.svg)](https://codeclimate.com/github/lesander/fritzbox.js)
[![BCH compliance](https://bettercodehub.com/edge/badge/lesander/fritzbox.js?cache=ugh)](https://bettercodehub.com)
[![Build Status](https://travis-ci.org/lesander/fritzbox.js.svg?branch=master&cache=pls)](https://travis-ci.org/lesander/fritzbox.js)


The most powerful, simple and complete AVM Fritz!Box API in Node.js

## Getting Started
This module is written in ECMAscript 2015 [ES6](https://github.com/mjavascript/practical-es6) and is promise-based. You should use the latest version (`^7.0.0`) of NodeJS.

This package was tested on Fritz!Box 7390 and 7490 with firmware version `6.53`.
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

Every call to a `fritz` function should include the `options` object. The domain (or IP address) can differ with your local network setup. If your Fritz!Box does not require a username while logging in, you can simply leave that field blank.
```js
{
  username: '',
  password: '',
  server: 'fritz.box',
  protocol: 'https'
}
```

All functions of the FritzBox.js API are [Promise]()-based.
```js
fritz.functionName(parameter1, parameter2, ...)
.then((result) => {
  // do something with the result.
})
.catch((error) => {
  // do something with the error.
})
```

### fritz.getSessionId(*options*)
Get a session ID (`sid`) in exchange for the login credentials. The `sid` is always a 16 character-long string.

All functions in FritzBox.js utilize this function if no `options.sid` value is manually set.


### fritz.getCalls(*options*)
Get the full history of all calls made or received in the network. The returned value is an array containing objects.
```json
[
  {
    "type": "incoming/outgoing/unknown/missed",
    "date": "Fri Feb 13 2017 13:37:00 GMT+0100 (CET)",
    "name": "Name found in Phonebook / Empty",
    "duration": "h:mm",
    "number": "0612345678",
    "numberSelf": "0201234567",
    "extension": "Answering Machine / Fritz!Fon Name / Empty"
  },
  { ... }
]
```

### fritz.getSmartDevices(*options*)
Get all DECT Smart Home devices registered on the network. Function returns an array of objects containing found devices and groups.

*The objects returned by the Fritz!Box are very messy.*

```json
[
  {
    "PollTimeout": 420,
    "pv_max": -1,
    "FunctionBitMask": 640,
    "DeviceType": 9,
    "GroupHash": "2141019559",
    "ID": 18,
    "Manufacturer": "AVM",
    "Valid": 1,
    "Identifyer": "08761 0177877",
    "temperature": -9999,
    "ProductName": "FRITZ!DECT 200",
    "pv_now": -1,
    "pv_min": -1,
    "switch": {
      "LEDState": 65535,
      "Options": 65535,
      "Devicetype": 9,
      "ID": 18,
      "SwitchOn": 0,
      "SwitchLock": 65535
    },
    "LastValidChangeTime": 1484165847,
    "UpdatePresent": 0,
    "Name": "Christmas Tree",
    "SortIndex": 5,
    "FWVersion": "03.59",
    "PollInterval": 120,
    "SubModel": "0x0002",
    "Model": "0x0007"
  },
  { ... }
]
```

### fritz.toggleSwitch(*deviceId*, *value*, *options*)
Toggle a DECT Smart Home switch's state. The `id` of the device will remain the same
until it is de-registered with the Fritz!Box, and can be found using `fritz.getSmartDevices()`.
Either `1` or `0` must be set as a `value`.

### fritz.getTamMessages(*options*)
Get all Telephone Answering Machine (TAM) messages. Function returns an array of objects.

```json
[
  {
    "tamId": 0,
    "messageId": 14,
    "date": "Wed Feb 15 2017 19:09:00 GMT+0100 (CET)",
    "name": "Name found in Phonebook / Empty",
    "duration": "0:01",
    "number": "0612345678",
    "numberSelf": "0201234567",
    "path": "/data/tam/rec/rec.0.014",
    "inPhonebook": true,
    "new": true
  },
  { ... }
]
```

### fritz.downloadTamMessage(*path*, *localPath*, *options*)
Download a Telephone Answering Machine (TAM) message in `.wav` format to disk. The `path` variable must
be obtained using the `fritz.getTamMessages()` function. `localPath` can be something like `./my_tam.wav`.

### fritz.markTamMessageAsRead(*messageId*, *options*, *tamId=0*)
Mark a Telephone Answering Machine (TAM) message as read (or heard). The default `tamId` is `0`.

### fritz.dialNumber(*phoneNumber*, *options*)
Dial a number. Once the other party picks up the phone, your preconfigured handset will start ringing.
Requires you to set up *Click to Dial* in the Fritz!Box (can be found under `Telephony > Calls`).

### fritz.getPhonebook(*phonebookId=0*, *options*)
Download all contacts in the given phonebook. Default `phonebookId` is `0`.
Result returns an array of objects.
```json
[
  {
    "uniqueId": "13",
    "name": "John Doe",
    "numbers": [
      {
        "number": "0612345678",
        "type": "mobile",
        "priority": "1"
      },
      {
        "number": "0201234567",
        "type": "home",
        "priority": "0"
      }
    ],
    "category": "1",
    "email": "example@domain.com",
    "lastModified": "1484585116",
    "ringtone": "19"
  },
  { ... }
]
```

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
