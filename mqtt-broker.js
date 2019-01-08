#!/usr/bin/env node

var websocket = require('websocket-stream')
var WebSocketServer = require('ws').Server
var Connection = require('mqtt-connection')
var http = require('http')
const portNumber = 1883
var server = http.createServer().listen(portNumber)

var wss = new WebSocketServer({ server: server })

var client
var clients = []

wss.on('connection', function(ws) {
  var stream = websocket(ws)
  client = new Connection(stream)
  clients.push(client)
  addEventListener(client)
})

console.log(`simple-mqtt-broker is ready on ws://localhost:${portNumber}`)
console.log(`Test connection on http://www.hivemq.com/demos/websocket-client/ with Host:localhost and Port:${portNumber}`)

function addEventListener(client) {
  // handle the MQTT connection

  // client connected
  client.on('connect', function(packet) {
    console.log('client connected', packet.clientId)
    // acknowledge the connect packet
    client.connack({ returnCode: 0 })
  })

  // client pinged
  client.on('pingreq', function() {
    console.log('client pingreq')
    // send a pingresp
    client.pingresp()
  })

  client.on('publish', function(packet) {
    console.log('receive', packet.topic, packet.payload.toString())
    // loop through all existing clients and broadcast messages
    clients.forEach((clientX) =>{
      if (clientX.stream && clientX.stream.writable){
        clientX.publish(packet)
      }
    })
  })
}