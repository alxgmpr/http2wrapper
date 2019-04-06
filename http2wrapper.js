'use strict';

/*
 * Created by Alexander Gompper (agompper@me.com), 04/05/19
 */

const http2 = require('http2');

const DEFAULT_USER_AGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/73.0.3683.86 Safari/537.36';
const DEFAULT_TIMEOUT = 10000;

/*
 * These functions perform HTTP/2 requests against their parameters. Although they use HTTP/2, each request
 * connects and destroys its session at the respective start and end of each function. Is that taking advantage of
 * HTTP/2? No.
 *
 *
 *
 * TODO:
 *  - Cookie support
 *  - URL object support
 *  - Follow 3XX redirects
 *  - Session support (single persistent connection, global headers, cookies, etc.)
 *  - Descriptive errors
 *  - HTTP/1.1 fallback on failures
 */

/*
 * Sends a GET request to the specified URL with the given headers. Returns a promise that is resolved with an object
 * containing the headers, flags, and body of the server's response. If the client session encounters an error, the
 * promise is rejected with the respective error message.
 *
 * url: string
 * headers: object
 * timeout: integer
 */
const get = (url, headers = null, timeout = DEFAULT_TIMEOUT) => _get(url, headers, timeout, 'GET');
const _get = (url, headers = null, timeout = DEFAULT_TIMEOUT, method = 'GET') => new Promise(((resolve, reject) => {
    const client = http2.connect(url);
    client.on('error', (error) => { reject(error) });
    client.setTimeout(timeout);
    client.on('timeout', () => { reject(new Error(`GET request to ${url} timed out`)) });
    const req = client.request({
        ':scheme': url.split(':')[0],
        ':method': method,
        ':path': `/${url.split('/').slice(3).join('/').replace(/^\/+$/g, '')}`,
        ':authority': url.split('/')[2],
        'user-agent': DEFAULT_USER_AGENT,
        'accept': '*/*',
        ...headers
    });
    let data = [];
    let res = {
        headers: {},
        flags: 0,
        body: '',
    };
    req.on('data', (chunk) => { data.push(chunk) });
    req.on('response', (headers, flags) => { res.headers = headers; res.flags = flags });
    req.end();
    req.on('end', () => {
        res.body = data.join('');
        client.destroy();
        resolve(res)
    });
}));

/*
 * Sends a POST request to the specified URL with the given headers and body. Returns a promise that is resolved
 * with an object containing the headers, flags, and body of the response. If the client encounters an error, the
 * promise is rejected with the respective error message.
 *
 * Note that it is up to the caller of the function to convert the body of a POST request to a string before firing
 *
 * Note that the method parameter is used since POST/PUT request bodies are identical other than their method.
 *
 * url: string
 * headers: object
 * body: string
 * timeout: integer
 * method: string
 */
const post = (url, headers = null, body = null, timeout = DEFAULT_TIMEOUT) => _post(url, headers, body, timeout, 'POST');
const _post = (url, headers = null, body = null, timeout = DEFAULT_TIMEOUT, method = 'POST') => new Promise(((resolve, reject) => {
    const client = http2.connect(url);
    client.on('error', (error) => { reject(error) });
    client.setTimeout(timeout);
    client.on('timeout', () => { reject(new Error(`POST request to ${url} timed out`)) });
    const buffer = new Buffer.from(body);
    const req = client.request({
        ':scheme': url.split(':')[0],
        ':method': method,
        ':path': `/${url.split('/').slice(3).join('/').replace(/^\/+$/g, '')}`,
        ':authority': url.split('/')[2],
        'user-agent': DEFAULT_USER_AGENT,
        'accept': '*/*',
        'content-length': buffer.byteLength(),
        ...headers
    });
    req.write(buffer);
    let data = [];
    let res = {
        headers: {},
        flags: 0,
        body: '',
    };
    req.on('data', (chunk) => { data.push(chunk) });
    req.on('response', (headers, flags) => { res.headers = headers; res.flags = flags });
    req.end();
    req.on('end', () => {
        res.body = data.join('');
        client.destroy();
        resolve(res)
    });
}));

/*
 * Sends a PUT request to the specified URL with the given headers and body. Returns a promise that is resolved
 * with an object containing the headers, flags, and body of the response. If the client encounters an error, the
 * promise is rejected with the respective error message.
 *
 * Makes use of the fact that POST and PUT are the same in their raw headers/structure, other than their method.
 *
 * url: string
 * headers: object
 * body: string
 * timeout: integer
 */
const put = (url, headers = null, body = null, timeout = DEFAULT_TIMEOUT) => _post(url, headers, body, timeout, 'PUT');

/*
 * Sends a DELETE request to the specified URL with the given headers and body. Returns a promise that is resolved
 * with an object containing the headers, flags, and body of the response. If the client encounters an error, the
 * promise is rejected with the respective error message.
 *
 * Makes use of the fact that GET and DELETE are the same in their raw headers/structure, other than their method
 *
 * url: string
 * headers: object
 * timeout: integer
 */
// Have to use _delete here since 'delete' is a JS keyword
const _delete = (url, headers = null, timeout = DEFAULT_TIMEOUT) => _get(url, headers, timeout, 'DELETE');

module.exports = {get, post, put, _delete};