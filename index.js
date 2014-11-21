(function() {
  var Fiber, cheerio, items, request, sleep;

  Fiber = require("fibers");

  request = require('request');

  cheerio = require('cheerio');

  sleep = function(ms) {
    var fiber;
    fiber = Fiber.current;
    setTimeout((function() {
      fiber.run();
    }), ms);
    Fiber["yield"]();
  };

  items = [
    {
      "url": "http://www.j-guitar.com/instruments/search/page:1?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1"
    }, {
      "url": "http://www.j-guitar.com/instruments/search/page:2?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1"
    }, {
      "url": "http://www.j-guitar.com/instruments/search/page:3?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1"
    }
  ];

  Fiber((function(_this) {
    return function() {
      var baseURL, fetch, i, queryParameter, target, _i, _results;
      baseURL = "http://www.j-guitar.com/instruments/search/";
      queryParameter = "?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1&data%5Bdisplay_limit%5D=100&data%5Border%5D=opened+DESC";
      _results = [];
      for (i = _i = 1; _i <= 4; i = ++_i) {
        target = baseURL + ("page:" + i) + queryParameter;
        fetch = (function(url) {
          console.log("URL is " + url);
          return request(url, function(error, response, body) {
            var $, title;
            if (!error && response.statusCode === 200) {
              $ = cheerio.load(body);
              title = $("title").text();
              return console.log(title);
            }
          });
        })(target);
        _results.push(sleep(3000));
      }
      return _results;
    };
  })(this)).run(items);

}).call(this);
