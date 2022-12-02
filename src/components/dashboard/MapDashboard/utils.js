export const randomGeo = (center, radius = 200000) => {
    // const center = { lat: 33.8160679, lng: -117.9225314 }
    var y0 = center.lat;
    var x0 = center.lng;
    var rd = radius / 111300; //about 111300 meters in one degree

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    var newlat = y + y0;
    var newlon = x + x0;

    return {
        'lat': +newlat.toFixed(5),
        'lng': +newlon.toFixed(5),
    };
}