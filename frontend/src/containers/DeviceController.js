import {useCallback, useEffect, useState} from "react";
import DeviceInfo from "../components/DeviceInfo";
import {AppToaster} from "../components/Toaster";

import {Button, Classes, Dialog, FormGroup, InputGroup, Intent, TextArea} from "@blueprintjs/core";
import {apiCall} from "../api";

const doDeleteDeviceRequest = (data) => {
  apiCall("DELETE", "/device", data).then(response => AppToaster.show({
    message: "Delete device successful",
    timeout: 1500,
    intent: "success"
  })).catch(error => {
    AppToaster.show({
      message: "Delete device unsuccessful",
      timeout: 1500,
      intent: "danger"
    })
    console.log(error)
  })
};

const createDeviceInfoComponent = (data) => {
  return (
    <DeviceInfo
      id={data.id}
      description={data.description}
      status={data.status}
      name={data.name}
      handleDelete={() => doDeleteDeviceRequest(data)}
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

    apiCall("POST", "/device", {
      "name": deviceName,
      "status": deviceStatus,
      "description": deviceDescription
    }).then((response) => {
      console.log(response)
      setDeviceList([...deviceList, createDeviceInfoComponent(newDevice)]);
      setIsAddingDevice(false);
      handleClose();
      AppToaster.show({
        message: "Created device " + deviceName + "!",
        intent: Intent.PRIMARY,
        timeout: 1500
      });
    }).catch(error => {
      AppToaster.show({
        message: "Can't update new device to database",
        intent: Intent.WARNING,
        timeout: 2000
      });
      setIsAddingDevice(false);
      console.log(error)
    })
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
              style={{width: "100%"}}
              value={deviceDescription}
              onChange={(e) => setDeviceDescription(e.target.value)}
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
