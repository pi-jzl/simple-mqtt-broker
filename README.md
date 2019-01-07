# simple-mqtt-broker

A simple mqtt broker that:

* accept all client connection
* broadcast everything to all clients
* connected mqtt client will subscribe to all topics, add logic to ignore non-subscribe topic if you can

Installation
-------

```sh
npm install -g simple-mqtt-broker
```


Start server
-------

```sh
mqtt-broker
```

Based on https://github.com/mqttjs/mqtt-connection