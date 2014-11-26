Fiber       = require("fibers")
request     = require('request')
cheerio     = require('cheerio')
conf        = require('config')
fs          = require('fs')
querystring = require("querystring")


_data = fs.readFileSync('address.json', 'utf-8')
shopList = JSON.parse(_data)



sleep = (ms) ->
  fiber = Fiber.current
  setTimeout (->
    fiber.run()
    return
  ), ms
  Fiber.yield()
  return

BASEURL = "http://geo.search.olp.yahooapis.jp/OpenLocalPlatform/V1/geoCoder?appid=#{conf.yahoodeveloper.appid}"
OUTPUTPARAMETER = "&output=json"
Fiber(=>
  fetchGeocode = ((items)->
    for item in items
      queryparam = "&query=#{querystring.escape(item.address)}"
      url = BASEURL + OUTPUTPARAMETER + queryparam
      request(url, (error, response, body) ->
        if not error and response.statusCode is 200
          json = JSON.parse(body)
          coordinates = json.Feature[0].Geometry.Coordinates.split(",")
          lat = coordinates[1]
          long = coordinates[0]
          console.log "#{item.url}, #{item.address}, #{lat}, #{long}"

      )

      sleep 500    
  )(shopList)
).run()  
