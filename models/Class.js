const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Class cannot be more than 100 characters long!"],
    },
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
