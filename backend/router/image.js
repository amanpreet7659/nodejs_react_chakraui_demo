const { error, success } = require("../services/response");
const router = require("express").Router();
const multer = require("multer");
const storage = require("../services/storage");
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    success(res, { path: req.file.filename });
  } catch (e) {
    error(res, e);
  }
});

module.exports = router;
