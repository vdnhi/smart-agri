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

func DeleteDevice(body *io.ReadCloser) (bool, error) {
	var device Info
	err := json.NewDecoder(*body).Decode(&device)
	if err != nil {
		return false, err
	}
	for i, d := range fakeDatabase {
		if d.Id == device.Id {
			copy(fakeDatabase[i:], fakeDatabase[i+1:])
			fakeDatabase[len(fakeDatabase)-1] = Info{}
			fakeDatabase = fakeDatabase[:len(fakeDatabase)-1]
			return true, nil
		}
	}
	return false, nil
}
