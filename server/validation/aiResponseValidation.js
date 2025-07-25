
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
    const chatId = req.body.chatId;
    const isNewChat = !chatId;

    // If it's a new chat, image is required
    if (isNewChat && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: "At least one image must be uploaded for new chats." });
    }

    // If images are provided, validate them
    if (req.files && req.files.length > 0) {
      if (req.files.length > maxFiles) {
        return res.status(400).json({ error: `Only up to ${maxFiles} images can be uploaded.` });
      }

      const invalid = req.files.find(file => !file.mimetype.startsWith("image/"));
      if (invalid) {
        return res.status(400).json({ error: "Only image files are allowed." });
      }
    }

    next();
  };
};
/////////////////////////////




export const enforceDailyUploadLimit = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user." });
    }

    const isNewChat = !req.body.chatId;
    const isUploadingImage = req.files && req.files.length > 0;

   
    if (isNewChat && isUploadingImage) {
      const limitKey = `upload_count:${userId}`;
      const currentCount = parseInt(await redisClient.get(limitKey)) || 0;

      if (currentCount >= 8) {
        return res.status(429).json({ error: "Daily image upload limit reached (8 per day)." });
      }

      await redisClient.multi()
        .incr(limitKey)
        .expire(limitKey, 24 * 60 * 60) // 24 hours
        .exec();
    }

    next();
  } catch (err) {
    console.error("Upload limit middleware error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


