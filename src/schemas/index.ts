import * as zod from "zod";

const phoneRegex = /(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/;
const fullnmaeRegex = /^([А-ЯЁ][а-яё]{1,}\s){2,}[А-ЯЁ][а-яё]{1,}$/;

export const RegisterSchema = zod
  .object({
    email: zod.string().email({
      message: "Введите электронную почту",
    }),
    username: zod.string().min(4, {
      message: "Введите имя, минимум 4 символа",
    }),
    fullname: zod.string().regex(fullnmaeRegex, {
      message: "Введите ФИО",
    }),
    phone: zod
      .string()
      .regex(phoneRegex, {
        message: "Введите корректный номер телефона напр. 79876543211",
      })
      .max(11, {
        message: "Номер телефона должен содержать не более 11 символов",
      }),
    password: zod.string().min(8, {
      message: "Пароль должен содержать не менее 8 символов",
    }),
    confirm: zod.string().min(8, {
      message: "Пароль должен содержать не менее 8 символов",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Пароли не совпадают",
    path: ["confirm"],
  });

export const LoginSchema = zod.object({
  identifier: zod.string().min(2, {
    message: "Введите логин",
  }),
  password: zod.string().min(6, {
    message: "Пароль должен содержать не менее 8 символов",
  }),
});

export const OrderSchema = zod
  .object({
    title: zod
      .string()
      .min(6, { message: "Длина заголовка должна быть минимум 6 символов" }),
    fromDateTime: zod.string().refine(
      (val) => {
        const now = new Date();
        const fromDateTime = new Date(val);
        return fromDateTime >= now;
      },
      { message: "Дата начала не может быть в прошлом" }
    ),
    toDateTime: zod.string().refine(
      (val) => {
        const toDateTime = new Date(val);
        return toDateTime > new Date();
      },
      { message: "Дата окончания должна быть только в будущем" }
    ),
    description: zod.string().optional(),
    orderType: zod.string().min(1, { message: "Выберите тип заявки" }),
    house: zod.string().min(1, { message: "Выберите объект недвижимости" }),
  })
  .superRefine((data, ctx) => {
    const fromDateTime = new Date(data.fromDateTime);
    const toDateTime = new Date(data.toDateTime);

    if (toDateTime <= fromDateTime) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["toDateTime"],
        message: "Дата окончания должна быть позже даты начала",
      });
    }
  });

export const HouseSchema = zod.object({
  title: zod.string().min(2, { message: "Слишком короткий заголовок" }),
  codeFIAS: zod.string(),
  address: zod.string(),
  details: zod.string(),
});

export const InvoiceSchema = zod.object({
  title: zod.string().min(2, { message: "Слишком короткий заголовок" }),
  date: zod.string().min(1, { message: "Укажите дату" }),
  amount: zod.string().min(1, { message: "Укажите сумму" }),
  description: zod.string().min(2, { message: "Слишком короткое описание" }),
  status: zod.string(),
  house: zod.string().min(1, { message: "Выберите объект недвижимости" }),
});

export const UserFormSchema = zod.object({
  fullname: zod.string().min(6).max(50),
  email: zod.string().email(),
  phone: zod.string().min(6).max(20),
  isAdmin: zod.boolean(),
  confirmed: zod.boolean(),
  active: zod.boolean(),
  blocked: zod.boolean(),
});

export const AdminOrderSchema = zod
  .object({
    description: zod.string(),
    fromDateTime: zod.string().refine(
      (val) => {
        const now = new Date();
        const fromDateTime = new Date(val);
        return fromDateTime >= now;
      },
      { message: "Дата начала не может быть в прошлом" }
    ),
    toDateTime: zod.string().refine(
      (val) => {
        const toDateTime = new Date(val);
        return toDateTime > new Date();
      },
      { message: "Дата окончания должна быть только в будущем" }
    ),
    orderType: zod.string().min(1, { message: "Выберите тип заявки" }),
    result: zod.string().optional(),
    status: zod.string().min(1, { message: "Укажите статус" }),
    title: zod.string().min(1, { message: "Укажите заголовок" }),
  })
  .superRefine((data, ctx) => {
    const fromDateTime = new Date(data.fromDateTime);
    const toDateTime = new Date(data.toDateTime);

    if (toDateTime <= fromDateTime) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["toDateTime"],
        message: "Дата окончания должна быть позже даты начала",
      });
    }
  });
