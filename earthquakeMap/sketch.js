var mapimg;

//variables to set latitude ------> (maps to y values|) and longitude ||| (maps to x values---)
//latitude on a flat map is 90 north | -90 south  longitude on a flat map is  -PI<---180 180--->PI
var clat = 0; //centre
var clon = 0;

//31.2304° N, 121.4737° E for Shanghai S & W are negative
//43.8014° N, 91.2396° W for LaCrosse
var lat = 31.2304;
var lon = 121.4737;

var laxlat = 43.8014;
var laxlon = -91.2396;

var ww = 1024;
var hh = 512;

var zoom = 1;


//GET map image from mapbox
function preload() {
    mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
        clat + ',' + clon + ',' + zoom + '/' +
        ww + 'x' + hh +
        '?access_token=pk.eyJ1IjoiY29kZWxheCIsImEiOiJjajB4YW85ZDAwMDZqMnFvMjV3aTJhcXBjIn0.BVg7IY6eSobwp413mNf6TQ');
    // earthquakes = loadStrings('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv');
    earthquakes = loadStrings('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');


}

//apply web mercator formula x y top left 0,0 bottom right 256,256

function mercX(lon) {
    lon = radians(lon) //degrees is from the observers perspective radians are from the movers.
    var a = (256 / PI) * pow(2, zoom); //mapbox uses tiles 512,512
    var b = lon + PI;
    return a * b;
}

function mercY(lat) {
    lat = radians(lat); //convert degrees into radians
    var a = (256 / PI) * pow(2, zoom);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
}

function setup() {
    ///           x     y
    createCanvas(1024, 512);
    //center the map to canvas
    //moves orgin point from top left to center
    translate(width / 2, height / 2);
    //draws image from center
    imageMode(CENTER);

    image(mapimg, 0, 0);

    // this is the center
    var cx = mercX(clon);
    var cy = mercY(clat);

    for (i = 0; i < earthquakes.length; i++) {
        var data = earthquakes[i].split(/,/); // regex
        //console.log(data);
        var lat = data[1];
        var lon = data[2];
        var mag = data[4]; //magnitude

        //mag is logarithmic.
        var x = mercX(lon) - cx;
        var y = mercY(lat) - cy;
        // inverse log
        mag = pow(10, mag);
        //square root to map to diameter
        mag = sqrt(mag);

        //creates new magmax
        var magmax = sqrt(pow(10, 10));
        //maps the mag range to a scale.
        var d = map(mag, 0, magmax, 0, 1000);

        stroke(255, 0, 255);
        fill(255, 255, 255, 200);
        ellipse(x, y, d, d);


    }


    // fill(255, 0, 255, 255);
    //Shanghai position relative to the center
    // var x = mercX(lon) - cx;
    // var y = mercY(lat) - cy;
    // ellipse(x, y, 10, 10);

    //LaCrosse
    noStroke();
    fill(255, 255, 255, 200);
    var lx = mercX(laxlon) - cx;
    var ly = mercY(laxlat) - cy;
    ellipse(lx, ly, 8, 8);
}
