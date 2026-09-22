import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "../Validators/ForgotPasswordSchema";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: {
      username: "",
      phonenumber: "",
      capcha: "",
    },
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const RecoveryPassword = (data) => {
    console.log(data);
  };

  useEffect(() => {
    if (!isSubmitSuccessful) return;
    const timer = setTimeout(() => {
      navigate("/verify");
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
            <h2>بازیابی کلمه عبور</h2>
          </div>
          <form
            onSubmit={handleSubmit(RecoveryPassword)}
            className="flex-col-center w-full mt-5 gap-2 border-t-2 border-myblue-200 py-8"
          >
            <div className="flex flex-col items-start justify-center w-full">
              <label className="font-bold text-[12px] text-start  px-3">
                کدملی / شماره دانشجویی
              </label>
              <input
                type="text"
                {...register("username")}
                className={`w-full border-2  bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${errors.username ? "border-red-500 outline-0" : "border-myblue-200"}`}
              />
              {errors.username?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.username?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start justify-center w-full">
              <label className="font-bold text-[12px] text-start  px-3">
                شماره همراه
              </label>
              <input
                type="text"
                {...register("phonenumber")}
                className={`w-full border-2 border-myblue-200 bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${errors.phonenumber ? "border-red-500 outline-0" : "border-myblue-200"}`}
              />
              {errors.phonenumber?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.phonenumber?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col items-start justify-center w-full">
              <label className="font-bold text-[12px] text-start  px-3">
                کد امنیتی
              </label>
              <div
                className={`flex w-full max-w-87 h-10.75 border-2  bg-mygray-200 rounded-4 text-center font-normal ${errors.capcha ? "border-red-500 outline-0" : "border-myblue-200"}`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  {...register("capcha")}
                  className="w-full h-full text-center outline-0"
                />
                <img
                  src="./Images/captcha/1.png"
                  alt="captcha"
                  className="w-full max-w-24 h-full"
                />
              </div>
              {errors.capcha?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.capcha?.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-myblue-600 text-white rounded-4 px-16 py-2 text-center mt-10"
            >
              ارسال کد
            </button>
            <Link
              to={"/login"}
              className="w-full border-2 border-myblue-200 rounded-4 px-16 py-2 text-center"
            >
              بازگشت
            </Link>
          </form>
        </div>
        <div className="flex-col-center w-full h-full rounded-16 ">
          <div className="w-full h-30 hidden md:block"></div>
          <ul className="flex flex-col items-start font-normal text-[14px] gap-5 p-5">
            <li>
               سامانه دانشگاه با استفاده از پروتکل امن SSL به مشتریان خود
              ارائه خدمت نموده و با آدرس https://login.com شروع می شود.
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
              رویه ارائه خدمات و انجام معاملات برخط سامانه را مطالعه
              نمایید.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
