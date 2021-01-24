package device

import (
	"encoding/json"
	"io"
	"strconv"
)

type Info struct {
	Name        string `json:"name"`
	Id          string `json:"id"`
	Status      int    `json:"status"`
	Description string `json:"description"`
}

var fakeDatabase = []Info{
	{Name: "Demo Led", Id: "0", Status: 0, Description: "This is a led for demo project"},
}

func GetDevices() []Info {
	return fakeDatabase
}

func AddDevice(body *io.ReadCloser) (bool, error) {
	var device Info
	err := json.NewDecoder(*body).Decode(&device)
	if err != nil {
		return false, err
	}
	device.Id = strconv.Itoa(len(fakeDatabase))
	fakeDatabase = append(fakeDatabase, device)
	return true, nil
}
