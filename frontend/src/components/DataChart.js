import {Card} from "@blueprintjs/core";
import {Line} from "react-chartjs-2";

const produceChartData = (rawData) => {
  return rawData.map((data) => ({
    data: data.value,
    label: data.sensorName,
    fill: false,
    borderColor: data.color
  }));
};

export default function DataChart({header, data, timestamp}) {
  return (
    <Card style={{marginBottom: 20}}>
      <Line
        height={100}
        data={{
          labels: timestamp,
          datasets: produceChartData(data),
        }}
        options={{
          title: {
            display: true,
            text: header,
            fontSize: 25
          },
          legend: {
            display: true,
            position: "bottom"
          }
        }}
      />
    </Card>
  );
}
