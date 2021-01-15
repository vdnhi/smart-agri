package mqtt

import (
	MQTT "github.com/eclipse/paho.mqtt.golang"
	"github.com/nomisrevol/iot-backend/config"
	"github.com/nomisrevol/iot-backend/internal/websocket"
	"log"
)

func Setup(clientID, host string, wsClient *websocket.Client) (MQTT.Client, error) {
	opts := MQTT.NewClientOptions().AddBroker(host).SetClientID(clientID)

	var publishHandler MQTT.MessageHandler = func(client MQTT.Client, message MQTT.Message) {
		log.Printf("[DEBUG] Received message %s of topic: %s", message.Payload(), message.Topic())
		Publish(client, config.DeviceTopic, string(message.Payload()))

		messageType := 1
		switch message.Topic() {
		case config.SensorTemperatureTopic:
			messageType = 2
		case config.SensorHumidityTopic:
			messageType = 3
		}

		wsClient.Pool.Broadcast <- websocket.Message{
			Type: messageType,
			Body: string(message.Payload()),
		}
	}

	opts.SetDefaultPublishHandler(publishHandler)

	c := MQTT.NewClient(opts)
	var err error
	if token := c.Connect(); token.Wait() && token.Error() != nil {
		err = token.Error()
	}
	return c, err
}

func Subscribe(c MQTT.Client, topic string) (bool, error) {
	if token := c.Subscribe(topic, 0, nil); token.Wait() && token.Error() != nil {
		return false, token.Error()
	}
	return true, nil
}

func Publish(c MQTT.Client, topic, message string) {
	token := c.Publish(topic, 0, false, message)
	token.Wait()
}

func Unsubscribe(c MQTT.Client, topic string) (bool, error) {
	if token := c.Unsubscribe(topic); token.Wait() && token.Error() != nil {
		return false, token.Error()
	}
	return true, nil
}
