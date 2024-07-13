const multer = require("multer");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads_dumps");
  },
  filename: (req, file, cb) => {
    const regex = /\.([a-zA-Z0-9]+)$/;
    console.log(
      req.query.userid +
        "_" +
        uid.rnd() +
        "." +
        file.originalname.match(regex)[1]
    );
    cb(
      null,
      req.query.userid +
        "_" +
        uid.rnd() +
        "." +
        file.originalname.match(regex)[1]
    );
  },
});

// Create the multer instance
const upload = multer({ storage: storage });
module.exports = upload;
