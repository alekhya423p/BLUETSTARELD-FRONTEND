// GET RECORD_STATUS 3 OVER 1
export const getVehicles = (vehicles, search) => {
    let firstUnits = JSON.parse(localStorage.getItem("firstUnits")) || [];
    let newUnits = [];
    vehicles.forEach((el, i) => {
        const odometr = 62141;
        // const odometr = el.tracking && el.tracking.odometr && el.tracking.odometr !== -1 ? `${el.tracking.odometr}` : "N/A";
        let fullname = (el.driverName).toLowerCase();
        newUnits.push({
            show: fullname.includes(search),
            id: el.id,
            status: el.eventCode ? getLogStatus(el.eventCode) : "",
            driver: el.driverName,
            fuelLevel: el.fuelLevel,
            coDriverName: el.coDriverName,
            coDriverId: el.coDriverId,
            coDriverEventCode: el.coDriverEventCode ? getLogStatus(el.coDriverEventCode) : "",
            state: el.state,
            vehicleStatus: el.vehicleStatus,
            heading: el.heading,
            tracking: {
                address: el.location,
                coordinates: {...el.coordinates},
                date: el.timestamp,
                delta_distance: 0,
                eld_connection: true,
                engine_hours: 0.1,
                is_live: el.online,
                odometr: 62141,
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
                odometr,
                speed: el.speed,
                vehicleStatus: el.vehicleStatus,
                heading: el.heading,
                position: {
                  lat: parseFloat(el.coordinates.lat),
                  lng: parseFloat(el.coordinates.lng),
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
        const odometr = 62141;
        // const odometr = el.tracking && el.tracking.odometr && el.tracking.odometr !== -1 ? `${el.tracking.odometr}` : "N/A";
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
                odometr: 62141,
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
                odometr,
                speed: el.speed,
                position: {
                    lat: parseFloat(el.coordinates.lat),
                    lng: parseFloat(el.coordinates.lng),
                },
            },
            times:{...el.times},
        });
        let onMapEl = firstUnits.find((fu) => fu.id === el.id);
        newUnits[i]["showOnMap"] = onMapEl ? onMapEl["showOnMap"] : !!el;
    });
    return newUnits;
};

export const getLogStatus = (eventCode) => {
    if (eventCode) {
      if (eventCode === 'DS_OFF') {
        return 'OFF';
      }
      if (eventCode === 'DS_SB') {
        return "SB";
      }
      if (eventCode === 'DS_D') {
        return 'D';
      }
      if (eventCode === 'DS_ON') {
        return 'ON';
      }
      if (eventCode === 'INTER_NORMAL_PRECISION') {
        return 'item';
      }
      if (eventCode === 'INTER_REDUCED_PERCISION') {
        return 'item';
      }
      if (eventCode === 'DR_IND_PC') {
        return 'PC';
      }
      if (eventCode === 'DR_IND_YM') {
        return 'YM';
      }
      if (eventCode === 'DR_LOGIN') {
        return 'LI';
      }
      if (eventCode === 'DR_LOGOUT') {
        return 'LO';
      }
      if (eventCode === 'ENG_UP_NORMAL') {
        return 'ENG_UP_NORMAL';
      }
      if (eventCode === 'ENG_UP_REDUCED') {
        return 'ENG_UP_REDUCED';
      }
      if (eventCode === 'ENG_DOWN_NORMAL') {
        return 'ENG_DOWN_NORMAL';
      }
      if (eventCode === 'ENG_DOWN_REDUCED') {
        return 'ENG_DOWN_REDUCED';
      }
      if (eventCode === 'ELD_MALF') {
        return 'ELD_MALF';
      }
      if (eventCode === 'ELD_MALF_CLEARED') {
        return 'ELD_MALF_CLEARED';
      }
      if (eventCode === 'ELD_DIAG') {
        return 'ELD_DIAG';
      }
      if (eventCode === 'ELD_DIAG_CLEARED') {
        return 'ELD_DIAG_CLEARED';
      }
    }
    return null;
  };
  