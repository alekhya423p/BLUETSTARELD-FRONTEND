
import _ from 'lodash'
import geoLocation from './csvjson.json'
import * as geolib from 'geolib';

 
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


export const getNearByLocation = (lat, lon) => {
	let geoLocationList = JSON.parse(JSON.stringify(geoLocation.geoLocationList));
		geoLocationList = _.map(geoLocationList, (location)=>{
			location.distance = distance(lat, lon, location.Lat, location.Lon, 'M');
			return location; 
		})
    let distanceList = _.map(geoLocationList, (list)=>list.distance);
	let closetDistance = _.min(distanceList);
	let closetLocation = _.find(geoLocationList, { distance: closetDistance});
	return closetLocation
}
export const isoDateWithoutTimeZone = (date) => {
	if (date == null) return date;
	var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
	var correctDate = new Date(timestamp);
	return correctDate.toISOString();
  }

  export const getActiveLocation = (inputLng, inputLat) => {
	
	if (inputLng && inputLat) {
		let geoLocationList = JSON.parse(JSON.stringify(geoLocation.geoLocationList));
		geoLocationList = _.map(geoLocationList, (location) => {
			location.distance = distance(inputLat, inputLng, location.Lat, location.Lon, 'M');
			return location;
		})
		let distanceList = _.map(geoLocationList, (list) => list.distance);
		let closetDistance = _.min(distanceList);
		let closetLocation = _.find(geoLocationList, { distance: closetDistance });
		if (distanceList && closetDistance && closetLocation) {
			let result = geolib.getCompassDirection(
				{ latitude: closetLocation.Lat, longitude: closetLocation.Lon },
				{ latitude: inputLat, longitude: inputLng }
			);
			if (result && closetLocation) {
				return  `${closetLocation.distance} mi ${result} from ${closetLocation.City}, ${closetLocation.State}`;
			
			}
		} 
	}

}

  
  
  