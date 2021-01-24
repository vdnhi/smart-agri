import {useCallback, useState} from "react";
import "./App.css";
import {Tab, Tabs} from "@blueprintjs/core";
import Stats from "./containers/Stats";
import DeviceController from "./containers/DeviceController";
import CameraMonitor from "./containers/CameraMonitor";

export default function App() {
  const [tabId, setTabId] = useState("ng");

  const handleTabChange = useCallback((navbarTabId) => {
    setTabId(navbarTabId);
  }, []);

  return (
    <Tabs id="TabsExample" onChange={handleTabChange} selectedTabId={tabId}>
      <Tab id="ng" title="Statistic" panel={<Stats/>}/>
      <Tab id="mb" title="Device Controller" panel={<DeviceController/>}/>
      <Tab id="rx" title="Camera Monitor" panel={<CameraMonitor/>}/>
    </Tabs>
  );
}
