import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const Login = () => {
  return (
    <div className=" h-screen flex-center  mx-auto font-bold text-center mobile:p-8 mobile:bg-mygray-200 ">
      <div className="flex-col-center w-full max-w-100 bg-white mobile:border-2 mobile:border-mygray-100 mobile:shadow-myshadow-100 rounded-8 py-10 px-6">
        <div className="flex-col-center w-27 ">
          <img src="./Icons/Logo.png" alt="Azad Islamic University logo" />
          <h2>ورود به سامانه</h2>
        </div>
        <div className="flex-col-center w-full mt-5 gap-4 border-t-2 border-myblue-200 py-8">
          <div className="flex flex-col items-start justify-center w-full">
            <label className="font-bold text-[12px] text-start  px-3">
              نام کاربری/ شماره دانشجویی
            </label>
            <input
              type="text"
              className="w-full border-2 border-myblue-200 bg-mygray-200 rounded-4 px-16 py-2 text-center"
            />
          </div>
          <div className="flex flex-col items-start justify-center w-full">
            <label className="font-bold text-[12px] text-start  px-3">
              کلمه عبور
            </label>
            <input
              type="password"
              className="w-full border-2 border-myblue-200 bg-mygray-200 rounded-4 px-16 py-2 text-center"
            />
            <Link
              to={"/ForgotPassword"}
              className="flex-center text-myblue-300 text-[12px] text-start  p-2 self-end"
            >
              فراموشی کلمه عبور
              <IoIosArrowBack size={18} />
            </Link>
          </div>
          <button
            type="password"
            className="w-full bg-myblue-600 text-white rounded-4 px-16 py-2 text-center"
          >
            ورود
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
