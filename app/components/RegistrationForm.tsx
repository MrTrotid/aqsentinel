"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QrCode } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  device_name: z.string(),
  location: z.string(),
  device_id: z.string(),
});

const RegistrationForm = () => {
  const deviceIds = ["DEVICE-001", "DEVICE-002", "DEVICE-003", "DEVICE-004"];
  const [isQrScanned, setIsQrScanned] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scannedValue, setScannedValue] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      device_name: "",
      location: "",
      device_id: "",
    },
    shouldUnregister: false, // Prevent field unregistering
  });

  // Keep track of scanned value
  useEffect(() => {
    if (scannedValue) {
      form.setValue("device_id", scannedValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [scannedValue, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleQrScan = (result: string | null) => {
    if (result) {
      setScannedValue(result);
      setIsQrScanned(true);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white rounded-lg shadow-sm "
        >
          <FormField
            control={form.control}
            name="device_id"
            render={({ field }) => {
              console.log("Field value:", field.value); // Debug log
              return (
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
                      <DialogContent className="w-fit h-fit">
                        <DialogHeader>
                          <DialogTitle>Scan QR Code</DialogTitle>
                        </DialogHeader>

                        <Scanner
                          onScan={(result) => {
                            if (result) {
                              handleQrScan(result[0].rawValue);
                            }
                          }}
                          styles={{
                            container: {
                              width: "400px",
                              height: "400px",
                            },
                            video: {
                              width: "400px",
                              height: "400px",
                              objectFit: "contain",
                            },
                          }}
                          allowMultiple={false}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Select
                    value={field.value || scannedValue}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setScannedValue(value);
                    }}
                    disabled={isQrScanned}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {field.value || "Select a device ID"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deviceIds.map((id) => (
                        <SelectItem key={id} value={id}>
                          {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
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
                  <Input type="string" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
