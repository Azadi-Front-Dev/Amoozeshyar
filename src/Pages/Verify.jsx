import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
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
          <div className="flex-col-center w-full ">
            <img
              src="./Icons/Logo.png"
              alt="Azad Islamic University logo"
              className="w-27"
            />
            <h2> بازیابی کلمه عبور </h2>
          </div>
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
        <div className="flex-col-center w-full h-full rounded-16 ">
          <div className="flex-center w-full h-30 hidden md:block"></div>
          <ul className="flex flex-col items-start font-normal text-[14px] gap-5 p-5">
            <h4 className="text-[18px] font-bold">نکات امنیتی</h4>
            <li>
              سامانه دانشگاه با استفاده از پروتکل امن SSL به مشتریان خود ارائه
              خدمت نموده و با آدرس https://login.com شروع می شود.
            </li>
            <li>
              لطفا پیش از ورود هرگونه اطلاعات، آدرس موجود در بخش مرورگر وب خود
              را با آدرس فوق مقایسه نمایید و درصورت مشاهده هر نوع مغایرت
              احتمالی، از ادامه کار منصرف شده و موضوع را با ما در میان بگذارید.
            </li>
            <li>
              برای حفاظت از اطلاعات حساب کاربری خود، حتی المقدور از صفحه کلید
              مجازی استفاده نمایید.
            </li>
            <li>
              هرگز اطلاعات حساب کاربری (نام کاربری و کلمه عبور) خود را در اختیار
              دیگران قرار ندهید.
            </li>
            <li>
              پس از اتمام کار با سامانه، حتما بر روی دکمه خروج از سامانه کلیک
              نمایید.
            </li>
            <li>
              رویه ارائه خدمات و انجام معاملات برخط سامانه را مطالعه نمایید.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Verify;
