import {Button, Card, Elevation, Intent} from "@blueprintjs/core";
import {useState} from "react";

export default function DeviceInfo({id, description, status, name}) {
  const [currentStatus, setCurrentStatus] = useState(status);

  const changeStatus = () => {
    setCurrentStatus(1 - currentStatus);
  };

  return (
    <Card className="device-card" elevation={Elevation.TWO}>
      <div>
        <h3 style={{display: "inline-block"}}>Id: {id}</h3>
        <button style={{float: "right"}}></button>
      </div>


      <h3>{name}</h3>
      <h4>{description}</h4>
      <Button
        small={true}
        intent={Intent.PRIMARY}
        text={currentStatus === 1 ? "ON" : "OFF"} onClick={changeStatus}
      />
    </Card>
  );
}
