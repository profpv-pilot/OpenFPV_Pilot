const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Local Strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'User not found' });
      
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return done(null, false, { message: 'Invalid password' });
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Google Strategy
  try {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
        callbackURL: "/api/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          oauthId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'google'
        };
        try {
          let user = await User.findOne({ oauthId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    ));
  } catch (e) {
    console.warn('Google OAuth strategy not configured:', e.message);
  }

  // GitHub Strategy
  try {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID || 'dummy',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy',
        callbackURL: "/api/auth/github/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          oauthId: profile.id,
          name: profile.displayName || profile.username,
          email: profile.emails ? profile.emails[0].value : `${profile.username}@github.com`,
          provider: 'github'
        };
        try {
          let user = await User.findOne({ oauthId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    ));
  } catch (e) {
    console.warn('GitHub OAuth strategy not configured:', e.message);
  }
};
