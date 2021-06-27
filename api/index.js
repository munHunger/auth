const https = require("https");
const jwt = require("jsonwebtoken");
const sha = require("sha.js");

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    let req = https.request(
      {
        hostname: "auth.munhunger.com",
        method,
        port: 443,
        path,
        headers: {
          "Content-Type": "application/json",
        },
        agent: false, // Create a new agent just for this one request
      },
      (res) => {
        var str = "";

        //another chunk of data has been received, so append it to `str`
        res.on("data", function (chunk) {
          str += chunk;
        });

        //the whole response has been received, so we just print it out here
        res.on("end", function () {
          resolve(str);
        });
      }
    );

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Registers a new service at auth.munhunger.com
 * @param {string} name the name of the service
 * @param {string} callback a verified callback URL to direct users to after auth
 * @returns {Promise<string>} a secret token for this service
 */
function registerService(name, callback) {
  return request("POST", "/service.json", {
    name,
    callback: [callback],
  });
}

/**
 * Begin user authentication
 * @param {string} service name of the service
 * @param {string} callbackURL a url to direct users to after successful auth
 * @returns {string} a url to direct the user to in order to begin authentication
 */
function beginAuth(service, callbackURL) {
  return `https://auth.munhunger.com/login?service=${service}&callback=${encodeURIComponent(
    callbackURL
  )}`;
}

let pubKey;
/**
 * end the authentication by requesting a JWT from the auth server
 * @param {string} service name of the service
 * @param {string} token token received from a successful user redirect from the begin auth step
 * @param {string} secret the service secret token
 * @returns {Promise<string>} a JWT for the user that logged in
 */
async function auth(service, token, secret) {
  if (!pubKey) pubKey = await request("GET", "/pub.key");
  let body = { service, token };
  console.log(token);
  body.hash = sha("sha256")
    .update(JSON.stringify(body) + secret)
    .digest("hex");
  return request("POST", "/auth.json", body);
}

/**
 * verify that a JWT token is correct
 * @param {string} token a jwt token to verify
 * @returns {Promise<any>} user data
 */
async function verify(token) {
  if (!pubKey) pubKey = await request("GET", "/pub.key");
  return jwt.verify(token, pubKey, { issuer: "auth" });
}

module.exports = {
  registerService,
  beginAuth,
  auth,
  verify,
};
