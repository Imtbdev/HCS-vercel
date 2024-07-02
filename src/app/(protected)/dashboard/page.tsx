import { auth } from "@/auth";
import InvoiceCard from "@/components/dashboard/InvoiceCard";
import {
  userHouseColumns,
  userInvoiceColumns,
  userOrderColumns,
} from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchHousesData,
  fetchUserInvoicesData,
  fetchOrdersData,
} from "@/lib/$data_api";
import {
  transformUserHousesData,
  transformUserInvoicesData,
  transformUserOrdersData,
} from "@/lib/utils";
import { IHouseInfo, IInvoiceInfo } from "@/types/user.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Панель управления",
};

export default async function DashboardPage() {
  const session = await auth();
  const userToken = session?.user.token;

  const rawHousesData = await fetchHousesData(userToken);

  const userHouseIds = await rawHousesData?.houses?.map(
    (house: IHouseInfo) => house.id
  );

  const rawInvoicesData = await fetchUserInvoicesData(userToken, userHouseIds);
  const rawOrdersData = await fetchOrdersData(userToken, userHouseIds);

  const transformedHousesData = transformUserHousesData(rawHousesData);
  const transformedInvoicesData = transformUserInvoicesData(rawInvoicesData);
  const tranformedOrdersData = transformUserOrdersData(rawOrdersData);

  const userInvoicesIds = await rawInvoicesData?.map(
    (invoice: IInvoiceInfo) => invoice.id
  );

  const activeInvoices = await rawInvoicesData.filter(
    (invoice: any) => invoice.attributes.status === "active"
  );

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <InvoiceCard invoices={activeInvoices} />
        </div>
        <div className="overflow-x-hidden">
          <Tabs defaultValue="houses">
            <ScrollArea>
              <div className="flex items-center justify-center md:sm:justify-start">
                <TabsList className="sm:gap-0 gap-4">
                  <TabsTrigger value="houses">Объекты недвижимости</TabsTrigger>
                  <TabsTrigger value="invoices">Счета</TabsTrigger>
                  <TabsTrigger value="orders">Заявки</TabsTrigger>
                </TabsList>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="houses">
              <DataTable
                columns={userHouseColumns}
                data={transformedHousesData}
                title="Объекты недвижимости"
                description="Ваши объекты недвижимости"
                searchParam="address"
                searchParamName="адресу"
                urlStart="house"
              />
            </TabsContent>
            <TabsContent value="invoices">
              <DataTable
                columns={userInvoiceColumns}
                data={transformedInvoicesData}
                title="Счета"
                description="Ваши счета"
                searchParam="houseAddress"
                searchParamName="адресу"
                urlStart="invoice"
              />
            </TabsContent>
            <TabsContent value="orders">
              <DataTable
                columns={userOrderColumns}
                data={tranformedOrdersData}
                title="Заявки"
                description="Ваши заявки"
                searchParam="houseAddress"
                searchParamName="адресу"
                urlStart="orders"
                tableType="orders"
                housesData={rawHousesData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
