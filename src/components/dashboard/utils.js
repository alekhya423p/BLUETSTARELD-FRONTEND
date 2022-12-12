// GET RECORD_STATUS 3 OVER 1
export const getVehicles = (vehicles, search) => {
    let firstUnits = JSON.parse(localStorage.getItem("firstUnits")) || [];
    let newUnits = [];
    vehicles.forEach((el, i) => {
        // const odometer = el.tracking && el.tracking.odometer && el.tracking.odometer !== -1 ? `${el.tracking.odometer}` : "N/A";
        let fullname = (el.driverName).toLowerCase();
        newUnits.push({
            show: fullname.includes(search),
            id: el.id,
            status: el.eventCode ? getLogStatus(el.eventCode) : "",
            driver: el.driverName,
            driverId:el.driverId,
            history:el?.history,
            fuelLevel: el.fuelLevel,
            coDriverName: el.coDriverName,
            coDriverId: el.coDriverId,
            coDriverEventCode: el.coDriverEventCode ? getLogStatus(el.coDriverEventCode) : "",
            state: el.state,
            vehicleStatus: el.vehicleStatus,
            heading: el.heading,
            coordinates:el.coordinates,
            coordinatesPrevious: el.coordinatesPrevious,
            tracking: {
              address: el.location,
              coordinates: {...el.coordinates}, // eslint-disable-next-line
              coordinatesPrevious: {... el.coordinatesPrevious},
              date: el.timestamp,
              delta_distance: 0,
              eld_connection: true,
              engine_hours: 0.1,
              is_live: el.online,
              odometer: el.odometer,
              rotation: 0,
              speed: el.speed,
              state: el.state,
              vehicleId: el.vehicleNumber
            },
            truckNo: el.vehicleId && el.vehicleNumber,
            truckId: el.vehicleId,
            lastPosition: {
                place: el && el.location,
                time: el && el.timestamp,
            },
            currentSpeed: el.speed && el.speed + " mph",
            eld: el.eld_mode ? "ELD" : el.elog_mode ? "E-LOG" : "",
            marker: el.coordinates && {
              iconDeg: (el.vehicleStatus === 'IN_MOTION'|| el.vehicleStatus === 'INACTIVE') ? 1 :  0,
              odometer: el.odometer,
              speed: el.speed,
              vehicleStatus: el.vehicleStatus,
              heading: el.heading,
              coordinates:el.coordinates,
              coordinatesPrevious: el.coordinatesPrevious,
              position: {
                lat: el.coordinates?.lat ? parseFloat(el.coordinates.lat) : 0,
                lng: el.coordinates?.lng ? parseFloat(el.coordinates.lng) : 0,
              },
            },
            ...el.timers,
        });
        let onMapEl = firstUnits.find((fu) => fu.id === el.id);
        newUnits[i]["showOnMap"] = onMapEl ? onMapEl["showOnMap"] : !!el;
    });
    return newUnits;
};

export const getDrivers = (drivers, search) => {
    let firstUnits = JSON.parse(localStorage.getItem("firstDriverUnits")) || [];
    let newUnits = [];
    drivers.forEach((el, i) => {
        // const odometer = el.tracking && el.tracking.odometer && el.tracking.odometer !== -1 ? `${el.tracking.odometer}` : "N/A";
        let fullname = (el.driverName).toLowerCase();
        newUnits.push({
            show: fullname.includes(search),
            id: el.id,
            status: el.eventCode ? getLogStatus(el.eventCode) : "",
            driver: el.driverName,
            tracking: {
                address: el.location,
                coordinates: {...el.coordinates},
                date: el.timestamp,
                delta_distance: 0,
                eld_connection: true,
                engine_hours: 0.1,
                is_live: el.online,
                odometer: el.odometer,
                rotation: 0,
                speed: el.speed,
                state: el.state,
                vehicleId: el.vehicleNumber
            },
            truckNo: el.vehicleId && el.vehicleNumber,
            lastPosition: {
                place: el && el.location,
                time: el && el.timestamp,
            },
            currentSpeed: el.speed && el.speed + " mph",
            eld: el.eld_mode ? "ELD" : el.elog_mode ? "E-LOG" : "",
            marker: el.coordinates && {
                iconDeg: 0,
                odometer: el.odometer,
                speed: el.speed,
                position: {
                    lat: el.coordinates?.lat ? parseFloat(el.coordinates.lat) : 0,
                    lng: el.coordinates?.lng ? parseFloat(el.coordinates.lng) : 0,
                },
            },
            times:{...el.times},
        });
        let onMapEl = firstUnits.find((fu) => fu.id === el.id);
        newUnits[i]["showOnMap"] = onMapEl ? onMapEl["showOnMap"] : !!el;
    });
    return newUnits;
};

export const getLogStatus = (status) => {
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
  