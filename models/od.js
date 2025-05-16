var mongoose = require("mongoose");
var odSchema = new mongoose.Schema(
  {
    subject: { type: String, required: "subject cant be blank" },
    from: Date,
    to: Date,
    days: Number,
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending"
    },
    hodstatus: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending"
    },
    finalstatus: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending"
    },
    approved: {
      type: Boolean,
      default: false
    },
    denied: {
      type: Boolean,
      default: false
    },
    stud: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      },
      username: String
    }
  },
  { timestamps: {} }
);

module.exports = mongoose.model("Od", odSchema);
