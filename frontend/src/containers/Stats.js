import React from "react";
import DataChart from "../components/DataChart";
import Weather from "../components/Weather";
import { connect } from "../api";

const COLOR_LIST = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"];

const initTemperatureData = {
  "value": [],
  "sensorName": "sensor 1",
  "color": COLOR_LIST[0]
};

class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: [{...initTemperatureData}],
      humidity: [{...initTemperatureData}],
      timestamp: []
    }
  }

  componentDidMount() {
    connect((message) => {
      const jsonData = JSON.parse(message.data);
      // only update when type is 2 - update with value from sensor
      if (parseInt(jsonData["type"]) !== 2) return;
      const newData = JSON.parse(jsonData["body"]);
      const sensorName = newData["name"];
      const current = new Date();
      let sensorTempOldData = this.state.temperature.filter(data => data.sensorName === sensorName)[0];
      sensorTempOldData["value"].push(newData["temp"]);
      sensorTempOldData["value"] = sensorTempOldData["value"].slice(-15);

      let sensorHumdOldData = this.state.humidity.filter(data => data.sensorName === sensorName)[0];
      sensorHumdOldData["value"].push(newData["humd"]);
      sensorHumdOldData["value"] = sensorHumdOldData["value"].slice(-15);
      
      this.setState({
        temperature: [...this.state.temperature.filter(data => data.sensorName !== sensorName), sensorTempOldData],
        humidity: [...this.state.humidity.filter(data => data.sensorName !== sensorName), sensorHumdOldData],
        timestamp: [...this.state.timestamp, current.toLocaleTimeString()].slice(-15)
      })
    });
  }

  render() {
    const { temperature, humidity, timestamp } = this.state;
    return (
      <div className="tab-container">
      <DataChart header="Temperature" data={temperature} timestamp={timestamp} />
      <DataChart header="Humidity" data={humidity} timestamp={timestamp} />
      <Weather />
    </div>
    );
  }
};

export default Stats;
  