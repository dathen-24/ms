# get-buffer

[![Build Status](https://travis-ci.org/emilsivervik/get-buffer.svg?branch=master)](https://travis-ci.org/emilsivervik/get-buffer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
## Install
```
§ npm install get-buffer
```

## Usage

``` js
const getBuffer = require('get-buffer');
const fs = require('fs');
const stream = fs.createReadStream('./test.png');

getBuffer.fromStream(stream, 4100)
.then(buffer => console.log(buffer))
.catch(err => console.error(err))

try{
    const buffer = getBuffer.fromPath('./test.png', 4100);
    console.log(buffer)
}catch(err){
    console.error(err);
}
```

## API

###### fromStream(stream: `Readable`, callback: `function`)
###### fromStream(stream: `Readable`, bufferSize: `int`, callback: `function`)
Reads a `Buffer` from a `Readable`, `bufferSize` could be provided to limit the Buffer into a maximum size. Returns either a `Promise` or a `function`(callback).

###### fromPath(filePath: `string`)
###### fromPath(filePath: `string`, bufferSize: `int`)
Reads a `Buffer` from a path, `bufferSize` could be provided to limit the Buffer into a maximum size. Returns synchronously.

###### fromArrayBuffer(arrayBuffer: `ArrayBuffer`)
###### fromArrayBuffer(arrayBuffer: `ArrayBuffer`, bufferSize: `int`)
Reads a `Buffer` from a `ArrayBuffer`, `bufferSize` could be provided to limit the Buffer into a maximum size. Returns synchronously.