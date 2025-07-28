





import jwt from "jsonwebtoken";


export const googleCallbackController = async (req, res) => {
  console.log("🔁 Google Callback Hit");
  console.log("👤 req.user:", req.user);
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("http://localhost:5173/login?error=auth_failed");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Redirect to the correct frontend route with token as query param
    return res.redirect(`http://localhost:5173/oauth/callback?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error("Google login error:", error);
    return res.redirect("http://localhost:5173/login?error=server_error");
  }
};


export const githubCallbackController = async (req, res) => {
  console.log("🔁 Github Callback Hit");
  console.log("👤 req.user:", req.user);
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("http://localhost:5173/login?error=auth_failed");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.redirect(`http://localhost:5173/oauth/callback?token=${token}`);
  } catch (error) {
    console.error("GitHub login error:", error);
    return res.redirect("http://localhost:5173/login?error=server_error");
  }
};
