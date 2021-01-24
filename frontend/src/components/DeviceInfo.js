import {Button, Card, Elevation, Intent, Text} from "@blueprintjs/core";
import {useState} from "react";

export default function DeviceInfo({id, description, status, name, handleDelete}) {
  const [currentStatus, setCurrentStatus] = useState(status);

  const changeStatus = () => {
    setCurrentStatus(1 - currentStatus);
  };

  return (
    <Card className="device-card" elevation={Elevation.TWO}>
      <div>
        <h3 style={{display: "inline-block"}}>Device Id: {id}</h3>
        <Button icon={"small-cross"} style={{float: "right"}} minimal={true} onClick={handleDelete}/>
      </div>

      <h3>Device Name: {name}</h3>
      <Text title={"Description"} ellipsize={true}>{description}</Text>
      <Button
        small={true}
        intent={Intent.PRIMARY}
        text={currentStatus === 1 ? "ON" : "OFF"} onClick={changeStatus}
      />
    </Card>
  );
}
