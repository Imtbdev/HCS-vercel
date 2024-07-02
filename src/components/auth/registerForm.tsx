import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserAction } from "@/actions/registerUserAction";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { showErrorFromError, showErrorFromLogin } from "@/lib/errors";
import { AlertDestructive } from "./authAlert";

interface IProps {
  tabsControl: (tab: string) => void;
}

export const RegisterForm: React.FC<IProps> = ({ tabsControl }) => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<zod.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      confirm: "",
      fullname: "",
      phone: "",
    },
  });

  const onSubmit = (values: zod.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      registerUserAction(values)
        .then((e) => {
          showErrorFromLogin(e);
          setErrorMessage(e?.error || "Unknown error");
        })
        .catch((error) => {
          showErrorFromError(error);
          setErrorMessage(error.message || "Unknown error");
        });
    });
  };

  return (
    <Card
      className={`mx-auto max-w-sm ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="text-2xl">Регистрация</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className={`space-y-4 ${isPending ? "filter blur-sm" : ""}`}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Введите почту"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.email &&
                        form.formState.errors.email.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Введите имя пользователя"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.username &&
                        form.formState.errors.username.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ФИО</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введите ФИО" type="text" />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.fullname &&
                        form.formState.errors.fullname.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Введите номер телефона"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.phone &&
                        form.formState.errors.phone.message}
                    </FormMessage>
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
                    <FormMessage>
                      {form.formState.errors.password &&
                        form.formState.errors.password.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтверждение пароля</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.confirm &&
                        form.formState.errors.confirm.message}
                    </FormMessage>
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
              {isPending ? "Загрузка..." : "Зарегистрироваться"}
            </Button>
          </form>
        </Form>
      </CardContent>
      {errorMessage && (
        <CardFooter className="mt-4">
          <AlertDestructive message={errorMessage} />
        </CardFooter>
      )}
      <CardFooter className="mt-4 text-center justify-center text-sm gap-2">
        <>
          Уже есть аккаунт?{" "}
          <div
            className="underline hover: cursor-pointer"
            onClick={() => tabsControl("signin")}
          >
            {" "}
            Войти
          </div>
        </>
      </CardFooter>
    </Card>
  );
};
