(function() {
  var BASEURL, Fiber, OUTPUTPARAMETER, cheerio, conf, fs, querystring, request, shopList, sleep, _data;

  Fiber = require("fibers");

  request = require('request');

  cheerio = require('cheerio');

  conf = require('config');

  fs = require('fs');

  querystring = require("querystring");

  _data = fs.readFileSync('address.json', 'utf-8');

  shopList = JSON.parse(_data);

  sleep = function(ms) {
    var fiber;
    fiber = Fiber.current;
    setTimeout((function() {
      fiber.run();
    }), ms);
    Fiber["yield"]();
  };

  BASEURL = "http://geo.search.olp.yahooapis.jp/OpenLocalPlatform/V1/geoCoder?appid=" + conf.yahoodeveloper.appid;

  OUTPUTPARAMETER = "&output=json";

  Fiber((function(_this) {
    return function() {
      var fetchGeocode;
      return fetchGeocode = (function(items) {
        var item, queryparam, url, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          queryparam = "&query=" + (querystring.escape(item.address));
          url = BASEURL + OUTPUTPARAMETER + queryparam;
          request(url, function(error, response, body) {
            var coordinates, json, lat, long;
            if (!error && response.statusCode === 200) {
              json = JSON.parse(body);
              coordinates = json.Feature[0].Geometry.Coordinates.split(",");
              lat = coordinates[1];
              long = coordinates[0];
              return console.log("" + item.url + ", " + item.address + ", " + lat + ", " + long);
            }
          });
          _results.push(sleep(500));
        }
        return _results;
      })(shopList);
    };
  })(this)).run();

}).call(this);
