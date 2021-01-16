package test

import (
	"fmt"
	"github.com/nomisrevol/iot-backend/config"
	"github.com/nomisrevol/iot-backend/internal/mqtt"
	"github.com/nomisrevol/iot-backend/internal/websocket"
	"log"
	"testing"
)

func TestPublishData(t *testing.T) {
	pool := websocket.NewPool()
	go pool.Start()

	wsSocket := &websocket.Client{Pool: pool}
	c, err := mqtt.Setup(config.MqttClientId, config.MqttBrokerHost, wsSocket)
	if err != nil {
		fmt.Println(err)
	}

	for i := 0; i < 10; i++ {
		log.Println("Publishing the data at: ", i)
		mqtt.Publish(c, config.SensorTopic, "abcdef")
	}
}