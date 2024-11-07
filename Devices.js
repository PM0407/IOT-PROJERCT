import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Devices = ({ token }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/devices', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDevices(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDevices();
  }, [token]);

  const toggleDevice = async (device) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/devices/${device._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(devices.map(d => (d._id === data._id ? data : d)));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Devices</h2>
      {devices.map(device => (
        <div key={device._id}>
          <h3>{device.name} - {device.status ? 'On' : 'Off'}</h3>
          <button onClick={() => toggleDevice(device)}>Toggle</button>
        </div>
      ))}
    </div>
  );
};

export default Devices;
