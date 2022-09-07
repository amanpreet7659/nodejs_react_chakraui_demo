const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/users");
const {
  Created,
  Bad_Request,
  Not_Found,
  OK,
} = require("../services/statucCodes");
const { check, validationResult } = require("express-validator");

// to create
router.post(
  "/",
  [
    check("email", "Email is required").not().isEmpty(),
    check("firstName", "firstName is required").not().isEmpty(),
    check("lastName", "lastName is required").not().isEmpty(),
    check("phoneNumber", "phoneNumber is required").not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(Bad_Request)
        .json({ errors: errors.array(), message: "Validation error" });
    }
    const newData = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middelName: req.body.middelName,
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      image_url: req.body.image_url,
      isDeleted: false,
    });
    User.findOne({ email: req.body.email, isDeleted: false }, (err, user) => {
      if (user) {
        res.status(Bad_Request).json({
          message: "User already exist",
        });
      } else {
        newData
          .save()
          .then((response) => {
            res.status(Created).json(response);
          })
          .catch((err) => {
            console.log(err);
            res.status(Not_Found).json(err);
          });
      }
    });
  }
);

// to get all
router.get("/", async (req, res, next) => {
  let { limit = 10, page = 1, orderBy = 1 } = req.query;
  limit = parseInt(limit);
  page = parseInt(page) - 1;
  const totalData = await User.find({ isDeleted: false }).count();
  User.find({ isDeleted: false })
    .limit(limit)
    .skip(page * limit)
    .then((data) => {
      res.status(OK).json({ data, totalData });
    })
    .catch((err) => {
      res.status(Not_Found).json({
        error: err,
        message: "Error occurs",
      });
    });
});

// get all soft deleted
router.get("/soft/deleted", async (req, res, next) => {
  let { limit = 10, page = 1, orderBy = 1 } = req.query;
  limit = parseInt(limit);
  page = parseInt(page) - 1;
  const totalData = await User.find({ isDeleted: true }).count();
  User.find({ isDeleted: true })
    .limit(limit)
    .skip(page * limit)
    .then((data) => {
      res.status(OK).json({ data, totalData });
    })
    .catch((err) => {
      res.status(Not_Found).json({
        error: err,
        message: "Error occurs",
      });
    });
});
// Hard Delete user
router.delete("/:id", (req, res, next) => {
  const _id = req.params.id;
  User.remove({ _id: _id })
    .then((response) => {
      res.status(OK).json({ message: "Record delete successfully" });
    })
    .catch((err) => {
      res.status(Not_Found).json({
        mesage: "Something went wrong",
        err,
      });
    });
});

// Soft Delete
router.put("/softDel/:id", (req, res, next) => {
  const id = req.params.id;
  User.updateOne({ _id: id }, { $set: { isDeleted: true } })
    .then((response) => {
      res.status(OK).json(response);
    })
    .catch((err) => {
      res.status(Bad_Request).json(err);
    });
});

// update user
router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const updateUser = {
    _id: id,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middelName: req.body.middelName,
    phoneNumber: req.body.phoneNumber,
    dateOfBirth: req.body.dateOfBirth,
    image_url: req.body.image_url,
    isDeleted: false,
  };
  User.update({ _id: id }, { $set: updateUser })
    .exec()
    .then((response) => {
      res.status(OK).json({ response });
    })
    .catch((err) => {
      res.status(Not_Found).json({ error: err });
    });
});

// get single user
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .exec()
    .then((data) => {
      res.status(OK).json({ data });
    })
    .catch((err) => {
      res.status(Not_Found).json({ error: err });
    });
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = (await User.count({ email })) > 0;

    if (!userExists) throw ErrorResponse("Email not found.");

    const user = await User.findOne({ email });

    const passwordVerified = await bcrypt.compare(password, user.password);
    if (!passwordVerified) throw ErrorResponse("Password is incorrect.");

    const token = jwt.sign({ id: user._id }, config.jwt.secret);

    res.status(OK).json({
      token,
      name: user.name,
      email: user.email,
    });
  } catch (e) {
    res.status(Bad_Request).json(e);
  }
});

// search user

router.get("/search/:string", async (req, res, next) => {
  const searchString = req.params.string;
  User.find({ isDeleted: false })
    .exec()
    .then((response) => {
      if (searchString.split(" ").length > 1) {
        const searchQuery = searchString.split(" ").map((_) => _.toLowerCase());
        const data = response.filter(
          (_) =>
            searchQuery.includes(_.firstName.toLowerCase()) ||
            searchQuery.includes(_.lastName.toLowerCase())
        );
        const totalData = data.length;
        res.status(OK).json({ data, totalData });
      } else {
        const filterUser = response.filter(
          (data) =>
            data.firstName.toLowerCase().includes(searchString.toLowerCase()) ||
            data.lastName.toLowerCase().includes(searchString.toLowerCase()) ||
            data.email.toLowerCase().includes(searchString.toLowerCase()) ||
            data.phoneNumber.toString().includes(searchString.toString())
        );
        res.status(OK).json({ data: filterUser, totalData: filterUser.length });
      }
    })
    .catch((err) => {
      res.status(Bad_Request).json(err);
      console.log(err);
    });
});

// upload bulk record

router.post("/bulk", async (req, res, next) => {
  try {
    const { columns, data } = req.body;
    const bulkData = data.map((d) => {
      return {
        _id: new mongose.Types.ObjectId(),
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        // dateOfBirth: d.dateOfBirth.toString(),
        phoneNumber: d.phoneNumber,
        isDeleted: false,
      };
    });
    console.log(bulkData);
    const result = await User.insertMany(bulkData);
    res.status(OK).json({ data: result });
  } catch (err) {
    res.status(Bad_Request).json(err);
  }
});

module.exports = router;
