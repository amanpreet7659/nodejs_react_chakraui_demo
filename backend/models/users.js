const mongose = require("mongoose");

const userSchema = mongose.Schema(
  {
    _id: mongose.Schema.Types.ObjectId,
    email: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    middelName: { type: String, require: false },
    phoneNumber: { type: Number, require: true },
    dateOfBirth: { type: Date, require: false },
    image_url: { type: String, require: false },
    isDeleted: { type: Boolean, default: false, require: false },
  },
  { timestamps: true }
);

module.exports = mongose.model("users", userSchema);
