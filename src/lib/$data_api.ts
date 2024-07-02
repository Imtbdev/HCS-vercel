"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function fetchHousesData(token: string) {
  try {
    const res = await fetch(
      `https://pus-staff.a4it.ru/api/users/me?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function fetchUserInvoicesData(
  token: string,
  userHouseIds: string[] | undefined
) {
  try {
    const res = await fetch(
      `https://pus-staff.a4it.ru/api/invoices?fields[0]=title&fields[1]=date&&fields[2]=date&fields[3]=amount&fields[4]=description&fields[5]=status&populate[house][fields][0]=title&populate[house][fields][1]=codeFIAS&populate[house][fields][2]=details&populate[house][fields][3]=address`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    const filteredInvoices = await data.data.filter((invoice: any) => {
      const houseId = invoice.attributes.house?.data?.id;
      return houseId && (userHouseIds ? userHouseIds.includes(houseId) : true);
    });

    return filteredInvoices;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function fetchInvoiceData(
  token: string,
  invoiceId: string | undefined
) {
  try {
    const res = await fetch(
      `https://pus-staff.a4it.ru/api/invoices/${invoiceId}?populate[0]=house`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function fetchOrdersData(
  token: string,
  houseIds: string[] | undefined
) {
  try {
    const res = await fetch(
      `https://pus-staff.a4it.ru/api/orders?fields[0]=title&fields[1]=fromDateTime&fields[2]=toDateTime&fields[3]=description&fields[4]=status&fields[5]=result&&fields[6]=createdAt&populate[house][fields][0]=title&populate[house][fields][1]=codeFIAS&populate[house][fields][2]=details&populate[house][fields][3]=address&populate=orderType&populate[orderType][fields][0]=id&populate[orderType][fields][1]=title&populate[orderType][fields][2]=code`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    const filteredOrders = await data.data.filter((order: any) =>
      houseIds?.includes(order.attributes.house.data.id)
    );

    return filteredOrders;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function fetchAdminData(url: string) {
  const session = await auth();
  const token = await session?.user.token;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function deleteHouseByID(id: number) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("User session not found");
    }

    const token = session.user.token;

    const res = await fetch(`https://pus-staff.a4it.ru/api/houses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete house");
    }

    const data = await res.json();
    revalidatePath("/admin");

    return data;
  } catch (error) {
    console.error("Error deleting house:", error);
    return null;
  }
}

export async function revalidateData() {
  revalidatePath("/admin");
}

export async function revalidateDataUser() {
  revalidatePath("/dashboadrd");
}
