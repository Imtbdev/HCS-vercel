import React from "react";
import { AddressSuggestions } from "react-dadata";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HouseSchema } from "@/schemas/index";
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";

export const HouseForm = ({ onSuccessClose, actionType, house }: any) => {
  const defaultFormValues = {
    title: house?.title || "",
    codeFIAS: house?.codeFIAS || "",
    address: house?.address || "",
    details: house?.details || "",
  };

  const form = useForm<zod.infer<typeof HouseSchema>>({
    resolver: zodResolver(HouseSchema),
    defaultValues: defaultFormValues,
  });

  const { toast } = useToast();
  const session = useSession();
  const userToken = session.data?.user.token;

  const onSubmit = async (values: zod.infer<typeof HouseSchema>) => {
    const formData = {
      data: {
        ...values,
      },
    };

    try {
      let url = "https://pus-staff.a4it.ru/api/houses";
      let method = "POST";

      if (actionType === "update") {
        url += `/${house.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка отправки данных");
      }

      const responseData = await response.json();
      if (response.status === 200) {
        toast({
          title:
            actionType === "update"
              ? "Объект успешно обновлен!"
              : "Объект успешно добавлен!",
        });
        form.reset();
        onSuccessClose();
      }
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Введите заголовок"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес</FormLabel>
                <FormControl>
                  <AddressSuggestions
                    token="34bf851f7393cef3d7f3fc5704a84cbba70265b9"
                    onChange={(suggestion: any) => {
                      form.setValue("address", suggestion.value);
                      form.setValue("codeFIAS", suggestion.data.fias_id);
                      form.setValue("details", JSON.stringify(suggestion.data));
                    }}
                    customInput={(props) => (
                      <Input
                        {...props}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Начните вводить адрес"
                      />
                    )}
                    selectOnBlur={true}
                    minChars={8}
                    containerClassName="relative"
                    suggestionsClassName="grid gap-4 pt-8"
                    suggestionClassName="underline underline-offset-4 text-muted-foreground transition-colors hover:text-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codeFIAS"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Код ФИАС</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Введите код ФИАС"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Загрузка..."
            : actionType === "update"
            ? "Обновить"
            : "Добавить"}
        </Button>
      </form>
    </Form>
  );
};
