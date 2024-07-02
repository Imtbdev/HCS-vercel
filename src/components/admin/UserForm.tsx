"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { UserFormSchema } from "@/schemas";
import { useSession } from "next-auth/react";
import { formatStatusBoolean } from "@/lib/utils";

export function UserForm({ userInfo, onSuccessClose }: any) {
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      fullname: userInfo.fullname,
      email: userInfo.email,
      phone: userInfo.phone,
      isAdmin: formatStatusBoolean(userInfo.isAdmin),
      confirmed: formatStatusBoolean(userInfo.confirmed),
      active: formatStatusBoolean(userInfo.active),
      blocked: formatStatusBoolean(userInfo.blocked),
    },
  });

  const session = useSession();

  const onSubmit = async (values: z.infer<typeof UserFormSchema>) => {
    const formData = {
      ...values,
      role: values.isAdmin ? 4 : 1,
    };

    const token = session?.data?.user.token;

    try {
      const response = await fetch(
        `https://pus-staff.a4it.ru/api/users/${userInfo.id}`,
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
      }
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">ФИО</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Почта</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Номер телефона</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <FormLabel className="text-base mr-4">Администратор</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmed"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <FormLabel className="text-base mr-4">Подтверждён</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <FormLabel className="text-base mr-4">Активен</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="blocked"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <FormLabel className="text-base mr-4">Заблокирован</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Сохранить
        </Button>
      </form>
    </Form>
  );
}
