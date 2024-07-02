"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  PanelBottomOpen,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { deleteHouseByID, revalidateData } from "@/lib/$data_api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserForm } from "../admin/UserForm";
import { useState } from "react";
import { HouseForm } from "../admin/HouseForm";
import { AdminOrderForm } from "../admin/AdminOrderForm";
import { Badge } from "../ui/badge";
import {
  formatAmount,
  formatDate,
  formatLocalDateTime,
  formatStatus,
} from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

export type adminHouse = {
  id: number;
  title: string;
  codeFIAS: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type adminInvoice = {
  id: number;
  title: string;
  date: string;
  amount: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  houseId: number;
  houseTitle: string;
  houseAddress: string;
};

export type adminOrder = {
  id: number;
  title: string;
  fromDateTime: string;
  toDateTime: string;
  description: string;
  status: string;
  result: string;
  createdAt: string;
  publishedAt: string;
  orderTypeId: number;
  orderTypeTitle: string;
  houseId: number;
  houseAddress: string;
};

export type adminUser = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  isAdmin: string;
  confirmed: string;
  active: string;
  blocked: string;
  createdAt: string;
  updatedAt: string;
};

export type userHouse = {
  id: number;
  title: string;
  codeFIAS: string;
  address: string;
  createdAt: string;
};

export type userInvoice = {
  id: number;
  title: string;
  houseAddress: string;
  date: string;
  amount: string;
  status: string;
  houseTitle: string;
};

export type userOrder = {
  id: number;
  title: string;
  fromDateTime: string;
  toDateTime: string;
  description: string;
  orderTypeId: number;
  orderTypeTitle: string;
  houseId: number;
  houseAddress: string;
  createdAt: string;
};

export const adminHouseColumns: ColumnDef<adminHouse>[] = [
  {
    accessorKey: "title",
    header: "Объект",
  },
  {
    accessorKey: "address",
    header: "Адрес",
  },
  {
    accessorKey: "createdAt",
    meta: "Дата регистрации",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Дата регистарации
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "codeFIAS",
    header: "Код ФИАС",
  },
  {
    header: "Действия",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const houseId = row.original.id;
      const house = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [open, setOpen] = useState(false);
      const handleSuccess = () => {
        setOpen(false);
        revalidateData();
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Открыть меню</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>
                  <DialogTrigger>Изменить</DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <AlertDialogTrigger>Удалить</AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Изменение объекта недвижимости</DialogTitle>
                  <DialogDescription>
                    Измените необходимые параметры и нажмите кнопку сохранить
                  </DialogDescription>
                </DialogHeader>
                <HouseForm
                  actionType="update"
                  house={house}
                  onSuccessClose={handleSuccess}
                />
              </DialogContent>
              <AlertDialogContent>
                <AlertDialogHeader>Вы уверены?</AlertDialogHeader>
                <AlertDialogDescription>
                  Это действие приведёт к удалению выбранного объекта
                  недвижимиости и не может быть оменено.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отменить</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteHouseByID(houseId)}>
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </DropdownMenu>
          </AlertDialog>
        </Dialog>
      );
    },
  },
];

