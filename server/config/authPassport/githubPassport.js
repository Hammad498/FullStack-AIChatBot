


import passport from "passport";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
import User from "../../models/User.js"; 
dotenv.config();


///
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",

    scope: ["user:email"]
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;

      let user = await User.findOne({
        $or: [
          { githubId: profile.id },
          { email: email } 
        ]
      });

      if (!user) {
        
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          email: email,
        });
      } else if (!user.githubId) {
        
        user.githubId = profile.id;
        await user.save();
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));


// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     const user = await User.findById(id);
//     done(null, user);
// });
