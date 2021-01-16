package mqtt

import (
	MQTT "github.com/eclipse/paho.mqtt.golang"
	"github.com/nomisrevol/iot-backend/internal/websocket"
	"github.com/nomisrevol/iot-backend/utils"
	"log"
)

func Setup(clientID, host string, wsClient *websocket.Client) (MQTT.Client, error) {
	opts := MQTT.NewClientOptions().AddBroker(host).SetClientID(clientID)

	var previousTemp float32 = 0.0
	var previousHumd float32 = 0.0

	var publishHandler MQTT.MessageHandler = func(client MQTT.Client, message MQTT.Message) {
		shouldBroadcast, err := utils.HandleNewSensorData(&previousTemp, &previousHumd, string(message.Payload()))
		if err != nil {
			log.Println(err)
			return
		}

		if shouldBroadcast {
			wsClient.Pool.Broadcast <- websocket.Message{
				Type: 2,
				Body: string(message.Payload()),
			}
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
