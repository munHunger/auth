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

function registerService(name, callback) {
  return request("POST", "/service.json", {
    name,
    callback,
  });
}

function beginAuth(service, callbackURL) {
  return `https://auth.munhunger.com/login?service=${service}&callback=${encodeURIComponent(
    callbackURL
  )}`;
}

function auth(service, token, secret, jwtSecret) {
  let body = { service, token };
  body.hash = sha("sha256")
    .update(JSON.stringify(body) + secret)
    .digest("hex");
  return request("POST", "/auth.json", body).then((data) =>
    jwt.sign(data, jwtSecret)
  );
}

function verify(token, jwtSecret) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  registerService,
  beginAuth,
  auth,
  verify,
};
