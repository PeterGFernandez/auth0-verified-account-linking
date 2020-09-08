function VALink(user, context, callback) {
  /*
   * This rule (https://auth0.com/docs/rules) is intended to perform conditional 
   * processing in order to provide Verified Account Linking. 
   * 
   * The rule utilises a corresponding Auth0 Profile Management Client: an interactive 
   * client which is used to perform specific profile management actions. The Profile 
   * Management Client definition in Auth0 describes security artefacts - e.g. 
   * grant types, secret, etc - which can be tightly controlled, reducing any 
   * potential for security compromise.
   * 
   * The concept of Policy is also employed. Policy provides context (in this 
   * implementation initially obtained from user `metadata`) and is 
   * encapsulated in a JWT for security. 
   */
  var ManagementClient = require('auth0@2.9.1').ManagementClient;
  var Promise = require('native-or-bluebird@1.2.0');
  var LOG_TAG = '[VERIFIED_ACCOUNT_LINKING]: ';
  var DEBUG = configuration.DEBUG ? console.log : function () {};
  var managementAPI = new ManagementClient({
    token: auth0.accessToken,
    domain: auth0.domain
  });

  // State Machine
  user.app_metadata = user.app_metadata || {};
  switch (context.protocol) {
    case 'redirect-callback': {
      LOG_TAG = LOG_TAG + '[REDIRECT_CALLBACK]: ';
      user.app_metadata.policy = 
      user.app_metadata.policy || {};
      user.app_metadata.policy.link = 
      user.app_metadata.policy.link || {};
      DEBUG(LOG_TAG, "context =", context.clientID);
      DEBUG(LOG_TAG, "Evaluating Account Link for ", user.user_id);
      if (
        context.request &&
        context.request.query &&
        context.request.query.companion &&
        user.app_metadata.policy.link.companion) {
        Promise.resolve(new 
        Promise(function (resolve, reject) {
          var jwt = require('jsonwebtoken');
          var jwksRsa = require('jwks-rsa');
          DEBUG(LOG_TAG, "User app_metadata = ", user.app_metadata);
          DEBUG(LOG_TAG, "Evaluating Account Link for ", user.user_id);
          DEBUG(LOG_TAG, "Evaluated Account Link policy = ", user.app_metadata.policy.link);
          try {
            /* Decode unverified companion to obtain Key ID */
            var token = jwt.decode(
              context.request.query.companion, {
                complete: true
              });
            var header = token.header || {};
            var kid = header.kid || "";
            DEBUG(LOG_TAG, "Obtaining Keys");

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

                /* Verify companion */
                jwt.verify(
                  context.request.query.companion, 
                  signingKey, {
                    // Default 5 second tolerance                    
                    clockTolerance: configuration.CLOCK_TOLERANCE || 5,
                    issuer: 'https://' + context.request.hostname + '/',
                    audience: configuration.PROFILE_AUDIENCE, 
                    algorithms:["RS256"]
                  }, function(error, decoded) {
                    if (error) {
                      console.error(LOG_TAG, "Error verifying companion = ", error);
                      reject(error);
                    } else  {
                      LOG_TAG = LOG_TAG + '[LINKING]: ';
                      DEBUG(LOG_TAG, "Linking User Accounts");

                      /* Link accounts?
                      */
                      if (user.app_metadata.policy.link.companion === decoded.sub) {
                        managementAPI.users.link(
                          user.app_metadata.policy.link.companion, {
                          user_id: user.user_id,
                          provider: user.identities[0].provider
                        })  
                        .then(function (identities) {
                          DEBUG(LOG_TAG, "Identities = ",identities);
                          context.primaryUser = user.app_metadata.policy.link.companion;

                          /* Update identities array so any subsequent Rule can benefit */ 
                          user.identities = identities;
                          resolve();
                        })
                        .catch(function (error) {
                          console.error(LOG_TAG, "Error linking accounts = ", error);
                          reject(error);
                        });
                      } else {
                        DEBUG(LOG_TAG, "Incorrect companion; ignore");
                        resolve();
                      }
                    }
                });
              }
            });
          } catch (error) {
            reject(error);
          }
        }))
        .then(function () {
          callback(null, user, context);
        })
        .catch(function (error) {
          console.error(LOG_TAG, error);
          callback(new UnauthorizedError(0, error), user, context);
        });
      } else {
        DEBUG(LOG_TAG,"User Linking Skipped");
        callback(null, user, context);
      }
    } break;

    default: {
      DEBUG(LOG_TAG, "PROFILE_SERVICE = ", configuration.PROFILE_SERVICE);
      DEBUG(LOG_TAG, "PROFILE_CLIENT = ", configuration.PROFILE_CLIENT);
      DEBUG(LOG_TAG, "context =", context.clientID);
      switch(context.clientID) {
        case configuration.PROFILE_SERVICE:
        case configuration.PROFILE_CLIENT: {
          LOG_TAG = LOG_TAG + '[PROFILE]: ';
          Promise.resolve(new 
          Promise(function (resolve) {
            DEBUG(LOG_TAG, "PROFILE_AUDIENCE = ", configuration.PROFILE_AUDIENCE);
            DEBUG(LOG_TAG, "audience =", context.request.query.audience);
            switch (context.request.query.audience) {
              case configuration.PROFILE_AUDIENCE: {
                LOG_TAG = LOG_TAG + '[PROFILE_AUDIENCE]: ';
                context.idToken[configuration.PROFILE_AUDIENCE + '/policy'] = 
                context.accessToken[configuration.PROFILE_AUDIENCE + '/policy'] = 
                  JSON.stringify(user.app_metadata.policy);
                resolve();
              } break;

              default:
                resolve();
                break;
            }
          }))
          .then(function () {
            DEBUG(LOG_TAG,"Computed Policy = ", user.app_metadata.policy);
            callback(null, user, context);
          })
          .catch(function (error) {
            console.error(LOG_TAG, error);
            callback(new UnauthorizedError(0, error), user, context);
          });
        } break;
          
        default: {
          DEBUG(LOG_TAG, "Detecting Account Link for ", user.email);
          if (user.identities.length > 1) {
            DEBUG(LOG_TAG,"Skipping already Linked User");
            callback(null, user, context);
          }
          else
          switch(context.connection) {
            case 'Helpdesk': {
              DEBUG(LOG_TAG,"'" + context.connection + "' User Skipped");
              callback(null, user, context);
            } break; 

            default:
              Promise.resolve(new 
              Promise(function (resolve, reject) {
                DEBUG(LOG_TAG, "Evaluating Account Link for ", user.email);
                managementAPI.getUsers({
                  search_engine: 'v3',
                  fields: "user_id,identities",
                  include_fields: true,  
                  q: "email:"+ user.email + " AND NOT user_id:" + user.user_id
                })
                .then(function (users) {
                  var identities = [];
                  if (users.length) {
                    users.forEach(function (_user) {
                      user.app_metadata.policy = 
                      user.app_metadata.policy || {};
                      user.app_metadata.policy.link = 
                      user.app_metadata.policy.link || {};
                      DEBUG(LOG_TAG,"User = ", _user);
                      DEBUG(LOG_TAG,"Analyzing identities");

                      // Process account with the most identities   
                      if (_user.identities.length > identities.length) {
                        user.app_metadata.policy.link.connection=[];
                        _user.identities.forEach(function (identity) {
                          DEBUG(LOG_TAG,"Identity = ", identity);
                          switch(identity.connection) {
                            /* To be skipped */
                            case 'Helpdesk':
                              DEBUG(LOG_TAG,"Identity Skipped");
                              break;
                              
                            /* Supporting re-authentication (e.g. prompt=`login`) */
                            default: {
                              DEBUG(LOG_TAG,"Connection selected = ", identity.connection);
                              user.app_metadata.policy.link.connection.push(identity.connection);
                              user.app_metadata.policy.link.companion = _user.user_id;
                              identities = _user.identities;
                            } break;
                          }
                        });
                      }

                      // Linked identity discovered?
                      if (
                        user.app_metadata.policy.link.companion &&
                        user.app_metadata.policy.link.connection.length) {
                        DEBUG(LOG_TAG,"Detected Link Companion");
                        auth0.users.updateAppMetadata(
                          user.user_id, 
                          user.app_metadata)
                          .then(function () {
                            DEBUG(LOG_TAG,"Redirecting");
                            context.redirect = context.redirect || {};
                            context.redirect.url = configuration.PROFILE_REDIRECT +
                              "/client";
                            resolve();
                          })
                          .catch(function (error) {
                            delete user.app_metadata.policy.link;
                            reject(error);
                          });
                      } else {
                        DEBUG(LOG_TAG,"No companion users detected");
                        delete user.app_metadata.policy.link;
                        resolve();
                      }
                    });
                  } else {
                    DEBUG(LOG_TAG,"No companion users detected");
                    resolve();
                  }
                })
                .catch(function (error) {
                  reject(error);
                });
              }))
              .then(function () {
                DEBUG(LOG_TAG,"Computed Policy = ", user.app_metadata.policy);
                callback(null, user, context);
              })
              .catch(function (error) {
                console.error(LOG_TAG, error);
                callback(new UnauthorizedError(0, error), user, context);
              });
          }
        } break;
      }
    } break;
  }
}