"use client";
import { logOutAction } from "@/actions/logOutAction";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function NotApprovedPage() {
  const session = useSession();
  if (!session.data?.user.userInfo.active) {
    return (
      <div className="h-screen mx-auto flex flex-col items-center justify-center">
        <div>
          Если вы попали на эту страницу, значит ваша заявка на подключении
          находится на рассмотрении.
        </div>
        <div className="mt-4">
          <Button onClick={() => logOutAction()}>Выйти</Button>
        </div>
      </div>
    );
  }
}
