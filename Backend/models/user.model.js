import mongoose from "mongoose";
import UniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    lowercase: true,
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["admin", "user", "editor"],
    default: "user",
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 - inactive, 1 - active
    default: 1,
  },
  info: {
    type: String,
    maxlength: [200, "Info must be at most 200 characters long"],
  },
});

// Virtual field for confirm password
UserSchema.virtual("confirmPassword")
  .set(function (value) {
    this._confirmPassword = value;
  })
  .get(function () {
    return this._confirmPassword;
  });

// Validate confirm password only at signup
UserSchema.pre("validate", function (next) {
  if (this.isNew && this._confirmPassword && this._confirmPassword !== this.password) {
    this.invalidate("confirmPassword", "Passwords do not match!");
  }
  next();
});

// Apply unique validator plugin
UserSchema.plugin(UniqueValidator, { message: "{PATH} must be unique" });

const UserSchemaModel = mongoose.model("user_Data", UserSchema);

export default UserSchemaModel;
