"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { AdminOrderSchema } from "@/schemas";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { revalidateData } from "@/lib/$data_api";
import { formatLocalDateTime, formatOrderStatus } from "@/lib/utils";

export function AdminOrderForm({ order, onSuccessClose }: any) {
  const form = useForm<z.infer<typeof AdminOrderSchema>>({
    resolver: zodResolver(AdminOrderSchema),
    defaultValues: {
      description: order.description,
      fromDateTime: formatLocalDateTime(order.fromDateTime),
      toDateTime: formatLocalDateTime(order.toDateTime),
      orderType: order.orderTypeId.toString(),
      result: order.result,
      status: formatOrderStatus(order.status),
      title: order.title,
    },
  });

  const session = useSession();

  const onSubmit = async (values: z.infer<typeof AdminOrderSchema>) => {
    const formData = {
      data: {
        orderType: values.orderType,
        result: values.result,
        description: values.description,
        status: values.status,
        fromDateTime: new Date(values.fromDateTime).toISOString(),
        toDateTime: new Date(values.toDateTime).toISOString(),
      },
    };

    const token = session?.data?.user.token;

    try {
      const response = await fetch(
        `https://pus-staff.a4it.ru/api/orders/${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка отправки данных");
      }

      const responseData = await response.json();
      if (response.status === 200) {
        onSuccessClose();
        revalidateData();
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
            name="result"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Результат</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Введите результат"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус</FormLabel>
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
                      <SelectItem value="new">Новая</SelectItem>
                      <SelectItem value="accepted">Принята</SelectItem>
                      <SelectItem value="declined">Отклонена</SelectItem>
                      <SelectItem value="resolved">Выполнена</SelectItem>
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
          {form.formState.isSubmitting ? "Загрузка..." : "Сохранить"}
        </Button>
      </form>
    </Form>
  );
}
