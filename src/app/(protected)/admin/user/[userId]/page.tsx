import UserHousesForm from "@/components/dashboard/UserHousesForm";
import UserHousesTable from "@/components/dashboard/userHousesTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { fetchAdminData } from "@/lib/$data_api";
import { Paperclip } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Панель администратора",
};

export default async function UserDetails({ params }: any) {
  const details = await fetchAdminData(
    `https://pus-staff.a4it.ru/api/users/${params.userId}?populate=*`
  );

  const houses = await fetchAdminData(
    `https://pus-staff.a4it.ru/api/houses?populate=*`
  );

  const avliabeHouses = houses.data.filter((house: any) => {
    return !details.houses.some((userHouse: any) => userHouse.id === house.id);
  });

  const userHousesData = await details.houses;

  return (
    <Dialog>
      <main className="grid grid-cols-4 px-4">
        <div></div>
        <Card className="overflow-hidden col-span-4 xl:col-span-2">
          <CardHeader className="flex bg-muted/50">
            <CardTitle className="group flex flex-col gap-2 items-center text-lg justify-between md:flex-row">
              <div>Пользователь: {details.fullname}</div>
              <DialogTrigger asChild>
                <Button className="md:ml-auto w-full md:w-auto">
                  Привязать объект <Paperclip className="ml-4 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Привяжите объект недвижимости</DialogTitle>
                  <DialogDescription>
                    Выберите объекты и нажмите кнопку привязать
                  </DialogDescription>
                  <UserHousesForm
                    avliabeHouses={avliabeHouses}
                    userId={details.id}
                    userHouses={details.houses}
                  />
                </DialogHeader>
              </DialogContent>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <CardHeader className="font-semibold text-2xl pl-0 pb-0">
                Основная информация
              </CardHeader>
              <ul className="grid gap-3">
                <li className="flex items-center justify-start">
                  <span className="text-muted-foreground">
                    Имя пользователя: {details.username}
                  </span>
                </li>
                <li className="flex items-center justify-start">
                  <span className="text-muted-foreground">
                    Почта: {details.email}
                  </span>
                </li>
                <li className="flex items-center justify-start">
                  <span className="text-muted-foreground">
                    Мобильный телефон: {details.phone}
                  </span>
                </li>
              </ul>
              <Separator className="my-2" />
              <div className="overflow-x-auto">
                <CardHeader className="font-semibold text-center text-2xl px-0">
                  Недвижимость пользователя
                </CardHeader>
                <UserHousesTable houses={userHousesData} userId={details.id} />
              </div>
            </div>
          </CardContent>
        </Card>
        <div></div>
      </main>
    </Dialog>
  );
}
