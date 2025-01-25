"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RegistrationForm from "./RegistrationForm";

const NavigationBar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center">
        <Image 
          src="/logo.svg" 
          alt="AQSentinel Logo" 
          width={75} 
          height={75}
          className="mr-2"
        />
        <h1 className="text-xl font-bold">AQSentinel</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Register Device</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Device</DialogTitle>
            </DialogHeader>
            <RegistrationForm />
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default NavigationBar;
