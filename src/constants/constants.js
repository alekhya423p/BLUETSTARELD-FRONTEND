export const PARTNER = 'partner';
export const COMPANY = 'company';
export const ADMIN = 'admin';
export const DRIVER = 'driver';
export const VALIDATE_NAME = /^[a-zA-Z ]*$/;
export const VALIDATE_JOB_NUMBER = /^[a-zA-Z0-9]+$/;
export const ALPHABATES_NUMERIC = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
export const VALIDATE_PASSWORD = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,14}$/;
export const NUMERIC_CHARACTERS = /^[0-9]+$/;
export const VALIDATE_PRICE = /^(?!(?:.*?\.){2})\d{0,3}[.]?\d{0,3}[.]?\d{0,3}[.]?\d{0,3}[.]?\d{0,3}[.]?\d{1,3}[,]?\d{0,2}$/;
export const VALIDATE_MAC_ADDRESS = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
export const VALIDATE_PHONE_NUMBER = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const VALIDATE_US_PHONE_NUMBER = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; // eslint-disable-line
export const VALIDATE_NUMBERS = /^[1-9]\d*$/
export const VALIDATE_DECIMAL = /^\d+\.\d{1,1}$/
export const VALIDATE_POSITIVE_NEGATIVE = /^-?\d*\d{0,6}$/