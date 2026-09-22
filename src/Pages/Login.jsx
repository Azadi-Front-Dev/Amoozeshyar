import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../Validators/LoginSchema";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const SendForm = (data) => {
    console.log(data);
  };

  return (
    <div className=" h-screen flex-center  mx-auto font-bold text-center mobile:p-8 mobile:bg-mygray-200 ">
      <div className="flex-col-center w-full max-w-100 bg-white mobile:border-2 mobile:border-mygray-100 mobile:shadow-myshadow-100 rounded-8 py-10 px-6">
        <div className="flex-col-center w-full">
          <img
            src="./Icons/Logo.png"
            alt="Azad Islamic University logo"
            className="w-27"
          />
          <h2>ورود به سامانه</h2>
        </div>
        <form
          onSubmit={handleSubmit(SendForm)}
          className="flex-col-center w-full mt-5 gap-4 border-t-2 border-myblue-200 py-8"
        >
          <div className="flex flex-col items-start justify-center w-full">
            <label className="font-bold text-[12px] text-start  px-3">
              نام کاربری/ شماره دانشجویی
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
              کلمه عبور
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full border-2 border-myblue-200 bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${errors.password ? "border-red-500 outline-0" : "border-myblue-200"}`}
            />
            {errors.password?.message && (
              <span className="text-red-500 text-[13px]">
                {errors.password?.message}
              </span>
            )}
            <Link
              to={"/ForgotPassword"}
              className="flex-center text-myblue-300 text-[12px] text-start  p-2 self-end"
            >
              فراموشی کلمه عبور
              <IoIosArrowBack size={18} />
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-myblue-600 text-white rounded-4 px-16 py-2 text-center"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
