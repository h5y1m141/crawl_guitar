Fiber = require("fibers")
request    = require('request')
cheerio = require('cheerio')

sleep = (ms) ->
  fiber = Fiber.current
  setTimeout (->
    fiber.run()
    return
  ), ms
  Fiber.yield()
  return

items = [
  {"url":"http://www.j-guitar.com/instruments/search/page:1?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1"},
  {"url":"http://www.j-guitar.com/instruments/search/page:2?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1"},
  {"url":"http://www.j-guitar.com/instruments/search/page:3?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1"},    
  ]

Fiber(=>
  baseURL = "http://www.j-guitar.com/instruments/search/"
  queryParameter = "?data%5Bcid%5D=1&data%5Bdisplay_excluded_shops%5D=1&data%5Bdisplay_limit%5D=100&data%5Border%5D=opened+DESC"  
  for i in [1..4]
    target = baseURL + "page:#{i}" + queryParameter
    fetch = ((url) ->
      console.log "URL is #{url}"
      request(url, (error, response, body) ->
        if not error and response.statusCode is 200
          $ = cheerio.load(body)
          title = $("title").text()
          console.log title          
      )
    )(target)
    sleep 3000
).run(items)              

