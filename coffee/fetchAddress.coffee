Fiber = require("fibers")
request    = require('request')
cheerio = require('cheerio')
_ = require("underscore")
fs = require('fs')
_data = fs.readFileSync('shopList.txt', 'utf-8')
shopList = _data.toString().split('\n')
shopList.pop() # split()した時に最後に空白行が出来るためpopで最後の要素を取り除く

  
sleep = (ms) ->
  fiber = Fiber.current
  setTimeout (->
    fiber.run()
    return
  ), ms
  Fiber.yield()
  return


Fiber(=>
  fetchAddress = ((shopList) ->
    for shop in shopList
      request(shop, (error, response, body) ->
        if not error and response.statusCode is 200
          $ = cheerio.load(body)
          addressSection = $("div#upper").find('table').find('tr').eq(1).find('td').eq(1).text().replace(/^\：/g, "")
          console.log "#{shop}, #{addressSection}"

      )

      sleep 5000
  )(shopList)
  
).run()  
