Fiber = require("fibers")
request    = require('request')
cheerio = require('cheerio')
_ = require("underscore")
sleep = (ms) ->
  fiber = Fiber.current
  setTimeout (->
    fiber.run()
    return
  ), ms
  Fiber.yield()
  return


Fiber(=>
  result = []
  csvData = []
  baseURL = "http://www.j-guitar.com/instruments/search/"
  queryParameter = "?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1&data%5Bdisplay_limit%5D=100&data%5Border%5D=opened+DESC"

  for i in [1..20]
    target = baseURL + "page:#{i}" + queryParameter
    fetch = ((url) ->
      # console.log "URL is #{url}"
      request(url, (error, response, body) ->
        if not error and response.statusCode is 200
          $ = cheerio.load(body)
          title = $("title").text()
          rows = $("table.instruments").find('tr').nextAll()
          $(rows).each((i, element) ->
            title = $(element).find('td').find('p.ttl').text().replace(/^\s+/g, "") # replace(/^\s+/g・・・してるのはタイトル先頭に空白文字あるため
            productDetailPagePath = "http://www.j-guitar.com" + $(element).find('td.c').find('a').attr('href')
            price = $(element).find('td').find('p.price').text().replace(/^\s+/g, "").replace(/^￥/g, "").replace(/,/g, "")
            imagePath = $(element).find('td.c').find('a').find('img').attr('src')

            _model = $(element).find('td').eq(3).text().replace(/^\s+/g, "").split(/\年代|年/)

            if _model[0].match(/\d{4}/)
              yearType = _model[0]
              modelCondition = _model[1]
            else
              yearType = "不明"
              modelCondition = _model[0]
              
            storeInfoURL = "http://www.j-guitar.com" + $(element).find('td').eq(5).find('a').attr('href')



            
            if price is "ASK"
              price = 999999999
              
            result.push({
              title                 : title
              productDetailPagePath : productDetailPagePath
              price                 : price
              imagePath             : imagePath
              yearType              : yearType
              modelCondition        : modelCondition
              storeInfoURL          : storeInfoURL
            })
            console.log("
              #{title},
              #{productDetailPagePath},
              #{price},
              #{imagePath},
              #{yearType},
              #{modelCondition},
              #{storeInfoURL}
            ")

          )
      )
    )(target)
    sleep 4000

).run()
