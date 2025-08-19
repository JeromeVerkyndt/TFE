const httpMocks = require('node-mocks-http');
const { EventEmitter } = require('events');

function mkReqRes({ method='GET', url='/', body={}, params={}, dbResult=null, dbErr=null }) {
    const req = httpMocks.createRequest({ method, url, body, params });
    const res = httpMocks.createResponse({ eventEmitter: EventEmitter });
    req.db = {
        query: jest.fn((sql, values, cb) => {
            if (typeof values === 'function') cb = values;
            cb(dbErr, dbResult);
        })
    };
    return { req, res };
}

module.exports = { mkReqRes };
