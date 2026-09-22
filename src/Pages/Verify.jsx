import React, { useEffect } from "react";
import Logo from "../Components/UI/Logo";
import { useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import SecurityTips from "../Components/UI/SecurityTips";
import { Verification } from "../Validators/Verification";

const Verify = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(Verification),
  });

  const SendForm = (data) => {
    console.log(data);
  };

  useEffect(() => {
    if (!isSubmitSuccessful) return;
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [isSubmitSuccessful, navigate]);

  return (
    <div className="w-full min-h-screen flex-center bg-mygray-100 mobile:p-8">
      <div className="flex flex-col items-center  justify-center max-w-240 md:flex-row  bg-white mobile:border-2 mobile:border-mygray-100 mobile:shadow-myshadow-100 rounded-8  ">
        <div className="flex-col-center w-full max-w-100  rounded-8 py-5 px-6">
          <Logo />
          <form
            onSubmit={handleSubmit(SendForm)}
            className="flex-col-center w-full mt-5 gap-4 border-t-2 border-myblue-200 py-8"
          >
            <div className="flex flex-col items-start justify-center w-full">
              <h3 className="font-bold text-[12px] px-3">
                کد یکبار مصرف به شماره مورد نظر ارسال شد
              </h3>
            </div>
            <div className="flex flex-col items-start justify-center w-full">
              <label className="font-bold text-[12px] text-start  px-3">
                وارد کردن کد
              </label>
              <input
                type="text"
                dir="ltr"
                placeholder="1 2 3 4 5 "
                {...register("otp")}
                className={`w-full border-2 border-myblue-200 bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${errors.otp ? "border-red-500 outline-0" : "border-myblue-200"}`}
              />
              {errors.otp?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.otp?.message}
                </span>
              )}
              <p className="text-[14px] p-5">1:58 مدت زمان ارسال مجدد کد</p>
            </div>
            <button
              type="submit"
              className="w-full bg-myblue-600 text-white rounded-4 px-16 py-2 text-center"
            >
              برسی کد
            </button>
          </form>
        </div>
        <SecurityTips />
      </div>
    </div>
  );
};

export default Verify;
