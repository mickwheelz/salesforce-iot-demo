#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClientTools.h>

const char *ssid =  "dd-wrt";   
const char *pass =  "buttsecks";
 
const char *mqtt_server = "server.hostname.com";
const int mqtt_port = 19444;
const char *mqtt_user = "username";
const char *mqtt_pass = "pass";
const char *mqtt_client_name = "arduinoClient1"; 


WiFiClient espClient;
PubSubClient client(mqtt_server, mqtt_port, espClient);
PubSubClientTools mqtt(client);
SoftwareSerial swSer(D1,D2, false, 256);

String oldwatts;
int minuteWatts;

void setup() {
  Serial.begin(115200);
  swSer.begin(115200);
  
  Serial.println("Connecting to WiFi");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Connected");

  // Connect to MQTT
  Serial.println("Connecting to MQTT");
  if (client.connect("ESP8266Client", mqtt_user, mqtt_pass)) {
    Serial.println("Connected to MQTT");
    mqtt.subscribe("Smart_Device_Event__e", mqtt_subscriber);
  } else {
    Serial.println("Connection failed, rc=" + client.state());
  }
}

void publishWatts() {
  String watts = swSer.readStringUntil('\n');
  if(watts.length() > 0 && watts != oldwatts) {
    DynamicJsonBuffer jsonBuffer(256);
    JsonObject& root = jsonBuffer.createObject();
    root["Device_Id__c"] = String(ESP.getChipId());
    root["Reading__c"] = watts;//123.43;
    root["Type__c"] = "normal";
    String data;
    root.printTo(data);
    root.printTo(Serial);
    mqtt.publish("Smart_Meter_Reading__e", data);
    oldwatts = watts;
    minuteWatts = minuteWatts + watts.toInt();
  }
}

void loop() {
  client.loop();
  publishWatts();
}

void processPlatformEvent(String payload) {
  if(payload.length()  > 0) {
    const size_t bufferSize = JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(5) + 230;
    DynamicJsonBuffer jsonBuffer(bufferSize);
    JsonObject& root = jsonBuffer.parseObject(payload);
    DynamicJsonBuffer jsonOutputBuffer(200);
    JsonObject& output = jsonOutputBuffer.createObject();
    int value = root["Value__c"];
    const char* pinId = root["Pin_ID__c"];   
    output["pin"] = pinId;
    output["value"] = value;
    output.printTo(Serial);
    Serial.println();
    output.printTo(swSer);
    }
}

void mqtt_subscriber(String topic, String message) {
  Serial.println("Message arrived in function 1 ["+topic+"] "+message);
  processPlatformEvent(message);
  
}
