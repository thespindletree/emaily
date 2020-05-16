const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

// Get model class for the collecyion
const User = mongoose.model("users");

// Tell Passport how to serialize user
passport.serializeUser((user, done) => {
  done(null, user.id); // Tell passport were done
});

// Tell Passport how to deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user); // Tell passport were done
  });
});

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keys.googleClientID,
//       clientSecret: keys.googleClientSecret,
//       callbackURL: "/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       User.findOne({ googleId: profile.id }).then((existingUser) => {
//         if (existingUser) {
//           // we already have a record with the given profile id
//           done(null, existingUser); // Tell passport were done
//         } else {
//           //  we dont currently have a record with the profile id
//           // create new instance of user and persist in database
//           new User({ googleId: profile.id })
//             .save()
//             .then((user) => done(null, user)); // Tell passport were done
//         }
//       });
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // we already have a record with the given profile id
        return done(null, existingUser); // Tell passport were done
      }
      //  we dont currently have a record with the profile id
      // create new instance of user and persist in database
      const user = await new User({ googleId: profile.id }).save();
      done(null, user); // Tell passport were done
    }
  )
);
