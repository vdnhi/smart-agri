import React from "react";
import "./App.css";

import { connect, sendMessage } from "./api";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: 10,
      temperatureColor: "cold",
      humidity: 22
    }
  }

  componentDidMount() {
    connect((message) => {
      const jsonData = JSON.parse(message.data);
      // only update when type is 2 - update with value from sensor
      if (parseInt(jsonData["type"]) !== 2) return;
      const newData = JSON.parse(jsonData["body"]);
      let newTemperatureColor = "neutral";
      if (newData["temp"] >= 27) {
        newTemperatureColor = "hot";
      } else if (newTemperatureColor["temp"] <= 15) {
        newTemperatureColor = "cold";
      }
      this.setState({
        temperature: newData["temp"],
        humidity: newData["humd"],
        temperatureColor: newTemperatureColor
      });
    });
  }

  send() {
    sendMessage("hello");
  }

  render() {
    const {
      temperature,
      temperatureColor,
      humidity
    } = this.state;
    return (
      <div className="app-realtime">
        <div className="app-container">
          <div className="temperature-display-container">
            <div className={`temperature-display ${temperatureColor}`}>{temperature}°C</div>
          </div>
        </div>

        <div className="app-container">
          <div className="temperature-display-container">
            <div className={`temperature-display`}>{humidity}</div>
          </div>
        </div>
      </div>

    );
  }
}

export default App;