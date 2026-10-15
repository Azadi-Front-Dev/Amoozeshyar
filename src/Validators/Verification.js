// import { z } from "zod";

// export const Verification = z.object({
//   otp: z
//     .string()
//     .min(1, "وارد کردن کد تایید الزامی است !")
//     .length(6, " کد تایید   صحیح نیست!  "),

// });




import { z } from "zod";

export const Verification = z
  .object({
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "کد تأیید باید دقیقاً ۶ رقم باشد."),

    new_password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد."),

    confirm_password: z
      .string()
      .min(1, "تکرار رمز عبور الزامی است."),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "رمز عبور و تکرار آن یکسان نیستند.",
    path: ["confirm_password"],
  });
