var jquest = require('./')
var test = require('tape')

var url1 = "http://baconipsum.com/api/?type=meat-and-filler&paras=73&start-with-lorem=1"
var url2 = "http://lorem-ipsum.me/api/json?format=&type=essay"

test('baconipsum test', function(t){
  jquest(url1, function(err, obj){
    t.error(err, 'Should not error')
    t.ok(Array.isArray(obj), 'should be an array')
    t.equal(obj.length, 73, 'should be an array of length 73')
    t.equal(typeof obj[0], 'string', 'element 1 should be a string')
    t.end()
  })
})

test('lorem-ipsum.me test', function(t){
  jquest(url2, function(err, obj){
    t.error(err, 'should not err')
    t.equal(typeof obj,'object', 'should be an object')
    t.equal(Object.keys(obj).length, 1, 'should have a single key ')
    t.equal(Object.keys(obj)[0], 'text', 'should have a single key named text')
    t.equal(typeof obj.text, 'string', 'value should be a string')
    t.end()
  })
})
