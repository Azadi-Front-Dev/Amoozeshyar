import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  username: z
    .string()
    .min(1, "وارد کردن نام کاربری الزامی است !")
    .length(14, "  نام کاربری  صحیح نیست  !"),
  // .regex(/^\d{14}$/, "کد ملی / شماره دانشجویی باید  ۱۴ رقم باشد!"),

  phonenumber: z.string().regex(/^09\d{9}$/, "شماره همراه صحیح نیست!"),

  capcha: z
    .string()
    .min(1, "وارد کردن کد امنیتی الزامی است!")
    .length(4, "کد امنیتی صحیح نیست !"),
});
