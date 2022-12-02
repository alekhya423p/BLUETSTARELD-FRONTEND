// CONVERT "event_code" TO event code STRING
export const getLogEventCode = (status) => {
    if (status) {
      switch (status) {
        case "DS_OFF": {
          return 'OFF Duty';
        }
        case "DS_SB": {
          return 'Sleeper';
        }
        case "DS_D": {
          return 'Driving';
        }
        case "DS_ON": {
          return 'On Duty';
        }
        case "DR_IND_YM": {
          return 'Yard Move';
        }
        case "DR_IND_PC": {
          return 'Personal';
        }
        case "INTER_NORMAL_PRECISION": {
          return 'Intermediate';
        }
        case "INTER_REDUCED_PERCISION": {
          return 'Intermediate';
        }
        case "DR_CERT_1": {
          return 'Certify';
        }
        case "DR_CERT_2": {
          return 'Certify';
        }
        case "DR_CERT_3": {
          return 'Certify';
        }
        case "DR_CERT_4": {
          return 'Certify';
        }
        case "DR_CERT_5": {
          return 'Certify';
        }
        case "DR_CERT_6": {
          return 'Certify';
        }
        case "DR_CERT_7": {
          return 'Certify';
        }
        case "DR_CERT_8": {
          return 'Certify';
        }
        case "DR_CERT_9": {
          return 'Certify';
        }
        case "DR_LOGIN": {
          return 'Login';
        }
        case "DR_LOGOUT": {
          return 'Logout';
        }
        case "ENG_UP_NORMAL": {
          return 'Power on';
        }
        case "ENG_UP_REDUCED": {
          return 'Power up';
        }
        case "ENG_DOWN_NORMAL": {
          return 'Power off';
        }
        case "ENG_DOWN_REDUCED": {
          return 'Power off';
        }
        case "ELD_MALF": {
          return 'Malfunction';
        }
        case "ELD_MALF_CLEARED": {
          return 'Malfunction';
        }
        case "ELD_DIAG": {
          return 'Malfunction';
        }
        case "ELD_DIAG_CLEARED": {
          return 'log';
        }
        default:
          return 'none';
      }
    };
  }