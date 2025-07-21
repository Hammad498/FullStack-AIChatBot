


const allowedDomains=["gmail.com","yahoo.com","hotmail.com","outlook.com"];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
        return false;
    }
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
}

export {validateEmail};