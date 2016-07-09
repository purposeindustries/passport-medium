// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , uri = require('url')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError


/**
 * `Strategy` constructor.
 *
 * The Medium authentication strategy authenticates requests by delegating to
 * Medium using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Medium application's client id
 *   - `clientSecret`  your Medium application's client secret
 *   - `callbackURL`   URL to which Medium will redirect the user after granting 
 *
 *
 * Examples:
 *
 *     passport.use(new MediumStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/medium/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {

  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://medium.com/m/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.medium.com/v1/tokens';
  options.scope = options.scope || ["basicProfile", "listPublications", "publishPost"]

  options.scope = options.scope.join(",")

  OAuth2Strategy.call(this, options, verify);
  this.name = 'medium';
  this._userProfileURL = options.userProfileURL || 'https://api.medium.com/v1/me';

}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);



/**
 * Retrieve user profile from Medium.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `medium`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *   - `imageUrl`
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;
  
  // Get request with proper Medium styled Authorization Header
  this.get = function (url, accessToken, callback) {
    var self = this

    this._oauth2._request("GET", this._userProfileURL, {
      Authorization: "Bearer " + accessToken
    }, undefined, undefined, callback)
  }


  this.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      done(new InternalOAuthError(err))
    }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    var profile = {}; 
    
    profile.provider  = 'medium';
    profile._raw = body;
    profile._json = json;

    profile.id = json.data.id
    profile.username = json.data.username
    profile.displayName = json.data.name
    profile.imageUrl = json.data.imageUrl

    done(null, profile);
  });
}

/**
 * Return extra Medium-specific parameters to be included in the authorization
 * request.
 *
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function(options) {
  var params = {};
  
  return params;
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;