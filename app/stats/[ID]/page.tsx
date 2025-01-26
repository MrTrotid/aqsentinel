"use client";

import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PageProps {
  params: Promise<{
    ID: string;
  }>;
}

interface ReadingData {
  time?: string;
  day?: string;
  temperature: number;
  humidity: number;
  aqi: number;
  gases: {
    co: number; // Carbon Monoxide (ppm)
    alcohol: number; // (ppm)
    co2: number; // Carbon Dioxide (ppm)
    toluene: number; // (ppm)
    nh4: number; // Ammonia (ppm)
    acetone: number; // (ppm)
    lpg: number; // Liquefied Petroleum Gas (ppm)
    ch4: number; // Methane (ppm)
  };
}

// Update time generation function
const generateTimeData = () => {
  const now = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const time = new Date(now.getTime() - (29 - i) * 1000);
    return format(time, "mm:ss");
  });
};

const generateGasData = () => ({
  co: Math.random() * 50, // 0-50 ppm
  alcohol: Math.random() * 100, // 0-100 ppm
  co2: 400 + Math.random() * 1000, // 400-1400 ppm
  toluene: Math.random() * 20, // 0-20 ppm
  nh4: Math.random() * 25, // 0-25 ppm
  acetone: Math.random() * 30, // 0-30 ppm
  lpg: Math.random() * 1000, // 0-1000 ppm
  ch4: Math.random() * 1000, // 0-1000 ppm
});

const deviceData = {
  hourlyReadings: Array.from({ length: 30 }, (_, i) => {
    const times = generateTimeData();
    return {
      time: times[i],
      temperature: 20 + Math.random() * 5,
      humidity: 45 + Math.random() * 10,
      aqi: 45 + Math.random() * 10,
      gases: generateGasData(),
    };
  }) as ReadingData[],
  dailyAverages: [
    { day: "Mon", temperature: 24, humidity: 47, aqi: 51 },
    { day: "Tue", temperature: 23, humidity: 46, aqi: 50 },
    { day: "Wed", temperature: 25, humidity: 48, aqi: 53 },
    { day: "Thu", temperature: 24, humidity: 45, aqi: 49 },
    { day: "Fri", temperature: 26, humidity: 44, aqi: 52 },
  ] as ReadingData[],
};

export default function StatsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const [temperatureData, setTemperatureData] = useState(
    deviceData.hourlyReadings
  );
  const [humidityData, setHumidityData] = useState(deviceData.hourlyReadings);
  const [aqiData, setAqiData] = useState(deviceData.hourlyReadings);
  const [gasData, setGasData] = useState(deviceData.hourlyReadings);

  // Update useEffect intervals
  useEffect(() => {
    const intervals = [
      setInterval(() => {
        const newTime = format(new Date(), "mm:ss");

        // Update temperature
        setTemperatureData((prev) => {
          const newData = [
            ...prev.slice(1),
            {
              time: newTime,
              temperature: 20 + Math.random() * 5,
              humidity: prev[prev.length - 1].humidity,
              aqi: prev[prev.length - 1].aqi,
              gases: prev[prev.length - 1].gases,
            },
          ];
          return newData;
        });
      }, 5000),

      setInterval(() => {
        const newTime = format(new Date(), "mm:ss");

        // Update humidity
        setHumidityData((prev) => {
          const newData = [
            ...prev.slice(1),
            {
              time: newTime,
              temperature: prev[prev.length - 1].temperature,
              humidity: 45 + Math.random() * 10,
              aqi: prev[prev.length - 1].aqi,
              gases: prev[prev.length - 1].gases,
            },
          ];
          return newData;
        });
      }, 5000),

      setInterval(() => {
        const newTime = format(new Date(), "mm:ss");

        // Update AQI
        setAqiData((prev) => {
          const newData = [
            ...prev.slice(1),
            {
              time: newTime,
              temperature: prev[prev.length - 1].temperature,
              humidity: prev[prev.length - 1].humidity,
              aqi: 45 + Math.random() * 10,
              gases: prev[prev.length - 1].gases,
            },
          ];
          return newData;
        });
      }, 5000),

      setInterval(() => {
        const newTime = format(new Date(), "mm:ss");

        // Update gases
        setGasData((prev) => {
          const newData = [
            ...prev.slice(1),
            {
              time: newTime,
              temperature: prev[prev.length - 1].temperature,
              humidity: prev[prev.length - 1].humidity,
              aqi: prev[prev.length - 1].aqi,
              gases: generateGasData(),
            },
          ];
          return newData;
        });
      }, 5000),
    ];

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Device Stats: {unwrappedParams.ID}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Graph */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Temperature Readings</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <XAxis
                  dataKey="time"
                  interval="preserveStartEnd"
                  // Remove date parsing, display time string directly
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff4444"
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity Graph */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Humidity Readings</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={humidityData}>
                <XAxis
                  dataKey="time"
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#0088FE"
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AQI Graph */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">AQI Readings</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aqiData}>
                <XAxis
                  dataKey="time"
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="aqi"
                  stroke="#00C49F"
                  name="AQI"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gases Found */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Gases Found (ppm)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gasData}>
                <XAxis
                  dataKey="time"
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gases.co"
                  stroke="#FF0000"
                  name="CO"
                />
                <Line
                  type="monotone"
                  dataKey="gases.alcohol"
                  stroke="#00FF00"
                  name="Alcohol"
                />
                <Line
                  type="monotone"
                  dataKey="gases.co2"
                  stroke="#0000FF"
                  name="CO₂"
                />
                <Line
                  type="monotone"
                  dataKey="gases.toluene"
                  stroke="#FF00FF"
                  name="Toluene"
                />
                <Line
                  type="monotone"
                  dataKey="gases.nh4"
                  stroke="#FFFF00"
                  name="NH₄"
                />
                <Line
                  type="monotone"
                  dataKey="gases.acetone"
                  stroke="#00FFFF"
                  name="Acetone"
                />
                <Line
                  type="monotone"
                  dataKey="gases.lpg"
                  stroke="#FFA500"
                  name="LPG"
                />
                <Line
                  type="monotone"
                  dataKey="gases.ch4"
                  stroke="#800080"
                  name="CH₄"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
