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
import { OrderForm } from "./OrderForm";
import { Plus } from "lucide-react";
import { revalidateDataUser } from "@/lib/$data_api";

const CreateOrderButton = ({ houses }: any) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    revalidateDataUser();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          Создать заявку
          <Plus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать заявку</DialogTitle>
          <DialogDescription>Укажите необходимые параметры</DialogDescription>
        </DialogHeader>
        <OrderForm onSuccessClose={handleSuccess} housesData={houses} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderButton;
