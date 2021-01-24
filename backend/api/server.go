package api

import (
	"encoding/json"
	"fmt"
	MQTT "github.com/eclipse/paho.mqtt.golang"
	"github.com/nomisrevol/iot-backend/internal/device"
	"github.com/nomisrevol/iot-backend/internal/websocket"
	"github.com/nomisrevol/iot-backend/utils"
	"log"
	"net/http"
)

func setupRoutes(pool *websocket.Pool, mqttClient *MQTT.Client) {
	http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		fmt.Fprintf(writer, "Hello I'm here")
	})

	http.HandleFunc("/ws", func(writer http.ResponseWriter, request *http.Request) {
		websocket.ServeWS(pool, writer, request)
	})

	http.HandleFunc("/device", func(writer http.ResponseWriter, request *http.Request) {
		reqid, _ := utils.GetRandomClientId()
		switch request.Method {
		case http.MethodGet:
			log.Println("reqid=", reqid, "Getting devices list")
			devices := device.GetDevices()
			encodeJson := json.NewEncoder(writer)
			err := encodeJson.Encode(devices)
			if err != nil {
				log.Println(err)
				return
			}
		case http.MethodPost:
			log.Println("reqid=", reqid, "Updating device to database")
			ok, err := device.AddDevice(&request.Body)
			if !ok || err != nil {
				http.Error(writer, err.Error(), http.StatusBadRequest)
				log.Println(err)
				return
			}
			writer.WriteHeader(http.StatusOK)
		case http.MethodDelete:
			log.Println("reqid=", reqid, "Deleting device from database")
			ok, err := device.DeleteDevice(&request.Body)
			if !ok || err != nil {
				http.Error(writer, err.Error(), http.StatusBadRequest)
				log.Println(err)
				return
			}
			writer.WriteHeader(http.StatusOK)
		default:
			log.Println("Can't serve request with other method to endpoint /device")
		}
	})
}

func StartWebServer(pool *websocket.Pool, client *MQTT.Client) {
	setupRoutes(pool, client)
	http.ListenAndServe(":8080", nil)
}
