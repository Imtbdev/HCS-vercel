"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import React from "react";
import { useSession } from "next-auth/react";
import { revalidateData } from "@/lib/$data_api";
import { toast } from "../ui/use-toast";

export default function UserHousesTable({ houses, userId }: any) {
  const [userHouses, setUserHouses] = React.useState(houses);

  const session = useSession();

  const handleRemoveHouse = async (houseId: string) => {
    const updatedHouses = userHouses.filter(
      (house: any) => house.id !== houseId
    );
    setUserHouses(updatedHouses);
    const token = session?.data?.user.token;

    try {
      const response = await fetch(
        `https://pus-staff.a4it.ru/api/users/${userId}?populate=*`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            houses: updatedHouses.map((house: any) => house.id),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка отправки данных");
      }

      const responseData = await response.json();
      if (response.status === 200) {
        toast({
          title: "Объект успешно отвязан",
        });
        revalidateData();
      }
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  return (
    <div className="overflox-x-auto">
      {userHouses && userHouses.length > 0 ? (
        <Table className="bg-muted/50">
          <TableHeader>
            <TableRow>
              <TableHead>Тип</TableHead>
              <TableHead>Адрес</TableHead>
              <TableHead>Код ФИАС</TableHead>
              <TableHead>Действие</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userHouses.map((house: any) => (
              <TableRow key={house.id}>
                <TableCell>{house.title}</TableCell>
                <TableCell>{house.address}</TableCell>
                <TableCell>{house.codeFIAS}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveHouse(house.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="font-semibold text-lg text-center">
          Пользователю на назначен ни один объект недвижимости
        </p>
      )}
    </div>
  );
}
