package websocket

import (
	"fmt"
	"github.com/nomisrevol/iot-backend/utils"
	"log"
)

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	lastMsg := Message{}
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			for i := 0; i < 10 && len(client.ID) == 0; i++ {
				client.ID, _ = utils.GetRandomClientId()
			}
			log.Println("New client just come with id =", client.ID)
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(lastMsg)
			}
			break

		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			log.Printf("Client %s closed connection\n", client.ID)
			break

		case message := <-pool.Broadcast:
			log.Println("Broadcasting new data: ", message)
			lastMsg = message
			for client, _ := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
