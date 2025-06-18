import jwt from "jsonwebtoken";
// import { generateTokenOptions, tokenSecret } from "../Constants.js";

export function accessToken(payload, secret, options) {
  return jwt.sign(payload, secret.access, options("access"));
}

export function refreshToken(payload, secret, options) {
  return jwt.sign(payload, secret.refresh, options("refresh"));
}

export function tokenGen(payload, secret, options) {
  return {
    accesssToken: accessToken(payload, secret, options),
    refreshToken: refreshToken(payload, secret, options),
  };
}

export function verify(token, secret, options, type) {
  let decoded = jwt.verify(token, secret[type], options(type));
  return decoded;
}

export default "jwt";
