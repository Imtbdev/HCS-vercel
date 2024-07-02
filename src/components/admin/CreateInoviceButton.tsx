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
import { Plus } from "lucide-react";
import { InvoiceForm } from "./InvoiceForm";
import { revalidateData } from "@/lib/$data_api";

const CreateInvoiceButton = ({ housesData, token }: any) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    revalidateData();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          Выставить счёт
          <Plus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Выставить счёт</DialogTitle>
          <DialogDescription>Укажите необходимые параметры</DialogDescription>
        </DialogHeader>
        <InvoiceForm
          housesData={housesData}
          onSuccessClose={handleSuccess}
          userToken={token}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceButton;
