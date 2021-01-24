package main

import (
	"log"
	"runtime"
	"sync"

	MQTT "github.com/eclipse/paho.mqtt.golang"
	"github.com/nomisrevol/iot-backend/api"
	"github.com/nomisrevol/iot-backend/config"
	"github.com/nomisrevol/iot-backend/internal/mqtt"
	"github.com/nomisrevol/iot-backend/internal/websocket"
)

func setupReceiveDataFromSensor(pool *websocket.Pool) (*MQTT.Client, error) {
	wsClient := &websocket.Client{Pool: pool}

	c, err := mqtt.Setup(config.MqttClientId, config.MqttBrokerHost, wsClient)
	if err != nil {
		return &c, err
	}

	mqtt.Subscribe(c, config.SensorTopic)

	return &c, err
}

func init() {
	log.SetFlags(log.Lshortfile | log.Ltime | log.LstdFlags)
	runtime.GOMAXPROCS(runtime.NumCPU())
}

func main() {
	log.Println("Application is started...")
	defer log.Println("Application is shutting down...")

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

	go func(pool *websocket.Pool, mqttClient *MQTT.Client) {
		defer wg.Done()
		api.StartWebServer(pool, mqttClient)
	}(pool, mqttClient)

	wg.Wait()

	if _, err := mqtt.Unsubscribe(*mqttClient, config.SensorTopic); err != nil {
		log.Println(err)
	}

	(*mqttClient).Disconnect(250)
}
