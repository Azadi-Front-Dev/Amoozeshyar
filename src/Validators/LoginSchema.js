import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "وارد کردن نام کاربری الزامی است !")
    .min(10, "  نام کاربری  صحیح نیست  !")
    .max(14, "  نام کاربری  صحیح نیست  !"),
  password: z.string().min(1, "وارد کردن  کلمه عبور الزامی است !"),
  // .min(8, "کلمه عبور حداقل باید شامل 8 کاراکتر باشد !"),
});
