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
      const dataType = parseInt(jsonData["type"]);
      if (dataType > 1) {
        const newData = parseFloat(jsonData["body"]).toFixed(2);
        switch (dataType) {
          case 2:
            let newTemperatureColor = "neutral";
            if (newData >= 27) {
              newTemperatureColor = "hot";
            } else if (newData <= 15) {
              newTemperatureColor = "cold";
            }
            this.setState({
              temperature: newData,
              temperatureColor: newTemperatureColor
            })
            break;
          case 3:
            this.setState({
              humidity: newData
            });
            break;
          default:
            break;
        }
      }
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