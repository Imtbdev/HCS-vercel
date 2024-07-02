import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatAmount, formatDate } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";

const InvoiceCard = ({ invoices }: any) => {
  if (!invoices || invoices.length === 0) {
    return null;
  }

  return (
    <>
      {invoices.map((invoice: any) => (
        <Link href={`/dashboard/invoice/${invoice.id}`} key={invoice.id}>
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle>{invoice.attributes.title}</CardTitle>
              <CardContent className="w-full px-1 py-3 text-balance leading-relaxed">
                <p>Адрес: {invoice.attributes.house.data.attributes.address}</p>
                <p>Дата выставления: {formatDate(invoice.attributes.date)}</p>
                <p>Сумма: {formatAmount(invoice.attributes.amount)}</p>
                <p>Статус: ожидает оплаты</p>
              </CardContent>
            </CardHeader>
            <CardFooter>
              <Button className="w-full">Оплатить</Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default InvoiceCard;
