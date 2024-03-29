import { useEffect, useState, useCallback } from "react";
import DeviceInfo from "../components/DeviceInfo";
import { AppToaster } from "../components/Toaster";

import {
  Dialog,
  Button,
  InputGroup,
  Intent,
  Classes,
  FormGroup,
  TextArea,
  Switch
} from "@blueprintjs/core";

const createDeviceInfoComponent = (data) => {
  return (
    <DeviceInfo
      id={data.id}
      description={data.description}
      status={data.status}
      name={data.name}
    />
  );
};

export default function DeviceController() {
  const [deviceList, setDeviceList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceEndpoint, setDeviceEndpoint] = useState("");
  const [deviceDescription, setDeviceDescription] = useState("");
  const [deviceStatus, setDeviceStatus] = useState(0);
  const [isAddingDevice, setIsAddingDevice] = useState(false);

  useEffect(() => {
    fetch("/device", {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'same-origin'
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      setDeviceList(data.map(device => createDeviceInfoComponent(device)));
    }).catch(function (error) {
      console.log(error);
    })
  }, []);

  const addNewDevice = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setDeviceName("");
    setDeviceEndpoint("");
    setDeviceDescription("");
    setIsOpen(false);
    setIsAddingDevice(false);
  };

  const validate = useCallback(() => {
    if (deviceName.length === 0 || deviceEndpoint.length === 0) return false;
    return true;
  }, [deviceEndpoint, deviceName]);

  const handleAddNewItem = () => {
    setIsAddingDevice(true);
    const isValid = validate();
    if (!isValid) {
      AppToaster.show({
        message: "Invalid information entered. Please check again!",
        intent: Intent.WARNING,
        timeout: 2000
      });
      setIsAddingDevice(false);
      return;
    }

    const newDevice = {
      "id": deviceList.length,
      "name": deviceName,
      "status": deviceStatus,
      "description": deviceDescription
    };
    setDeviceList([...deviceList, createDeviceInfoComponent(newDevice)]);
    setIsAddingDevice(false);
    handleClose();
  };

  return (
    <div className="tab-container">
      {deviceList}
      <div style={{textAlign: "center"}}>
      <Button 
        text="Add new device" 
        intent={Intent.PRIMARY} 
        onClick={addNewDevice} 
        large={true}
      />
      </div>

      <Dialog
        icon="info-sign"
        title="Add new device"
        isOpen={isOpen}
        onClose={handleClose}
      >
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label="Device Name"
            labelFor="text-input-name"
            labelInfo="(required)"
          >
            <InputGroup
              id="text-input-name"
              placeholder="Device name..."
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </FormGroup>
          <FormGroup
            label="URL Endpoint"
            labelFor="text-input-endpoint"
            labelInfo="(required)"
          >
            <InputGroup
              id="text-input-endpoint"
              placeholder="http://www.something.com"
              value={deviceEndpoint}
              onChange={(e) => setDeviceEndpoint(e.target.value)}
            />
          </FormGroup>
          <FormGroup
            label="Device Description"
            labelFor="text-input-description"
            labelInfo="(optional)"
          >
            <TextArea
              id="text-input-description"
              placeholder="Description..."
              style={{ width: "100%" }}
              value={deviceDescription}
              onChange={(e) => setDeviceDescription(e.target.value)}
            />
          </FormGroup>
          <FormGroup
            label="Status"
            labelFor="switch-input-status"
            inline={true}
          >
            <Switch
              innerLabelChecked="ON"
              innerLabel="OFF"
              checked={deviceStatus === 1}
              onChange={(e) => setDeviceStatus(1 - deviceStatus)}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              text="Add"
              intent={Intent.PRIMARY}
              onClick={handleAddNewItem}
              loading={isAddingDevice}
              large={true}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}