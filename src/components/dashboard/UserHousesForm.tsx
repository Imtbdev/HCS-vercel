"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultipleSelector, { Option } from "@/components/admin/multi-selector";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { revalidateData } from "@/lib/$data_api";
import { toast } from "../ui/use-toast";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  houses: z.array(optionSchema).min(1),
});

const formatHouseOption = (house: any) => ({
  label: house.attributes.address,
  value: house.id.toString(),
});

const UserHousesForm = ({ avliabeHouses, userHouses, userId }: any) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [loading, setLoading] = React.useState(false);

  const houseOptions = avliabeHouses.map(formatHouseOption);

  const session = useSession();

  const onSubmit = async (values: {
    houses: { label: string; value: string }[];
  }) => {
    setLoading(true);

    const houseIds = values.houses.map((house) => house.value);

    const allHouseIds = [
      ...userHouses.map((house: any) => house.id),
      ...houseIds,
    ];

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
          body: JSON.stringify({ houses: allHouseIds }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка отправки данных");
      }

      setLoading(false);

      const responseData = await response.json();
      if (response.status === 200) {
        revalidateData();
        toast({
          title: "Объект привязан",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Произошла ошибка:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="houses"
          render={({ field }) => (
            <FormItem className="py-4">
              <FormLabel>Объекты недвижимости</FormLabel>
              <FormControl>
                <MultipleSelector
                  value={field.value}
                  onChange={field.onChange}
                  defaultOptions={houseOptions}
                  placeholder="Выберите дом..."
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      Нет результатов.
                    </p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Привязать</Button>
      </form>
    </Form>
  );
};
export default UserHousesForm;
