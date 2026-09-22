import { z } from "zod";

export const Verification = z.object({
  otp: z
    .string()
    .min(1, "وارد کردن کد تایید الزامی است !")
    .length(5, " کد تایید   صحیح نیست!  "),

});
