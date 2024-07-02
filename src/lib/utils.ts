import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAmount = (amount: number) => {
  const lastDigit = amount % 10;
  const lastTwoDigits = amount % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${amount} рубль`;
  } else if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  ) {
    return `${amount} рубля`;
  } else {
    return `${amount} рублей`;
  }
};

export const formatDate = (dateString: string) => {
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  } as Intl.DateTimeFormatOptions;
  return new Date(dateString).toLocaleDateString("ru-RU", options);
};

export const formatLocalDateTime = (dateTimeString: string) => {
  const localDateTime = new Date(dateTimeString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;

  return localDateTime.toLocaleString("sv-SE", options);
};

export const formatStatus = (status: string) => {
  switch (status) {
    case "true":
      return "Да";
    case "false":
      return "Нет";
    case "paid":
      return "Оплачен";
    case "active":
      return "Активен";
    case "expired":
      return "Просрочен";
    case "archive":
      return "Архив";
    case "new":
      return "Новая";
    case "accepted":
      return "Принята";
    case "declined":
      return "Отклонена";
    case "resolved":
      return "Закрыта";
    default:
      return status;
  }
};

export const formatOrderStatus = (status: string) => {
  switch (status) {
    case "Новая":
      return "new";
    case "Принята":
      return "accepted";
    case "Отклонена":
      return "declined";
    case "Закрыта":
      return "resolved";
    default:
      return status;
  }
};

export const formatStatusBoolean = (status: string) => {
  return status === "Да" ? true : false;
};

export const formatHousesData = (data: []) => {
  return data.map((item: any) => ({
    id: item?.id || "",
    title: item?.attributes?.title || "",
    codeFIAS: item?.attributes?.codeFIAS || "",
    address: item?.attributes?.address || "",
    createdAt: formatDate(item?.attributes?.createdAt) || "",
    updatedAt: formatDate(item?.attributes?.updatedAt) || "",
    publishedAt: formatDate(item?.attributes?.publishedAt) || "",
  }));
};

export const formatInvoicesData = (data: []) => {
  return data.map((item: any) => ({
    id: item?.id || "",
    title: item?.attributes?.title || "",
    date: formatDate(item?.attributes?.date) || "",
    amount: formatAmount(item?.attributes?.amount) || "",
    description: item?.attributes?.description || "",
    status: formatStatus(item?.attributes?.status) || "",
    createdAt: formatDate(item?.attributes?.createdAt) || "",
    updatedAt: formatDate(item?.attributes?.updatedAt) || "",
    publishedAt: formatDate(item?.attributes?.publishedAt) || "",
    houseId: item?.attributes?.house?.data?.id || "",
    houseTitle: item?.attributes?.house?.data?.attributes?.title || "",
    houseAddress: item?.attributes?.house?.data?.attributes?.address || "",
  }));
};

export const formatOrdersData = (data: []) => {
  return data.map((item: any) => ({
    id: item?.id || "",
    title: item?.attributes?.title || "",
    fromDateTime: item?.attributes?.fromDateTime || "",
    toDateTime: item?.attributes?.toDateTime || "",
    description: item?.attributes?.description || "",
    status: formatStatus(item?.attributes?.status) || "",
    result: item?.attributes?.result || "",
    createdAt: formatDate(item?.attributes?.createdAt) || "",
    publishedAt: formatDate(item?.attributes?.publishedAt) || "",
    orderTypeId: item?.attributes?.orderType?.data?.id || "",
    orderTypeTitle: item?.attributes?.orderType?.data?.attributes?.title || "",
    houseId: item?.attributes?.house?.data?.id || "",
    houseAddress: item?.attributes?.house?.data?.attributes?.address || "",
  }));
};

export const formatUsersData = (data: []) => {
  return data.map((item: any) => ({
    id: item?.id || "",
    fullname: item?.fullname || "",
    email: item?.email || "",
    phone: item?.phone || "",
    isAdmin: formatStatus(item?.isAdmin?.toString()) || "",
    confirmed: formatStatus(item?.confirmed?.toString()) || "",
    active: formatStatus(item?.active?.toString()) || "",
    blocked: formatStatus(item?.blocked?.toString()) || "",
    createdAt: formatDate(item?.createdAt) || "",
    updatedAt: formatDate(item?.updatedAt) || "",
  }));
};

export const transformUserHousesData = (housesData: any) => {
  return housesData.houses.map((house: any) => ({
    id: house.id || "",
    title: house.title || "",
    codeFIAS: house.codeFIAS || "",
    address: house.address || "",
    createdAt:
      new Date(house.createdAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) || "",
    updatedAt:
      new Date(house.updatedAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) || "",
    publishedAt:
      new Date(house.publishedAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) || "",
  }));
};

export const transformUserInvoicesData = (invoicesData: any) => {
  return invoicesData.map((invoice: any) => ({
    id: invoice.id || "",
    title: invoice.attributes.title || "",
    houseAddress: invoice.attributes.house.data.attributes.address || "",
    date:
      new Date(invoice.attributes.date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) || "",
    amount: invoice.attributes.amount || "",
    status: invoice.attributes.status || "",
  }));
};

export const transformUserOrdersData = (ordersData: any) => {
  return ordersData.map((order: any) => ({
    id: order.id || 0,
    title: order.attributes.title || "",
    fromDateTime: order.attributes.fromDateTime || "",
    toDateTime: order.attributes.toDateTime || "",
    description: order.attributes.description || "",
    orderTypeId: order.attributes.orderType.data.id || 0,
    orderTypeTitle: order.attributes.orderType.data.attributes.title || "",
    houseId: order.attributes.house.data.id || 0,
    houseAddress: order.attributes.house.data.attributes.address || "",
    status: order.attributes.status || "",
    result: order.attributes.result || "",
    createdAt: order.attributes.createdAt || "",
  }));
};
