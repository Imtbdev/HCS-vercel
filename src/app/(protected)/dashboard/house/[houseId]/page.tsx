import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchHousesData } from "@/lib/$data_api";
import { formatDate, formatLocalDateTime } from "@/lib/utils";

export default async function HouseDetails({ params }: any) {
  const session = await auth();

  const housesData = await fetchHousesData(session?.user.token);
  const houseId = parseInt(params.houseId);

  const house = housesData.houses.find((house: any) => house.id === houseId);

  const details = house.details ? JSON.parse(house.details) : null;

  return (
    <main className="grid grid-cols-4 px-4">
      <div></div>
      <Card className="overflow-hidden col-span-4 xl:col-span-2">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Информация об объекте недвижимости
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <ul className="grid gap-3">
              <li>
                <span className="text-muted-foreground">
                  Заголовок: {house.title}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Адрес: {house.address}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Код ФИАС: {house.codeFIAS}
                </span>
              </li>
              {details && details.postal_code !== null && (
                <li>
                  <span className="text-muted-foreground">
                    Почтовый код: {details.postal_code}
                  </span>
                </li>
              )}
              <li>
                <span className="text-muted-foreground">
                  Дата регистрации в системе: {formatDate(house.createdAt)}
                </span>
              </li>
            </ul>
            {/* {orders && orders.length > 0 && (
              <div className="grid gap-3">
                <Separator className="my-2" />
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Связанные заявки
                </CardTitle>
                <ul>
                  {orders.map((order: any) => (
                    <div key={order.id} className="grid gap-3">
                      <li>
                        <span className="text-muted-foreground">
                          Название: {order.attributes.title}
                        </span>
                      </li>
                      <li>
                        <span className="text-muted-foreground">
                          Дата начала:{" "}
                          {formatLocalDateTime(order.attributes.fromDateTime)}
                        </span>
                      </li>
                      <li>
                        <span className="text-muted-foreground">
                          Дата окончания:{" "}
                          {formatLocalDateTime(order.attributes.toDateTime)}
                        </span>
                      </li>
                      <li>
                        <span className="text-muted-foreground">
                          Описание: {order.attributes.description}
                        </span>
                      </li>
                      <li>
                        <span className="text-muted-foreground">
                          Дата создания:{" "}
                          {formatDate(order.attributes.createdAt)}
                        </span>
                      </li>
                      <li>
                        <span className="text-muted-foreground">
                          Статус: {order.attributes.status}
                        </span>
                      </li>
                      <li>
                        <span className="text-muted-foreground">
                          Результат: {order.attributes.result}
                        </span>
                      </li>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </ul>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>
      <div></div>
    </main>
  );
}
