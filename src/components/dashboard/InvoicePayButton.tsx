"use client";

import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useState } from "react";
import { revalidateDataUser } from "@/lib/$data_api";
import { useToast } from "../ui/use-toast";

interface InvoicePayButtonProps {
  id: number;
}

export const InvoicePayButton: React.FC<InvoicePayButtonProps> = ({ id }) => {
  const { data: session } = useSession();
  const token = session?.user.token;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleClick() {
    if (!token) {
      setError("No token available");
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      data: {
        status: "paid",
      },
    };

    try {
      const res = await fetch(`https://pus-staff.a4it.ru/api/invoices/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update invoice status");
      }

      const data = await res.json();
      revalidateDataUser();
      toast({
        title: "Счёт успешно полачен",
      });
      console.log("Invoice updated:", data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button className="w-full mt-5" onClick={handleClick} disabled={loading}>
        {loading ? "Processing..." : "Оплатить"}
      </Button>
      {error &&
        toast({
          variant: "destructive",
          title: "Произошла ошибка",
        })}
    </>
  );
};
