var http = require('http')
var EventEmitter = require('events').EventEmitter
var snatch = require('snatch')
var inherits = require('inherits')
var parseUrl = require('url').parse
var https = false

try{https = require('https')}catch(e){}

inherits(Jquest, EventEmitter)

module.exports = jquest

function jquest(options, cb){
  return new Jquest(options, cb)
}

function Jquest(options, cb){
  this.data = null
  if(cb) {
    this.on('response', cb)
    this.on('error', cb)
  }

  this.request(options)

}

Jquest.prototype.request = function(options){

  if(typeof options == 'string')
    options = {url: options}

  if(options.url){
    var urlObj = parseUrl(options.url)
    for(var i in urlObj)
      options[i] = urlObj[i]
  }

  options.method = options.method || 'get'

  var core = http && options.protocol == 'https' ? https : http

  var request = core.request(options)

  var _this = this
  request.on('response', function(res){
    if(res.statusCode >= 200 && res.statusCode < 300){
      snatch(res, function(err, content){
        if(err) _this.emit('error', err)
        try{
          var obj = JSON.parse(content)
          _this.emit('response', null, obj)
        } catch(e){
          _this.emit('error', e)
        }
      })
    } else if(res.statusCode >= 300 && res.statsuCode < 400 && res.headers.location){
      //haven't tested this
      options.url = res.headers.location
      this.request(options)
    } else {
      _this.emit('error', new Error('Status code of ' + res.statusCode + ' not recognized'))
    }
  })

  request.on('error', function(e){
    _this.emit('error', e)
  })

  if(options.method == 'post' || options.method == 'put')
    if(!this.data)
      this.on('pipe', function(stream){
        snatch(stream, function(err, data){
          _this.data = data
        })
        stream.on('data', function(data){
          console.log(data)
          request.write(data)
        })

        stream.on('end', function(){
          request.end()
        })
      })
    else
      request.write(this.data), request.end()
  else
    request.end()
}
