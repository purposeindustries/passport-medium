# passport-medium-oauth20

[Passport](http://passportjs.org/) strategy for authenticating with [Medium](http://www.medium.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Mediumm in your Node.js applications.
By plugging into Passport, Medium authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-medium

## Usage

#### Create an Application

Before using `passport-medium`, you must register an application with
Medium.  If you have not already done so, a new application can be created in the
[Medium Applications](https://medium.com/me/applications).
Your application will be issued a client ID and client secret, which need to be
provided to the strategy.  You will also need to configure a redirect URI which
matches the route in your application.

#### Configure Strategy

The Medium authentication strategy authenticates users using a Medium.com account
and OAuth 2.0 tokens.  The client ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Medium profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

    var MediumStrategy = require('passport-medium').Strategy;

    passport.use(new MediumStrategy({
        clientID: MEDIUM_CLIENT_ID,
        clientSecret: MEDIUM_CLIENT_SECRET,
        callbackURL: "http://www.example.com/auth/medium/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ mediumId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'medium'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/medium',
      passport.authenticate('medium', { scope: ['profile'] }));

    app.get('/auth/medium/callback', 
      passport.authenticate('medium', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Facebook.  However, because both Facebook and Medium
use OAuth 2.0, the code is similar.  Simply replace references to Facebook with
corresponding references to Medium.

## Contributing

#### Tests

The test suite will be located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@abdulhannanali](https://github.com/abdulhannanali).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [Patreon](https://patreon.com/hannanali). Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>