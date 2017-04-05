# Documentation

**Documentation is outdated and still a work in progress. This is expected to be finished by release v2.1.0**

Every call to any `fritz` function should include the `options` object. The domain (or IP address) can differ with your local network setup. If your Fritz!Box does not require a username while logging in, you can simply leave that field blank.
```js
{
  username: '',
  password: '',
  server: 'fritz.box',
  protocol: 'https'
}
```

All functions of the FritzBox.js API are ES7 [async/await](https://davidwalsh.name/async-generators#es7-async) Promise-based.

```js
async function main() {
  const result = await fritz.functionName(parameter1, parameter2, ...)

  if (result.error) {
    // deal with the error object.
    return console.log(result.error.message)
  }

  // deal with the result object.
  // ...
}
main()
```

## Available functions

| *function name*                          | *description*                            |
| ---------------------------------------- | ---------------------------------------- |
| **General**                       |                                          |
| fritz.getSessionId(*options*)            | Get a session id to work with.           |
| ~~fritz.validateSessionId(*sid*)~~           | Check if a session id is still valid.    |
| fritz.getSystemEventLog(*options*)       | Get the full system event log.           |
|||
| **Telephony**                            |                                          |
| fritz.getCalls(*options*)                | Get a list of the full call history.     |
| fritz.getTamMessages(*options*)          | Get a list of all new TAM messages.      |
| fritz.downloadTamMessage(*path*, *localPath*, *options*) | Download the audio file of a TAM message. |
| fritz.markTamMessageAsRead(*messageId*, *options*, *tamId=0*) | Mark a new TAM message as read.          |
| fritz.dialNumber(*phoneNumber*, *options*) | Dial a number.                           |
|||
| **Phonebooks & Contacts** | |
| fritz.getPhonebook(*phonebookId=0*, *options*) | Get all contacts in the given phonebook. |
| ~~fritz.uploadPhonebook(*phonebookId*, *options*)~~ | Upload contacts to a new or existing phonebook. |
| ~~fritz.getContactDetails(*phonebookId*, *contactId*, *options*)~~ | Get the full details of a contact. |
| ~~fritz.addContact(*phonebookId*, *contactObject*, *options*)~~ | Add a new contact to a phonebook. |
| ~~fritz.editContact(*phonebookId*, *contactId*, *contactObject*, *options*)~~ | Edit an existing contact. |
| ~~fritz.removeContact(*phonebookId*, *contactId*, *options*)~~ | Remove an existing contact from the phonebook. |
|||
| **DECT Smart Home Devices**              |                                          |
| fritz.getSmartDevices(*options*)         | Get a list of all registered smart devices. |
| fritz.toggleSwitch(*deviceId*, *value*, *options*) | Toggle a DECT switch on or off.          |
|                                          |                                          |

---

## fritz.getSessionId(*options*)
Get a session ID (`sid`) in exchange for the login credentials. The `sid` is always a 16 character-long string.

All functions in FritzBox.js utilize this function if no `options.sid` value is manually set.

---

## fritz.getCalls(*options*)
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

## fritz.getTamMessages(*options*)
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
    "isNewMessage": true
  },
  { ... }
]
```

## fritz.downloadTamMessage(*path*, *localPath*, *options*)
Download a Telephone Answering Machine (TAM) message in `.wav` format to disk. The `path` variable must
be obtained using the `fritz.getTamMessages()` function. `localPath` can be something like `./my_tam.wav`.

## fritz.markTamMessageAsRead(*messageId*, *options*, *tamId=0*)
Mark a Telephone Answering Machine (TAM) message as read (or heard). The default `tamId` is `0`.

## fritz.dialNumber(*phoneNumber*, *options*)
Dial a number. Once the other party picks up the phone, your preconfigured handset will start ringing.
Requires you to set up *Click to Dial* in the Fritz!Box (can be found under `Telephony > Calls`).

## fritz.getPhonebook(*phonebookId=0*, *options*)
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

---

## fritz.getSmartDevices(*options*)
Get all DECT Smart Home devices registered on the network. Function returns an array of objects containing found devices and groups.

*The objects returned by the API are currently very messy.*

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

## fritz.toggleSwitch(*deviceId*, *value*, *options*)
Toggle a DECT Smart Home switch's state. The `id` of the device will remain the same
until it is de-registered with the Fritz!Box, and can be found using `fritz.getSmartDevices()`.
Either `1` or `0` must be set as a `value`.

---
