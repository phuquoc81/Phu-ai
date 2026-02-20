const assert = require("assert/strict");
const handler = require("../api/phutokenvercel");

const headers = {};
let statusCode;
let jsonPayload;

const res = {
  setHeader: (name, value) => {
    headers[name] = value;
  },
  status: (code) => {
    statusCode = code;
    return {
      json: (payload) => {
        jsonPayload = payload;
      }
    };
  }
};

handler({}, res);

assert.equal(statusCode, 200);
assert.equal(headers["Content-Type"], "application/json");
assert.equal(jsonPayload.name, "Phutokenvercel");
assert.equal(jsonPayload.status, "ok");
assert.equal(jsonPayload.message, "Phutokenvercel API is running on Vercel.");
assert.equal(typeof jsonPayload.timestamp, "string");

console.log("Phutokenvercel API test passed.");
