function verifyJWT (user, context, callback) {
  var DEBUG = configuration.DEBUG ? console.log : function () {};
  global.verifyJWT = global.verifyJWT || function (JWT)  {
    var jwt = require('jsonwebtoken');
    var jwksRsa = require('jwks-rsa');
	  var LOG_TAG = LOG_TAG || '[VERIFY_JWT]: ';
    DEBUG(LOG_TAG, "Verifying Token");
    return new Promise((resolve, reject) => {
      /* Decode unverified JWT to obtain Key ID */
      var token = jwt.decode(JWT, {
        complete: true
      });
      var header = token.header || {};
      var kid = header.kid || "";
      global.jwks = global.jwks || jwksRsa({
        strictSsl: true,
        rateLimit: true,
        cache: true,
        // Default 24 hour maximum age             
        cacheMaxAge: configuration.JWKSCACHE_MAX_AGE || 8640000,   
        // Default of 5 max cache entries              
        cacheMaxEntries: configuration.JWKSCACHE_MAX_ENTRIES || 5,    
        jwksUri: 'https://' + auth0.domain + '/.well-known/jwks.json',
      });
      global.jwks.getSigningKey(kid, (error, key) => {
        if (error) {
          console.error(LOG_TAG, "Error obtaining signing key = ", error);
          reject(error);
        } else {
          const signingKey = key.publicKey || key.rsaPublicKey;
          DEBUG(LOG_TAG, "signing key = ", signingKey);

          /* Verify JWT */
          jwt.verify(
            JWT, 
            signingKey, {
              // Default 5 second tolerance                    
              clockTolerance: configuration.CLOCK_TOLERANCE || 5,
              // Verify against all valid issuers for the tenant
              issuer: [
                'https://' + auth0.domain + '/',
                'https://' + context.request.hostname + '/'],
              algorithms:["RS256"]
            }, function(error, decoded) {
              if (error) {
                return reject(error);
              }
              return resolve(decoded);
            });
        }
      });
    });
  };
  return callback(null, user, context);
}