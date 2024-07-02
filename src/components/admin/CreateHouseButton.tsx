"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { HouseForm } from "./HouseForm";
import { Plus } from "lucide-react";
import { revalidateData } from "@/lib/$data_api";

const CreateHouseButton = () => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    revalidateData();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          Добавить объект
          <Plus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить объект</DialogTitle>
          <DialogDescription>Укажите необходимые параметры</DialogDescription>
        </DialogHeader>
        <HouseForm onSuccessClose={handleSuccess} actionType={"create"} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateHouseButton;
