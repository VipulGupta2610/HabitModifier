import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    isPass: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: function () {
        return this.isPass == true
      }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;