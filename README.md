# smart-agri

The project for course `Internet of Things` at Hanoi University of Science and Technology.

This project include 3 submodules:
- smart-agri/esp32-sensor: This module contains code that implemented for ESP32 sensor to connect with humidity and temperature sensor to retrieve data and send to MQTT broker. Each ESP32 module also is a lightweight HTTP server, provides API to other HTTP client in order to control functionality of devices (e.g. fans, led,...).
- smart-agri/backend: Backend responsible to subscribe data from MQTT broker and broadcast them via websocket to frontend. Backend also provides some API to do some functionality with devices (on/off, adjust something) via HTTP request.
- smart-agri/frontend: A simple frontend to show realtime temperature, humidity data and some buttons to control your devices.

TODO: Updating demo and screenshot.
