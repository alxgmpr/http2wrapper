'use strict';

/*
 * Created by Alexander Gompper (agompper@me.com), 04/05/19
 */

const {get} = require('./http2wrapper.js');

get('https://en.wikipedia.org/wiki/Main_Page')
    .then(res => console.log(res.headers[':status']));
