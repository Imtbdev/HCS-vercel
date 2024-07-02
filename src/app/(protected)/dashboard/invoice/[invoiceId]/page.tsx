import { auth } from "@/auth";
import { InvoicePayButton } from "@/components/dashboard/InvoicePayButton";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchInvoiceData } from "@/lib/$data_api";
import { formatAmount, formatDate, formatStatus } from "@/lib/utils";

export default async function InvoiceDetails({ params }: any) {
  const session = await auth();

  const details = await fetchInvoiceData(session?.user.token, params.invoiceId);

  return (
    <main className="grid grid-cols-6 px-4">
      <div></div>
      <div></div>
      <Card className="overflow-hidden col-span-6 xl:col-span-2">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {details.data.attributes.title}
            </CardTitle>
            <CardDescription>
              От {formatDate(details.data.attributes.createdAt)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Дополнительная информация</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-start">
                <span className="text-muted-foreground">
                  Объект: {details.data.attributes.house.data.attributes.title}
                </span>
              </li>
              <li className="flex items-center justify-start">
                <span className="text-muted-foreground">
                  Адрес объекта:{" "}
                  {details.data.attributes.house.data.attributes.address}
                </span>
              </li>
              {/* Проверяем наличие описания */}
              {details.data.attributes.description && (
                <li className="flex items-center justify-start">
                  <span className="text-muted-foreground">
                    Описание: {details.data.attributes.description}
                  </span>
                </li>
              )}
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Сумма к оплате</span>
                <span>{formatAmount(details.data.attributes.amount)}</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Статус</span>
                <span>{formatStatus(details.data.attributes.status)}</span>
              </li>
              {details.data.attributes.status === "active" ||
              details.data.attributes.status === "expired" ? (
                <InvoicePayButton id={details.data.id} />
              ) : (
                <></>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
      <div></div>
      <div></div>
    </main>
  );
}
