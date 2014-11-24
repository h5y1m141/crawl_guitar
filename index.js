(function() {
  var Fiber, cheerio, request, sleep, _;

  Fiber = require("fibers");

  request = require('request');

  cheerio = require('cheerio');

  _ = require("underscore");

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
      var baseURL, csvData, fetch, i, queryParameter, result, target, _i, _results;
      result = [];
      csvData = [];
      baseURL = "http://www.j-guitar.com/instruments/search/";
      queryParameter = "?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1&data%5Bdisplay_limit%5D=100&data%5Border%5D=opened+DESC";
      _results = [];
      for (i = _i = 1; _i <= 20; i = ++_i) {
        target = baseURL + ("page:" + i) + queryParameter;
        fetch = (function(url) {
          return request(url, function(error, response, body) {
            var $, rows, title;
            if (!error && response.statusCode === 200) {
              $ = cheerio.load(body);
              title = $("title").text();
              rows = $("table.instruments").find('tr').nextAll();
              return $(rows).each(function(i, element) {
                var imagePath, modelCondition, price, productDetailPagePath, storeInfoURL, yearType, _model;
                title = $(element).find('td').find('p.ttl').text().replace(/^\s+/g, "");
                productDetailPagePath = "http://www.j-guitar.com" + $(element).find('td.c').find('a').attr('href');
                price = $(element).find('td').find('p.price').text().replace(/^\s+/g, "").replace(/^￥/g, "").replace(/,/g, "");
                imagePath = $(element).find('td.c').find('a').find('img').attr('src');
                _model = $(element).find('td').eq(3).text().replace(/^\s+/g, "").split(/\年代|年/);
                if (_model[0].match(/\d{4}/)) {
                  yearType = _model[0];
                  modelCondition = _model[1];
                } else {
                  yearType = "不明";
                  modelCondition = _model[0];
                }
                storeInfoURL = "http://www.j-guitar.com" + $(element).find('td').eq(5).find('a').attr('href');
                if (price === "ASK") {
                  price = 999999999;
                }
                result.push({
                  title: title,
                  productDetailPagePath: productDetailPagePath,
                  price: price,
                  imagePath: imagePath,
                  yearType: yearType,
                  modelCondition: modelCondition,
                  storeInfoURL: storeInfoURL
                });
                return console.log("" + title + ", " + productDetailPagePath + ", " + price + ", " + imagePath + ", " + yearType + ", " + modelCondition + ", " + storeInfoURL);
              });
            }
          });
        })(target);
        _results.push(sleep(4000));
      }
      return _results;
    };
  })(this)).run();

}).call(this);
