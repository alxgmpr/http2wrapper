# http2wrapper

A quick example of HTTP/2 client requests being implemented in NodeJS.

I was frustrated with the available modules so I decided to make my own set of helpers. 

# Example Usage

1) Clone the repository 

    `git clone https://github.com/alxgmpr/http2wrapper.git`

2) Navigate to the directory

    `cd http2wrapper`
    
3) Run the example script

    `node index.js`
    
# Documentation

All functions return a Promise object that is either resolved with a response or rejected with an error.

* `get(url: string, headers?: object, timeout?: integer)` (signature is identical for `_delete()`)

    * `url` - the full location of the desired resource
    * `headers` - optional additional headers for the request
    * `timeout` - optional millisecond timeout before rejecting the promise (default is 10000ms)
    
* `post(url: string, headers?: object, body?: string, timeout?: integer)` (signature is identical for `put()`)
   
    * `url` - the full location of the desired resource
    * `headers` - optional additional headers for the request
    * `body` - optional request body. This must be a raw string (it is up to the user to serialize JSON and form bodies)
    * `timeout` - optional millisecond timeout before rejecting the promise (default is 10000ms)
    
Responses are object literals structured as such:
```
{
    headers: {},
    flags: 0,
    body: ''
}
```
Just like request bodies, parsing is left up to the user.

    
# Notes, Contribution

* The `:path` and `:scheme` and `:authority` headers are all determined from the URL string parameter. Thus it's necessary
to ensure that URL's are not malformed and should be in the format `https://host/path/to/resource`.
* These functions are *very* basic and are only intended as a 'proof of concept' implementation. They have several
shortcomings including but not limited to:
    * Not taking advantage of concurrent connectivity provided with HTTP/2
    * Poor error handling
    * Low level processing of request/response bodies
* In the future, I'd like to add:
    * [ ] HTTP/1.1 fallback for servers failing to use HTTP/2
    * [ ] Persistent sessions (currently sessions are terminated after each request)
    * [ ] More HTTP methods
    * [ ] Descriptive and dynamic error handling (including following 3XX redirects)
    * [ ] Deploy as an npm package
    * [ ] Stream support
    * [ ] External proxy support
    * [ ] Custom SSL certificates
* Please feel free to fork this repository to make your own implementation. I dont have a strict idea of guiding
contribution, so... go crazy.

# MIT License

Copyright 2019 Alexander Gompper

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