export const adminInvoiceColumns: ColumnDef<adminInvoice>[] = [
  {
    accessorKey: "title",
    header: "Заголовок",
  },
  {
    accessorKey: "houseAddress",
    header: "Адрес",
  },
  {
    accessorKey: "date",
    meta: "Дата",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Дата
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    meta: "Сумма",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Сумма
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    meta: "Статус",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Статус
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

export const adminOrderColumns: ColumnDef<adminOrder>[] = [
  {
    accessorKey: "title",
    header: "Заголовок",
  },
  {
    accessorKey: "orderTypeTitle",
    meta: "Тип заявки",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Тип заявки
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "houseAddress",
    header: "Адрес",
  },
  {
    accessorKey: "fromDateTime",
    header: "Начало",
    cell: ({ row }) => {
      const fromDateTime = row.original.fromDateTime;
      return <>{formatLocalDateTime(fromDateTime)}</>;
    },
  },
  {
    accessorKey: "toDateTime",
    header: "Конец",
    cell: ({ row }) => {
      const toDateTime = row.original.toDateTime;
      return <>{formatLocalDateTime(toDateTime)}</>;
    },
  },
  {
    accessorKey: "createdAt",
    meta: "Дата создания",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Дата создания
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Описание",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div className="truncate overflow-hidden max-w-52">{description}</div>
      );
    },
  },
  {
    accessorKey: "status",
    meta: "Статус",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Статус
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "result",
    header: "Результат",
  },
  {
    header: "Действия",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [open, setOpen] = useState(false);
      const handleSuccess = () => {
        setOpen(false);
        revalidateData();
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Изменить</span>
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <AdminOrderForm order={order} onSuccessClose={handleSuccess} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export const adminUserColumns: ColumnDef<adminUser>[] = [
  {
    accessorKey: "fullname",
    header: "ФИО",
    cell: ({ row }) => {
      const userId = row.original.id;
      const fullname = row.original.fullname;
      return (
        <Link href={`admin/user/${userId}`} className="underline font-semibold">
          {fullname}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Почта",
  },
  {
    accessorKey: "phone",
    header: "Номер телефона",
  },
  {
    accessorKey: "isAdmin",
    header: "Администратор",
  },
  {
    accessorKey: "confirmed",
    header: "Подтверждён",
  },
  {
    accessorKey: "active",
    header: "Активен",
  },
  {
    accessorKey: "blocked",
    header: "Заблокирован",
  },
  {
    accessorKey: "createdAt",
    meta: "Дата регистрации",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Дата регистрации
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: "Действия",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [open, setOpen] = useState(false);
      const handleSuccess = () => {
        setOpen(false);
        revalidateData();
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Изменить</span>
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <UserForm userInfo={user} onSuccessClose={handleSuccess} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export const userHouseColumns: ColumnDef<userHouse>[] = [
  {
    accessorKey: "title",
    header: "Объект",
    cell: ({ row }) => {
      const houseId = row.original.id;
      const title = row.original.title;
      return (
        <Link
          href={`dashboard/house/${houseId}`}
          className="underline font-semibold"
        >
          {title}
        </Link>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Адрес",
    cell: ({ row }) => {
      const houseId = row.original.id;
      const address = row.original.address;
      return (
        <Link
          href={`dashboard/house/${houseId}`}
          className="underline font-semibold"
        >
          {address}
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    meta: "Дата регистрации",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Дата регистарации
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "codeFIAS",
    header: "Код ФИАС",
    cell: ({ row }) => {
      const code = row.original.codeFIAS;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();
      return (
        <Badge
          className="text-xs"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(code);
            toast({
              title: "Скопировано",
            });
          }}
        >
          {code}
        </Badge>
      );
    },
  },
];

export const userInvoiceColumns: ColumnDef<userInvoice>[] = [
  {
    accessorKey: "title",
    header: "Заголовок",
    cell: ({ row }) => {
      const invoiceId = row.original.id;
      const title = row.original.title;
      return (
        <Link
          href={`dashboard/invoice/${invoiceId}`}
          className="underline font-semibold"
        >
          {title}
        </Link>
      );
    },
  },
  {
    accessorKey: "houseAddress",
    header: "Адрес",
    cell: ({ row }) => {
      const invoiceId = row.original.id;
      const address = row.original.houseAddress;
      return (
        <Link
          href={`dashboard/invoice/${invoiceId}`}
          className="underline font-semibold"
        >
          {address}
        </Link>
      );
    },
  },
  {
    accessorKey: "date",
    meta: "Дата",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Дата
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    meta: "Сумма",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Сумма
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.original.amount;

      return <>{formatAmount(Number(amount))}</>;
    },
  },
  {
    accessorKey: "status",
    meta: "Статус",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Статус
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge className="text-xs" variant="outline">
          {formatStatus(status)}
        </Badge>
      );
    },
  },
];

export const userOrderColumns: ColumnDef<adminOrder>[] = [
  {
    accessorKey: "title",
    header: "Заголовок",
  },
  {
    accessorKey: "orderTypeTitle",
    meta: "Тип заявки",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Тип заявки
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "houseAddress",
    header: "Адрес",
  },
  {
    accessorKey: "fromDateTime",
    header: "Начало",
    cell: ({ row }) => {
      const fromDateTime = row.original.fromDateTime;

      return <>{formatLocalDateTime(fromDateTime)}</>;
    },
  },
  {
    accessorKey: "toDateTime",
    header: "Конец",
    cell: ({ row }) => {
      const toDateTime = row.original.toDateTime;

      return <>{formatLocalDateTime(toDateTime)}</>;
    },
  },
  {
    accessorKey: "createdAt",
    meta: "Дата создания",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Дата создания
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;

      return <>{formatLocalDateTime(createdAt)}</>;
    },
  },
  {
    accessorKey: "status",
    meta: "Статус",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Статус
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className="text-xs" variant="outline">
          {formatStatus(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "result",
    header: "Результат",
  },
  {
    header: "Действия",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Drawer>
          <DrawerTrigger>
            <Button variant="ghost">
              <PanelBottomOpen />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="flex justify-center items-center w-full">
            <DrawerHeader>
              <DrawerTitle>Информация о заявке</DrawerTitle>
              <DrawerDescription>
                <ul>
                  <li>Адрес:{data.houseAddress}</li>
                  <li>Описание: {data.description}</li>
                  <li>Тип заявки {data.orderTypeTitle}</li>
                  <li>Дата начала: {formatLocalDateTime(data.fromDateTime)}</li>
                  <li>
                    Дата окончания: {formatLocalDateTime(data.toDateTime)}
                  </li>
                </ul>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      );
    },
  },
];
