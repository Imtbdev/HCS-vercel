import {
  adminHouseColumns,
  adminInvoiceColumns,
  adminOrderColumns,
  adminUserColumns,
} from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAdminData } from "@/lib/$data_api";
import {
  formatHousesData,
  formatInvoicesData,
  formatOrdersData,
  formatUsersData,
} from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

//Добавить страницу пользователя с добалением недвижимости к пользователю

async function getHousesData() {
  const housesData = await fetchAdminData(
    "https://pus-staff.a4it.ru/api/houses?populate=*"
  );
  return housesData;
}
async function getInvoicesData() {
  const invoicesData = await fetchAdminData(
    "https://pus-staff.a4it.ru/api/invoices?populate=*"
  );
  return invoicesData;
}
async function getOrdersData() {
  const ordersData = await fetchAdminData(
    "https://pus-staff.a4it.ru/api/orders?populate=*"
  );
  return ordersData;
}
async function getUsersData() {
  const usersData = await fetchAdminData(
    "https://pus-staff.a4it.ru/api/users?populate=*"
  );
  return usersData;
}

export default async function AdminPage() {
  const [housesData, invoicesData, ordersData, usersData] =
    await Promise.allSettled([
      getHousesData(),
      getInvoicesData(),
      getOrdersData(),
      getUsersData(),
    ]);

  const housesDataFormatted = formatHousesData(
    housesData.status === "fulfilled" ? housesData.value.data : []
  );
  const invoicesFormatted = formatInvoicesData(
    invoicesData.status === "fulfilled" ? invoicesData.value.data : []
  );
  const ordersDataFormatted = formatOrdersData(
    ordersData.status === "fulfilled" ? ordersData.value.data : []
  );
  const usersDataFormatted = formatUsersData(
    usersData.status === "fulfilled" ? usersData.value : []
  );

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="overflow-x-hidden">
          <Tabs defaultValue="users">
            <ScrollArea>
              <div className="flex items-center justify-center md:sm:justify-start">
                <TabsList className="sm:gap-0 gap-4">
                  <TabsTrigger value="users">Пользователи</TabsTrigger>
                  <TabsTrigger value="houses">Объекты недвижимости</TabsTrigger>
                  <TabsTrigger value="invoices">Счета</TabsTrigger>
                  <TabsTrigger value="orders">Заявки</TabsTrigger>
                </TabsList>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="users">
              <DataTable
                data={usersDataFormatted}
                columns={adminUserColumns}
                urlStart="user"
                title="Пользователи"
                description="Все пользователи"
                searchParam="fullname"
                searchParamName="ФИО"
                tableType="users"
              />
            </TabsContent>
            <TabsContent value="houses">
              <DataTable
                data={housesDataFormatted}
                columns={adminHouseColumns}
                urlStart="house"
                title="Объекты недвижимости"
                description="Все объекты недвижимости"
                searchParam="address"
                searchParamName="Адресу"
                tableType="houses"
              />
            </TabsContent>
            <TabsContent value="invoices">
              <DataTable
                data={invoicesFormatted}
                columns={adminInvoiceColumns}
                urlStart="invoice"
                title="Счета"
                description="Все счета"
                searchParam="houseAddress"
                searchParamName="Адресу"
                tableType="invoices"
                housesData={housesDataFormatted}
              />
            </TabsContent>
            <TabsContent value="orders">
              <DataTable
                data={ordersDataFormatted}
                columns={adminOrderColumns}
                urlStart="order"
                title="Заявки"
                description="Все заявки"
                searchParam="houseAddress"
                searchParamName="Адресу"
                tableType="adminOrders"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
