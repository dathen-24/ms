'use strict'

const { readFileSync } = require('fs')
const { sync } = require('read-chunk')
const { Stream } = require('stream')
const { basename } = require('path')
const isArrayBuffer = require('is-array-buffer')

const fromPath = (path, bufferSize) => {
  if (path === basename(path)) Error('Path is not a valid path.')
  if (bufferSize && !Number.isInteger(bufferSize)) Error('bufferSize is not of type Number.')
  if (!bufferSize) return readFileSync(path)
  return sync(path, 0, bufferSize)
}

const fromStream = (arg1, arg2 = 0, arg3) => {
  const stream = arg1
  const bufferSize = typeof arg2 !== 'function' ? arg2 : 0
  const callback = typeof arg2 === 'function' ? arg2 : arg3

  const func = (resolve, reject) => {
    if (!(stream instanceof Stream)) reject(Error('Input is not a stream.'))
    if (bufferSize && !Number.isInteger(bufferSize)) reject(Error('bufferSize is not of type Number.'))
    let buffer = Buffer.alloc(0)
    let sent = false
    stream
      .on('error', (err) => reject(err))
      .on('close', () => { if (!sent) resolve(buffer) })
      .on('readable', () => {
        const data = stream.read()
        if (!data && !!bufferSize && (buffer.length < bufferSize)) {
          return reject(Error('Input streams buffer is less then required size.'))
        }
        if (data == null) { return }
        const size = Number((buffer.length + data.length) - bufferSize)
        const newBuff = bufferSize <= 0 ? data : data.slice(0, data.length - size)
        buffer = Buffer.concat([buffer, newBuff])
        if (!!bufferSize && !sent && buffer.length >= bufferSize) {
          sent = true
          return resolve(buffer)
        }
        if (!data && !sent && newBuff.length < stream.readableHighWaterMark) {
          sent = true
          return resolve(buffer)
        }
      })
  }
  return typeof callback === 'function'
    ? func(callback.bind(null, undefined), callback)
    : new Promise(func)
}

const fromArrayBuffer = (arrayBuffer, bufferSize) => {
  if (!isArrayBuffer(arrayBuffer)) throw Error('Input is not an ArrayBuffer')
  if (bufferSize && !Number.isInteger(bufferSize)) Error('bufferSize is not of type Number')
  return Buffer.from(arrayBuffer, 0, bufferSize || arrayBuffer.length)
}

module.exports = {
  fromStream,
  fromPath,
  fromArrayBuffer
}
