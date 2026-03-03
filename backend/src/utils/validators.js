'use strict';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;
const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email);
}

function isValidMongoId(id) {
  return typeof id === 'string' && MONGO_ID_REGEX.test(id);
}

function isValidEthAddress(address) {
  return typeof address === 'string' && ETH_ADDRESS_REGEX.test(address);
}

function isValidTxHash(hash) {
  return typeof hash === 'string' && TX_HASH_REGEX.test(hash);
}

function isStrongPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

module.exports = {
  isValidEmail,
  isValidMongoId,
  isValidEthAddress,
  isValidTxHash,
  isStrongPassword,
};
