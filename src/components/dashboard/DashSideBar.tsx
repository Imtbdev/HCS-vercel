"use client";

import {
  Home,
  Package2,
  Settings,
  MessageCircle,
  Car,
  LogOut,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ROUTE_LINKS } from "@/consts/main.consts";
import { TooltipProvider } from "@/components/ui/tooltip";
import useBarrierControl from "@/hooks/useBarrierControl";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { logOutAction } from "@/actions/logOutAction";

export const DashSideBar = () => {
  const [status, openBarrier] = useBarrierControl();
  const [currentTheme, setCurrentTheme] = useState("light");

  const session = useSession();

  const { setTheme } = useTheme();

  function switchTheme() {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  }

  if (session.data?.user.userInfo.active) {
    return (
      <div>
        {session?.data?.user ? (
          <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
              <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                  href={ROUTE_LINKS.main}
                  className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                  <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {session?.data.user.userInfo.isAdmin ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={ROUTE_LINKS.admin.main}
                        className="flex h-5 w-5 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <Shield className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">Администратор</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Панель администратора
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  ""
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={ROUTE_LINKS.dashboard.main}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Home className="h-5 w-5" />
                      <span className="sr-only">Панель управления</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Панель управления
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => {
                        openBarrier();
                      }}
                      className="flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Car className="h-5 w-5" />
                      <span className="sr-only">Открыть шлагбаум</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">Открыть шлагбаум</TooltipContent>
                </Tooltip>
              </nav>
              <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={ROUTE_LINKS.dashboard.settings}
                      className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Настройки</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Настройки</TooltipContent>
                </Tooltip>
              </nav>
              <nav className=" flex flex-col items-center gap-4 px-2 sm:pb-4 cursor-pointer ">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      onClick={() => switchTheme()}
                    >
                      {currentTheme === "light" ? (
                        <Sun className="h-5 w-5" strokeWidth={1.8} />
                      ) : (
                        <Moon className="h-5 w-5" strokeWidth={1.8} />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">Настройки</TooltipContent>
                </Tooltip>
              </nav>
              <nav className=" flex flex-col items-center gap-4 px-2 sm:pb-4 cursor-pointer ">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      onClick={() => {
                        logOutAction();
                      }}
                    >
                      <LogOut className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">Выйти</TooltipContent>
                </Tooltip>
              </nav>
            </aside>
          </TooltipProvider>
        ) : (
          <></>
        )}
      </div>
    );
  }
};
