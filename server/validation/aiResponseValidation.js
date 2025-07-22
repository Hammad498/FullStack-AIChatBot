
import redisClient from "../config/redisClient.js";


export const validateWordCount = (maxWords = 50) => {
  return (req, res, next) => {
    
    const {message}=req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const wordCount = message.trim().split(/\s+/).length;
    if (wordCount > maxWords) {
      return res.status(400).json({ error: `Message must not exceed ${maxWords} words.` });
    }

    next();
  };
};

////////////////////////////////





export const validateImageUpload = (maxFiles = 3) => {
  return async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image must be uploaded." });
    }

    if (req.files.length > maxFiles) {
      return res.status(400).json({ error: `Only up to ${maxFiles} images can be uploaded.` });
    }

    const invalid = req.files.find(file => !file.mimetype.startsWith("image/"));
    if (invalid) {
      return res.status(400).json({ error: "Only image files are allowed." });
    }

    next();
  };
};

export const enforceDailyUploadLimit = async (req, res, next) => {
  const ip = req.ip;
  const limitKey = `upload_limit:${ip}`;
  const alreadyUploaded = await redisClient.get(limitKey);

  if (alreadyUploaded) {
    return res.status(429).json({ error: "You can only upload once every 24 hours." });
  }

  await redisClient.setEx(limitKey, 5, "locked");
  next();
};
