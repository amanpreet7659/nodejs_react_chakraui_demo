const multer = require("multer");
const path = require("path");
const { v4 } = require("uuid");

module.exports = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("backend", "uploads"));
  },
  filename: function (req, file, cb) {
    const filename = v4();
    const extension = file.originalname.split(".").pop();
    cb(null, filename + "." + extension);
  },
});

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     cb(null, file.originalname)
//   }
// });

// module.exports = storage