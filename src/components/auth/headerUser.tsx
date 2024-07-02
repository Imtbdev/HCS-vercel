"use client";
import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTE_LINKS } from "@/consts/main.consts";
import { logOutAction } from "@/actions/logOutAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  Home,
  Package2,
  PanelLeft,
  MessageCircle,
  Settings,
  Car,
  LogOut,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import useBarrierControl from "@/hooks/useBarrierControl";
import { useToast } from "../ui/use-toast";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderUserProps {
  session: any;
}

export const HeaderUser = memo((props: HeaderUserProps) => {
  const { session } = props;

  const [status, openBarrier] = useBarrierControl();

  const [currentTheme, setCurrentTheme] = useState("light");

  const { setTheme } = useTheme();

  function switchTheme() {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href={ROUTE_LINKS.main}
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <div
              onClick={() => {
                openBarrier();
              }}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Car className="h-5 w-5" /> Открыть шлагбаум
              <span className="sr-only">Открыть шлагбаум</span>
            </div>
            {session.user.userInfo.isAdmin ? (
              <Link
                href={ROUTE_LINKS.admin.main}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Shield className="h-5 w-5" />
                Панель администратора
              </Link>
            ) : (
              ""
            )}
            <Link
              href={ROUTE_LINKS.dashboard.main}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Панель управления
            </Link>
            <Link
              href={ROUTE_LINKS.dashboard.settings}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              Настройки
            </Link>
            <div
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => switchTheme()}
            >
              {currentTheme === "light" ? (
                <Sun className="h-5 w-5" strokeWidth={1.8} />
              ) : (
                <Moon className="h-5 w-5" strokeWidth={1.8} />
              )}
              Тема
            </div>
            <div
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => {
                logOutAction();
              }}
            >
              <LogOut className="h-5 w-5" strokeWidth={1.8} />
              Выйти
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto mr-4 flex items-center flex-1 grow-0 whitespace-nowrap">
        Здравствуйте, {session.user.userInfo.username}
      </div>
      <div>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          {/* <Image
            src={session.user.image}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          /> */}
          <Avatar>
            <AvatarImage width={36} height={36} src={session.user.image} />
            <AvatarFallback>
              {session.user.userInfo.username.slice(0, 4)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
});
HeaderUser.displayName = "HeaderUser";
