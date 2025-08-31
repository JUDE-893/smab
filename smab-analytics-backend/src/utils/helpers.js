import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { addDays } from "date-fns";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';

// catches the error throw in the embeded function and forward it to the last middleware
export function errorCatchingLayer(fnc) {
  return (req ,res, next) => {
    fnc(req, res, next).catch(next)
  }
}

// catches the error throw in the embeded function and
export function wsErrorCatchingLayer(fnc) {
  return (socket, next) => {
    fnc(socket, next).catch((e) => {
      console.log('dddddddddddddddrrrrrrrrrrr',e);
      return next(e)
    })
  }
}

//  create a jwt token holding the user id
export function signJWT(id) {
  let token = jwt.sign({id},process.env.JWT_SALT, {expiresIn: process.env.JWT_EXPIRES_IN});
  return token
}

//  create a jwt token holding the user id
export function verifyJWT(token) {
  let result = jwt.verify(token, process.env.JWT_SALT);
  return result;
}

//  create a jwt token holding the user id
export function setJwtCookie(res, token) {
  res.cookie('jwt_token',token, {
    expires: addDays(new Date(), 1),
    sameSite: process.env.JWT_SAME_SITE,
    secure: process.env.JWT_SECURE==='true',
    httpOnly: process.env.JWT_HTTP_ONLY==='true'
  })
}

// ecrypt a text
export function encrypt(text, secret) {
  //  advanced encryption standart 256 cipher block chaining
  let cipher = crypto.createCipher('aes-256-cbc', secret); // create a cipher object
  let encryptedCipher = cipher.update(text, 'utf-8', 'hex'); // encrypt
  encryptedCipher += cipher.final('hex'); // generate the final hex part
  return encryptedCipher
}

// decrypt a text
export function decrypt(text, secret) {
  //  advanced encryption standart 256 cipher block chaining
  let decipher = crypto.createDecipher('aes-256-cbc', secret); // create a decipher object
  let decryptedCipher = decipher.update(text, 'hex', 'utf-8'); // decrypt
  decryptedCipher += decipher.final('utf-8'); // generate the final hex part
  return decryptedCipher
}

// function that return a derived new Object from given object and array of desired keys
const fromObject = (obj, keys) =>
  Object.fromEntries(keys.map(key => [key, obj[key]]));

// global unhandled error é rejections handler
export const cdebugger = () => {
  // Handle ALL error types
  const handleError = (err, origin) => {
    console.log(`💥 CRITICAL ${origin}:`, err);
    console.error(`💥 CRITICAL ${origin}:`, err);

    // Optional: Send to error tracking (Sentry, etc.)
    // require('@sentry/node').captureException(err);

    process.exit(1); // Exit with failure code
  };

  // Catch all possible error types
  process.on('uncaughtException', (err) => handleError(err, 'uncaughtException'));
  process.on('unhandledRejection', (err) => handleError(err, 'unhandledRejection'));
  process.on('SIGTERM', () => handleError(new Error('SIGTERM'), 'SIGTERM'));
  process.on('SIGINT', () => handleError(new Error('SIGINT'), 'SIGINT'));

  // Optional: Operational errors (non-crashing)
  process.on('warning', (warning) => {
    console.warn('⚠️ Warning:', warning);
  });
}


dayjs.extend(isoWeek);

/**
 * Get date range for current day, week, month, or year
 * @param {'daily'|'week'|'month'|'year'} type - Range type
 * @param {boolean} customWeek - If true, week starts on Saturday (matches your example)
 * @returns {string[]} ["YYYY-MM-DD", "YYYY-MM-DD"]
 */
export const getDateRange = (type = 'week', customWeek = false) => {
  const today = dayjs();
  let start, end;

  if (type === 'day') {
    start = today;
    end = today;
  }
  else if (type === 'week') {
    if (customWeek) {
      // Week starting Saturday
      start = today.day(6); // Saturday
      end = start.add(5, 'day'); // Saturday + 5 days = Thursday
    } else {
      // ISO week: Monday to Saturday
      start = today.isoWeekday(1); // Monday
      end = today.isoWeekday(6);   // Saturday
    }
  }
  else if (type === 'month') {
    start = today.startOf('month');
    end = today.endOf('month');
  }
  else if (type === 'year') {
    start = today.startOf('year');
    end = today.endOf('year');
  }
  else {
    throw new Error('Invalid type. Use "daily", "week", "month", or "year".');
  }

  return [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')];
};
