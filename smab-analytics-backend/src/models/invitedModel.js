import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import {subYears} from 'date-fns';
import uniqueValidator from 'mongoose-unique-validator';
import slugify from 'slugify'

const invited = new mongoose.Schema({
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The issuer user id is required"]
  },
  email: {
     type: String,
     required: [true, 'the invited email address is required'],
     unique: [true, 'the invited email address must be unique'],
     validate: [(val) => validator.isEmail(val), 'invalid email address form'],
     trim: true
  },
  usageTimes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  authorizationToken: String,
  authorizationTokenExpiresAt: Date,
},
{
  toJSON: {virtuals: true,
    transform: function (doc, ret) {}
  },
  toObject: {virtuals: true,
    transform: function (doc, ret) {}
  },
})

// validate the fields with unique constraint
invited.plugin(uniqueValidator, {message: '{PATH} must be unique'});


/* MIDDLEWARES */

// encrypt the authorizationToken
invited.pre('save', async function(next) {
  return next()
});

/* METHODS */

// check for correct authorizationToken | <toekn> : token recieved by the client in the mail box
invited.methods.verifyAuthorizationToken = async function() {
  const currentDate = new Date();

  // Ensure both sides are numbers (timestamps) for comparison
  if (currentDate.getTime() <= this.authorizationTokenExpiresAt.getTime()) {
    if (this.usageTimes === 0) {
      this.usageTimes += 1;

      // Extend expiry time
      const timeoutMinutes = Number(process.env.AUTHORIZATION_TOKEN_ACTIVE_TIMEOUT) || 15;
      this.authorizationTokenExpiresAt = new Date(
        currentDate.getTime() + timeoutMinutes * 60 * 1000
      );

      await this.save(); // don’t forget to persist changes if needed
      return true;
    } else if (this.usageTimes === 1) {
      this.usageTimes += 1;
      await this.save();
      return true;
    } else {
      return false;
    }
  }

  return false;
};

const Invited = mongoose.model('Invited', invited);

export default Invited
