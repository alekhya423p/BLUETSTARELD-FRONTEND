export const getDistance = (p1, p2) => {
    if (window.google && window.google.maps) {
        return window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(p1), new window.google.maps.LatLng(p2)
        )
    }
}

export const distance = (lat1, lon1, lat2, lon2, unit) => {
	if ((lat1 === lat2) && (lon1 === lon2)) {
		return 0;
	}else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit==="K") { dist = dist * 1.609344 }
		if (unit==="N") { dist = dist * 0.8684 }
		return Math.round(dist ,2);
	}
}

export const getPolylines = (polyline = []) => {
    let all = polyline;
    let small = [];
    let large = [];
    let start = 0;
    all.forEach((pol, index) => {
        if (index + 1 <= all.length - 1) {
            if (getDistance(pol, all[index + 1]) > 1000) {
                let arr = [];
                if (index > 0) {
                    for (let i = start; i <= index; i++) {
                        arr.push(all[i]);
                    }
                    small.push(arr);
                }
                large.push([pol, all[index + 1]]);
                start = index + 1;
                // 0 1, 22 23, 52 53
            }
        }
    });
    if (start < all.length - 1) {
        let arr = [];
        for (let i = start; i <= all.length - 1; i++) {
            arr.push(all[i])
        }
        small.push(arr);
    }
    return {
        small,
        large
    }
}


// asset location
export const getLocations = (vehicles) => {
    let firstUnits = JSON.parse(localStorage.getItem("firstUnits")) || [];
    let newUnits = [];
    vehicles.locations.forEach((el, i) => {
        const odometer = el.odometer && el.odometer !== -1 ? `${el.odometer}` : "N/A";
        newUnits.push({
            id: vehicles.id,
            status: el.eventCode ? el.eventCode : "",
            fuelLevel: el.fuelLevel,
            state: el.state,
            tracking: {
                coordinates: {...el.coordinates},
                date: el.eventDate,
                delta_distance: 0,
                engine_hours: 0.1,
                odometer: odometer,
                rotation: 0,
                speed: el.speed,
                state: el.state,
                vehicleId: vehicles.vehicleNumber
            },
            truckNo: vehicles.vehicleId && vehicles.vehicleNumber,
            truckId: vehicles.vehicleId,
            lastPosition: {
                place: el && el.location,
                time: el && el.eventDate,
            },
            currentSpeed: el.speed && el.speed + " mph",
            marker: el.coordinates && {
                iconDeg: 0,
                odometer,
                speed: el.speed,
                position: {
                   lat: parseFloat(el.coordinates.lat),
                   lng: parseFloat(el.coordinates.lng),
                },
            },
        });
        let onMapEl = firstUnits.find((fu) => fu.id === el.id);
        newUnits[i]["showOnMap"] = onMapEl ? onMapEl["showOnMap"] : !!el;
    });
    return newUnits;
  };