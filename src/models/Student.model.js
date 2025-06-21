import mongoose from "mongoose";
import RequireField from "../utils/RequireField.js";
import validator from "validator";
import bcryptjs from "bcryptjs";
import { salt } from "../Constants.js";

const StudentSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: [true, RequireField("userid")],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, RequireField("password")],
      trim: true,
      select: false,
    },
    phone: {
      type: String,
      required: [true, RequireField("number")],
      validate: {
        validator: function (phone) {
          return validator.isMobilePhone(phone, "en-IN");
        },
        message: "Invalid number format",
      },
    },
    email: {
      type: String,
      required: [true, RequireField("email")],
      trim: true,
      unique: true,
      validate: {
        validator: function (mail) {
          return validator.isEmail(mail);
        },
        message: "Invalid email format",
      },
    },
    fullName: {
      type: String,
      required: [true, RequireField("full Name")],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, RequireField("Branch")],
      trim: true,
    },
    dob: {
      type: String,
      required: [true, RequireField("DOB")],
      trim: true,
      match: [
        /^(\d{2}[-/]\d{2}[-/]\d{4}|\d{2}[-/][A-Za-z]{9}[-/]\d{4}|\d{2}\d{2}\d{4})$/,
        `Invalid DOB format, correct formats are:
    dd-mm-yyyy
    dd/mm/yyyy
    dd-MMM-yyyy (e.g., 12-Jan-2002)
    dd/MMM/yyyy
    ddmmyyyy`,
      ],
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: [true, RequireField("role")],
      enum: { values: ["student"], message: "Invalid role" },
    },
    course: {
      type: String,
      required: [true, RequireField("Course")],
      trim: true,
    },

    marks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Marks" }],
    program: {
      type: String,
      required: [true, RequireField("Program")],
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    guardianContactInfo: {
      type: String,
      required: [true, RequireField("Contact number of guardian")],
      match: [/^[6-9]\d{9}$/, "Must be a valid Indian phone number"],
    },
  },
  { timestamps: true }
);

StudentSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcryptjs.hash(this.password, salt);

    next();
  } catch (err) {
    let error = new ApiErrorResponse(err).res();
    console.log(error);
    next(err);
  }
});

StudentSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcryptjs.hash(this.password, salt);

    next();
  } catch (err) {
    let error = new ApiErrorResponse(err).res();
    console.log(error);
    next(err);
  }
});

StudentSchema.methods.comparePassword = async function (password) {
  try {
    let isMatch = await bcryptjs.compare(password, this.password);
    if (!isMatch) {
      throw new Error("Passwords don't match");
    }
    return true;
  } catch (err) {
    let error = new ApiErrorResponse(err).res();
    console.log(error);
    return false;
  }
};

let Student = mongoose.model("Student", StudentSchema);
export default Student;
