
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import Logo from "../Components/UI/Logo";
import SecurityTips from "../Components/UI/SecurityTips";
import { Verification } from "../Validators/Verification";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const Verify = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      otp: "",
      new_password: "",
      confirm_password: "",
    },
    resolver: zodResolver(Verification),
  });

  const SendForm = async (data) => {
    setServerError("");
    setSuccessMessage("");

    if (!state?.national_id || !state?.phone_number) {
      setServerError(
        "اطلاعات بازیابی موجود نیست. لطفاً دوباره درخواست کد بدهید."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/accounts/password-reset/confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            national_id: state.national_id,
            phone_number: state.phone_number,
            otp: data.otp.trim(),
            new_password: data.new_password,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(
          result.detail || "تأیید کد انجام نشد. دوباره تلاش کنید."
        );
        return;
      }

      setSuccessMessage(
        result.detail || "رمز عبور با موفقیت تغییر کرد."
      );

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch {
      setServerError(
        "ارتباط با سرور برقرار نشد. اتصال خود را بررسی کنید."
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex-center bg-mygray-100 mobile:p-8">
      <div className="flex flex-col items-center justify-center max-w-240 md:flex-row bg-white mobile:border-2 mobile:border-mygray-100 mobile:shadow-myshadow-100 rounded-8">
        <div className="flex-col-center w-full max-w-100 rounded-8 py-5 px-6">
          <Logo />

          <form
            onSubmit={handleSubmit(SendForm)}
            className="flex-col-center w-full mt-5 gap-4 border-t-2 border-myblue-200 py-8"
          >
            <div className="flex flex-col items-start justify-center w-full">
              <h3 className="font-bold text-[12px] px-3">
                کد یکبار مصرف را وارد و رمز عبور جدید خود را تعیین کنید.
              </h3>
            </div>

            <div className="flex flex-col items-start justify-center w-full">
              <label className="font-bold text-[12px] text-start px-3">
                کد تأیید
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                dir="ltr"
                maxLength={6}
                placeholder="1 2 3 4 5 6"
                {...register("otp")}
                className={`w-full border-2 bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${
                  errors.otp
                    ? "border-red-500 outline-0"
                    : "border-myblue-200"
                }`}
              />

              {errors.otp?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.otp.message}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start justify-center w-full">
              <label className="font-bold text-[12px] text-start px-3">
                رمز عبور جدید
              </label>

              <input
                type="password"
                autoComplete="new-password"
                {...register("new_password")}
                className={`w-full border-2 bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${
                  errors.new_password
                    ? "border-red-500 outline-0"
                    : "border-myblue-200"
                }`}
              />

              {errors.new_password?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.new_password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start justify-center w-full">
              <label className="font-bold text-[12px] text-start px-3">
                تکرار رمز عبور جدید
              </label>

              <input
                type="password"
                autoComplete="new-password"
                {...register("confirm_password")}
                className={`w-full border-2 bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${
                  errors.confirm_password
                    ? "border-red-500 outline-0"
                    : "border-myblue-200"
                }`}
              />

              {errors.confirm_password?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.confirm_password.message}
                </span>
              )}
            </div>

            {serverError && (
              <p role="alert" className="w-full text-red-500 text-[13px]">
                {serverError}
              </p>
            )}

            {successMessage && (
              <p role="status" className="w-full text-green-600 text-[13px]">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-myblue-600 text-white rounded-4 px-16 py-2 text-center disabled:opacity-60"
            >
                تغییر کلمه عبور
            </button>
          </form>
        </div>

        <SecurityTips />
      </div>
    </div>
  );
};

export default Verify;
