package api

import (
	"fmt"
	"github.com/nomisrevol/iot-backend/internal/websocket"
	"net/http"
)

func setupRoutes(pool *websocket.Pool) {
	http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		fmt.Fprintf(writer, "Hello I'm here")
	})

	http.HandleFunc("/ws", func(writer http.ResponseWriter, request *http.Request) {
		websocket.ServeWS(pool, writer, request)
	})
}

func StartWebServer(pool *websocket.Pool) {
	setupRoutes(pool)
	http.ListenAndServe(":8080", nil)
}
