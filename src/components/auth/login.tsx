"use client";
import React, { useState } from "react";

import { useSession } from "next-auth/react";
import { loginAction } from "@/actions/loginAction";
import { logOutAction } from "@/actions/logOutAction";
import { IOptionsCredentials, providerType } from "@/types/auth.types";
import { RegisterForm } from "@/components/auth/registerForm";
import { LoginForm } from "@/components/auth/loginForm";
import { useSearchParams } from "next/navigation";
import { CALLBACK_URL_KEY } from "@/consts/routes.consts";
import { showErrorFromError, showErrorFromLogin } from "@/lib/errors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";

interface IProps {}
export const Login: React.FC<IProps> = (props) => {
  const session = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get(CALLBACK_URL_KEY);

  const [tab, setTab] = useState("signin");

  const onTabChange = (value: string) => {
    setTab(value);
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signInHandler = async (
    provider: providerType,
    options?: IOptionsCredentials
  ) => {
    try {
      const data = await loginAction(provider, options, callbackUrl);
      if (data && data.error) {
        showErrorFromLogin(data);
        setErrorMessage(data.error);
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      showErrorFromError(error);
      setErrorMessage("Unknown error");
    }
  };

  if (session.data) {
    return (
      <div className="h-screen mx-auto flex flex-col items-center justify-center">
        <div className="text-xl">Добро пожаловать на главную страницу </div>
        <Button className="mt-4" onClick={() => logOutAction()}>
          Выйти
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <Tabs
        value={tab}
        onValueChange={onTabChange}
        defaultValue="signin"
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Вход</TabsTrigger>
          <TabsTrigger value="signup">Регистрация</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <LoginForm
            submitLogin={(options) => signInHandler("credentials", options)}
            signInWithGoogle={() => signInHandler("google")}
            tabsControl={onTabChange}
            errorMessage={errorMessage}
          />
        </TabsContent>
        <TabsContent value="signup">
          <RegisterForm tabsControl={onTabChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
