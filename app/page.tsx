"use client";

import { useState } from "react";
import Image from "next/image";
import RegistrationForm from "./components/RegistrationForm";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Device {
  device_name: string;
  device_id: string;
  location: string;
  metadata: {
    temperature: string;
    humidity: string;
    aqi: string;
  };
}

const dummyDevices: Device[] = [
  {
    device_name: "Living Room Sensor",
    device_id: "DEVICE-001",
    location: "Living Room",
    metadata: {
      temperature: "23°C",
      humidity: "45%",
      aqi: "Good",
    },
  },
  {
    device_name: "Bedroom Sensor",
    device_id: "DEVICE-002",
    location: "Bedroom",
    metadata: {
      temperature: "22°C",
      humidity: "50%",
      aqi: "Moderate",
    },
  },
  {
    device_name: "Kitchen Sensor",
    device_id: "DEVICE-003",
    location: "Kitchen",
    metadata: {
      temperature: "25°C",
      humidity: "60%",
      aqi: "Poor",
    },
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevices = dummyDevices.filter((device) =>
    Object.values({
      name: device.device_name,
      id: device.device_id,
      location: device.location,
    })
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Your Registered Devices</h1>

        <div className="w-full max-w-sm">
          <Input
            type="search"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <Card key={device.device_id}>
              <CardHeader>
                <CardTitle>{device.device_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Device ID:</span>{" "}
                    {device.device_id}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {device.location}
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Current Readings:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-gray-100 rounded">
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="font-medium">
                          {device.metadata.temperature}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-100 rounded">
                        <p className="text-sm text-gray-600">Humidity</p>
                        <p className="font-medium">
                          {device.metadata.humidity}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-100 rounded">
                        <p className="text-sm text-gray-600">AQI</p>
                        <p className="font-medium">{device.metadata.aqi}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
