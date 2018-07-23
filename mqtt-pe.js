var mqtt = require('mqtt')
var publish_platform_event = 'Smart_Device_Event__e'
var subscribe_platform_event = 'Smart_Meter_Reading__e'
var jsforce = require('jsforce')
require('cometd-nodejs-client').adapt()
var http = require('http');
var lib = require('cometd')
var cometd = new lib.CometD()
var conn = new jsforce.Connection()

var options = {
    port: 19444,
    host: 'mqtt://mqttserver.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'user',
    password: 'pass',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
}


http.createServer(function (request, response) {  }).listen(process.env.PORT || 5000)

conn.login('salesforce@username.com', 'salesforce-password-token', function(err, res) {

    console.log(res)
    if(err) {
        console.log(err)
    }
    else {

        client = mqtt.connect('mqtt://mqttserver.com', options)

        client.on('connect', function () {
            client.subscribe(subscribe_platform_event)
            console.log("Connected to MQTT!")
        })

        client.on('message', function (topic, message) {
                // message is Buffer
                console.log(message.toString())
                var record = JSON.parse(message.toString());
                conn.sobject(subscribe_platform_event).create(record, function(err, ret){
                    if (err || !ret.success) { 
                        return console.error(err, ret)
                    }
                    console.log("Created record id : " + ret.id)
                  })
            })
            console.log(conn.instanceUrl)
            cometd.configure({
            url: conn.instanceUrl + '/cometd/40.0',
            requestHeaders: { 
                Authorization: 'OAuth ' + conn.accessToken
            },
            appendMessageTypeToURL: false
            })

            // handle the handshake's success
            cometd.handshake((shake) => {
            if(shake.successful) {
                // set your event here
                cometd.subscribe('/event/' + publish_platform_event, (message) => {
                    console.log("Got PE From Salesforce!")
                    console.log(JSON.stringify(message.data))
                    client.publish(publish_platform_event, JSON.stringify(message.data.payload))
                })
            } else {
                console.log('An error occurred!')
                console.log(shake)
            }
        })
    }
})

