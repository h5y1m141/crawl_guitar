(function() {
  var Fiber, cheerio, fs, request, shopList, sleep, _, _data;

  Fiber = require("fibers");

  request = require('request');

  cheerio = require('cheerio');

  _ = require("underscore");

  fs = require('fs');

  _data = fs.readFileSync('shopList.txt', 'utf-8');

  shopList = _data.toString().split('\n');

  shopList.pop();

  sleep = function(ms) {
    var fiber;
    fiber = Fiber.current;
    setTimeout((function() {
      fiber.run();
    }), ms);
    Fiber["yield"]();
  };

  Fiber((function(_this) {
    return function() {
      var fetchAddress;
      return fetchAddress = (function(shopList) {
        var shop, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = shopList.length; _i < _len; _i++) {
          shop = shopList[_i];
          request(shop, function(error, response, body) {
            var $, addressSection;
            if (!error && response.statusCode === 200) {
              $ = cheerio.load(body);
              addressSection = $("div#upper").find('table').find('tr').eq(1).find('td').eq(1).text().replace(/^\：/g, "");
              return console.log("" + shop + ", " + addressSection);
            }
          });
          _results.push(sleep(5000));
        }
        return _results;
      })(shopList);
    };
  })(this)).run();

}).call(this);
