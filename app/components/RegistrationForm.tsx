"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL, useConfiguredSWR } from "@/lib/utils";
import { Model } from "@/types/Device";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  device_name: z.string().min(1, "Device name is required"),
  location: z.string().min(1, "Location is required"),
  device_id: z.string().min(1, "Device ID is required"),
});

const RegistrationForm = () => {
  const {
    data: devices,
    error,
    isLoading,
  } = useConfiguredSWR<Array<Model>>("/api/potential_devices");
  const [isQrScanned, setIsQrScanned] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scannedValue, setScannedValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      device_name: "",
      location: "",
      device_id: "",
    },
  });

  useEffect(() => {
    if (scannedValue) {
      form.setValue("device_id", scannedValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [scannedValue, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      console.log(values);
      const response = await fetch(API_URL + "/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: Number(values.device_id),
          device_name: values.device_name,
          device_location: values.location,
        }),
      });

      if (!response.ok) throw new Error("Registration failed");
      // Handle successful registration
      form.reset();
      setScannedValue("");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleQrScan = (result: string | null) => {
    if (result && devices) {
      const device = devices.find(
        (model) => String(model.device_id) === result
      );
      if (device) {
        setScannedValue(String(device.device_id));
        setIsQrScanned(true);
        setIsDialogOpen(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white rounded-lg shadow-sm"
        >
          <FormField
            control={form.control}
            name="device_id"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-semibold">
                    Device ID
                  </FormLabel>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" type="button">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Scan QR Code</DialogTitle>
                      </DialogHeader>
                      <div className="aspect-square w-full relative rounded-lg overflow-hidden border">
                        <Scanner
                          onScan={(result) => {
                            if (result) {
                              handleQrScan(result[0].rawValue);
                            }
                          }}
                          styles={{
                            container: {
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                            },
                            video: {
                              objectFit: "cover",
                            },
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select
                  value={scannedValue}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setScannedValue(value);
                  }}
                  disabled={isQrScanned || isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a device ID">
                        {scannedValue
                          ? `Device ${scannedValue}`
                          : "Select a device"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading && (
                      <SelectItem value="loading" disabled>
                        Loading devices...
                      </SelectItem>
                    )}
                    {error && (
                      <SelectItem value="error" disabled>
                        Error loading devices
                      </SelectItem>
                    )}
                    {Array.isArray(devices) &&
                      devices?.map((device) => (
                        <SelectItem
                          key={device.id}
                          value={String(device.device_id)}
                        >
                          Device {device.device_id}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other form fields */}
          <FormField
            control={form.control}
            name="device_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Device Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Device Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoading || !devices}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
