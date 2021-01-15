#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 26
#define DHTTYPE DHT11

const char* ssid = "MINH NGA";
const char* password = "0976652487";
const char* mqtt_server = "35.220.237.143";

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

long lastMsg = 0;
char msg[50];

float temperature = 0;
float humidity = 0;

float last_temp = 0;
float last_humd = 0;

void setup() {
  Serial.begin(115200);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  dht.begin();
}

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  if (String(topic) == "esp32/output") {
    Serial.print("Changing output to ");
    if(messageTemp == "on"){
      Serial.println("on");
    }
    else if(messageTemp == "off"){
      Serial.println("off");
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("esp32/output");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;

    temperature = dht.readTemperature();
    humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read data from sensor!");
      return;
    }

    if (temperature != last_temp) {
      dtostrf(temperature, 1, 2, msg);
      Serial.print("Temperature: ");
      Serial.println(msg);
      client.publish("sensor-data/temperature", msg);
      last_temp = temperature;
    }
    
    if (humidity != last_humd) {
      dtostrf(humidity, 1, 2, msg);
      Serial.print("Humidity: ");
      Serial.println(humidity);
      client.publish("sensor-data/humidity", msg);  
      last_humd = humidity;
    }
  }
}
