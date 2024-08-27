const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve("./uploads"));
  },
  filename: (req, file, callback) => {
    const { userId } = req.body;
    const time = new Date().getTime();
    callback(null, `${userId}_${time}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
