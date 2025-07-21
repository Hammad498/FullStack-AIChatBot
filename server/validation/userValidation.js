const allowedDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
        return false;
    }
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
};


const validateEmailMiddleware = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid or unsupported email domain" });
    }
    next();
};

export { validateEmail, validateEmailMiddleware };
