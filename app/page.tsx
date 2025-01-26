"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfiguredSWR } from "@/lib/utils";
import { RegisteredDeviceResponse } from "@/types/RegisteredDeviceResponse";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useConfiguredSWR<
    RegisteredDeviceResponse[]
  >("/api/registered_devices");

  // Safely handle devices data
  let devices = data || [];
  if ((devices as any).error) {
    devices = [];
  }

  const filteredDevices = devices.filter((device) => {
    const searchLower = searchTerm.toLowerCase();
    const deviceName = device.device.device_name?.toLowerCase() || "";
    const deviceId = String(device.device.device_id) || "";
    const deviceLocation = device.device.device_location?.toLowerCase() || "";

    return (
      deviceName.includes(searchLower) ||
      deviceId.includes(searchLower) ||
      deviceLocation.includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Failed to load devices. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="mt-4">
                      <Skeleton className="h-5 w-1/2 mb-2" />
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-16 rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {devices.length === 0
                    ? "No devices registered yet"
                    : "No devices found matching your search"}
                </p>
              </div>
            ) : (
              filteredDevices.map((device) => (
                <Link
                  href={`/stats/${device.device.id}`}
                  key={device.device.id}
                  className="block transition-transform hover:scale-105"
                >
                  <Card className="mb-4">
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          {device.device.device_name || "Unnamed Device"}
                        </h3>
                        <p>
                          <span className="font-semibold">Device ID:</span>{" "}
                          {device.device.device_id || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Location:</span>{" "}
                          {device.device.device_location || "No location set"}
                        </p>
                        <div className="mt-4">
                          <p className="font-semibold mb-2">
                            Current Readings:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-gray-100 rounded">
                              <p className="text-sm text-gray-600">
                                Temperature
                              </p>
                              <p className="font-medium">
                                {device.latest_data?.temperature || "N/A"}°C
                              </p>
                            </div>
                            <div className="text-center p-2 bg-gray-100 rounded">
                              <p className="text-sm text-gray-600">Humidity</p>
                              <p className="font-medium">
                                {device.latest_data?.humidity || "N/A"}%
                              </p>
                            </div>
                            <div className="text-center p-2 bg-gray-100 rounded">
                              <p className="text-sm text-gray-600">AQI</p>
                              <p className="font-medium">
                                {device.latest_data?.aqi_label || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
