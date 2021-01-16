package utils

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"log"
)

func HandleNewSensorData(previousTemp, previousHumd *float32, newData string) (bool, error) {
	var sensorData SensorData
	err := json.Unmarshal([]byte(newData), &sensorData)
	if err != nil {
		return false, err
	}

	if sensorData.Temperature != *previousTemp || sensorData.Humidity != *previousHumd {
		*previousTemp = sensorData.Temperature
		*previousHumd = sensorData.Humidity
		return true, err
	}

	return false, err
}

func GetRandomClientId() (string, error) {
	// by default, client id length will be 6
	b := make([]byte, 6)
	_, err := rand.Read(b)
	if err != nil {
		log.Println(err)
		return "", err
	}

	return base64.URLEncoding.EncodeToString(b), err
}