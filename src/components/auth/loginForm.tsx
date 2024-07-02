"use client";
import React, { useTransition } from "react";
import { IOptionsCredentials } from "@/types/auth.types";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { AlertDestructive } from "./authAlert";

interface IProps {
  submitLogin: (options: IOptionsCredentials) => void;
  tabsControl: (tab: string) => void;
  errorMessage: string | null;
  signInWithGoogle: () => void;
}

export const LoginForm: React.FC<IProps> = ({
  submitLogin,
  signInWithGoogle,
  tabsControl,
  errorMessage,
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<zod.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = (values: zod.infer<typeof LoginSchema>) => {
    startTransition(() => {
      submitLogin(values);
    });
  };

  return (
    <Card
      className={`mx-auto max-w-sm ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="text-2xl">Вход</CardTitle>
        <CardDescription>
          Введите электронную почту/имя пользователя и пароль для входа в
          аккаунт
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className={`space-y-4 ${isPending ? "filter blur-sm" : ""}`}>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Почта/Имя пользователя</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name@exmple.com"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className={`w-full ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPending}
            >
              {isPending ? "Загрузка..." : "Войти"}
            </Button>
          </form>
        </Form>
      </CardContent>
      {errorMessage && (
        <CardFooter className="mt-4">
          <AlertDestructive message={errorMessage} />
        </CardFooter>
      )}
      <Separator />
      <CardFooter className="flex flex-col gap-4 pt-4">
        <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
          Войти через Google
        </Button>
        <div className="mt-4 text-center text-sm">
          <p className="pb-2">Нет учётной записи?</p>
          <div
            className="underline hover:cursor-pointer"
            onClick={() => tabsControl("signup")}
          >
            Подать заявку на подключение
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
