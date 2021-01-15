package main

import (
	MQTT "github.com/eclipse/paho.mqtt.golang"
	"github.com/nomisrevol/iot-backend/api"
	"github.com/nomisrevol/iot-backend/config"
	"github.com/nomisrevol/iot-backend/internal/mqtt"
	"github.com/nomisrevol/iot-backend/internal/websocket"
	"log"
	"runtime"
	"sync"
)

func setupReceiveDataFromSensor(pool *websocket.Pool) (*MQTT.Client, error) {
	wsClient := &websocket.Client{Pool: pool}

	c, err := mqtt.Setup(config.MqttClientId, config.MqttBrokerHost, wsClient)
	if err != nil {
		return &c, err
	}

	mqtt.Subscribe(c, config.SensorTemperatureTopic)
	mqtt.Subscribe(c, config.SensorHumidityTopic)

	return &c, err
}

func main() {
	log.Println("Application is started...")
	defer log.Println("Application is shutting down...")

	runtime.GOMAXPROCS(2)
	var wg sync.WaitGroup
	wg.Add(2)

	mqttClient := new(MQTT.Client)
	pool := websocket.NewPool()
	go pool.Start()

	go func(c *MQTT.Client, pool *websocket.Pool) {
		defer wg.Done()
		c, err := setupReceiveDataFromSensor(pool)
		if err != nil {
			return
		}
	}(mqttClient, pool)

	go func(pool *websocket.Pool) {
		defer wg.Done()
		api.StartWebServer(pool)
	}(pool)

	wg.Wait()

	if _, err := mqtt.Unsubscribe(*mqttClient, config.SensorTemperatureTopic); err != nil {
		log.Println(err)
	}

	if _, err := mqtt.Unsubscribe(*mqttClient, config.SensorHumidityTopic); err != nil {
		log.Println(err)
	}

	(*mqttClient).Disconnect(250)
}
