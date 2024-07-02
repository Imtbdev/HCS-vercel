"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderSchema } from "@/schemas/index";
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";

export const OrderForm = ({ housesData, onSuccessClose }: any) => {
  const form = useForm<zod.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      title: "",
      fromDateTime: "",
      toDateTime: "",
      description: "",
      orderType: "",
      house: "",
    },
  });

  const { toast } = useToast();

  const session = useSession();
  const userToken = session.data?.user.token;

  const onSubmit = async (values: zod.infer<typeof OrderSchema>) => {
    const formData = {
      data: {
        ...values,
        fromDateTime: new Date(values.fromDateTime).toISOString(),
        toDateTime: new Date(values.toDateTime).toISOString(),
      },
    };

    try {
      const response = await fetch("https://pus-staff.a4it.ru/api/orders", {
        method: "POST",
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
      if (responseData?.data?.id) {
        toast({
          title: "Заявка успешно создана!",
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
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Введите название"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fromDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата начала</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="YYYY-MM-DD"
                    type="datetime-local"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата окончания</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="YYYY-MM-DD"
                    type="datetime-local"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Введите описание"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orderType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип заявки</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип заявки" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Вывоз мусора</SelectItem>
                      <SelectItem value="2">Пропуск гостей</SelectItem>
                      <SelectItem value="3">Пропуск такси</SelectItem>
                      <SelectItem value="4">Пропуск грузов</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="house"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Объект недвижимости</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите объект недвижимости" />
                    </SelectTrigger>
                    <SelectContent>
                      {housesData.houses.map((house: any) => (
                        <SelectItem key={house.id} value={house.id.toString()}>
                          {house.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          {form.formState.isSubmitting ? "Загрузка..." : "Создать"}
        </Button>
      </form>
    </Form>
  );
};
