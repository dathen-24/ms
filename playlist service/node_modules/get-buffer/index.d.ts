import { Readable } from "stream";

// Type definitions for get-buffer v1.0.0
// Project: https://github.com/emilsivervik/get-buffer
// Definitions by: emilsivervik <https://github.com/emilsivervik>

/// <reference types="node" />

export = GetBuffer;

declare namespace GetBuffer {
    type Callback = (error: any, buffer: Buffer) => void;

    /**
     * Synchronous: Reads the specified file into a Buffer. Returns a Buffer.
     * @param {string} filePath The path to the file.
     * @return {Buffer} Returns a Buffer.
     */
    function fromPath(filePath: string);
    /**
     * Synchronous: Reads the specified file into a Buffer, the size of the returning Buffer can be fixed with 2th parameter. Returns a Buffer
     * @param {string} filePath The path to the file.
     * @param {number} bufferLength The size of the Buffer to return.
     * @return {Buffer} Returns a Buffer.
     */
    function fromPath(filePath: string, bufferLength: number | null);

    /**
     * Asynchronous: Reads stream and returns a function<Buffer>.
     * Returning Buffer size can have a max size if bufferLength is passed. 
     * @param {Readable} Stream The stream to read Buffer from.
     * @return {Buffer} Returns a Promise<Buffer>.
     */
    function fromStream(stream: Readable): Promise<Buffer>;
    /**
     * Asynchronous: Reads stream and returns a function<Buffer>.
     * @param {Readable} Stream The stream to read Buffer from.
     * @param {function} callback The callback function to return.
     * @return {function} Returns a callback function.
     */
    function fromStream(stream: Readable, callback: Callback);
    /**
     * Asynchronous: Reads stream and returns a function<Buffer>.
     * Stream is not automatically paused or destroyed when Buffer is returned.
     * @param {Readable} Stream The stream to read Buffer from.
     * @param {number} bufferLength The size of the Buffer to return.
     * @return {Buffer} Buffer
     */
    function fromStream(stream: Readable, bufferLength: number | null): Promise<Buffer>;
    /**
     * Asynchronous: Reads stream and returns a function<Buffer>.
     * Returning Buffer size can have a max size if bufferLength is passed.
     * Stream is not automatically paused or destroyed when Buffer is returned.
     * @param {Readable} Stream The stream to read Buffer from.
     * @param {number} bufferLength The size of the Buffer to return.
     * @param {function} callback The callback function to return.
     * @return {function} Returns a callback function.
     */
    function fromStream(stream: Readable, bufferLength: number | null, callback: Callback);

    /**
     * Synchronous: Reads ArrayByffer and returns a Buffer.
     * Returning Buffer size can have a max size if bufferLength is passed. 
     * @param {ArrayBuffer} Stream The stream to read Buffer from.
     * @return {Buffer} Returns a Promise<Buffer>.
     */
    function fromArrayBuffer(stream: Readable): Buffer;
    /**
     * Synchronous: Reads ArrayByffer and returns a Buffer.
     * Returning Buffer size can have a max size if bufferLength is passed. 
     * @param {ArrayBuffer} Stream The stream to read Buffer from.
     * @param {number} bufferLength The size of the Buffer to return.
     * @return {Buffer} Returns a Promise<Buffer>.
     */
    function fromArrayBuffer(stream: Readable, bufferLength: number): Buffer;
}