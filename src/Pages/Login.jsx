import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { loginSchema } from "../Validators/LoginSchema";
import Logo from "../Components/UI/Logo";
import SecurityTips from "../Components/UI/SecurityTips";

const API_URL = "http://127.0.0.1:8000/api/accounts/login/";

const ROLE_ROUTES = {
  ADMIN: "/admin/dashboard",
  STUDENT: "/student/dashboard",
  PROFESSOR: "/professor/dashboard",
};

const Login = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const SendForm = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, {
        username: data.username,
        password: data.password,
      });

      const { access, refresh, user } = response.data;
      console.log("Login response:", response.data);
      console.log("User roles:", user?.roles);
      if (!access || !user || !Array.isArray(user.roles)) {
        setServerError("پاسخ دریافتی از سرور معتبر نیست.");
        return;
      }

      const userRole = user.roles.find((role) =>
        Object.prototype.hasOwnProperty.call(ROLE_ROUTES, role),
      );

      if (!userRole) {
        setServerError("نقش کاربری شما مشخص نیست.");
        return;
      }

      localStorage.setItem("access", access);

      if (refresh) {
        localStorage.setItem("refresh", refresh);
      } else {
        localStorage.removeItem("refresh");
      }

      localStorage.setItem("user", JSON.stringify(user));

      navigate(ROLE_ROUTES[userRole], { replace: true });
    } catch (error) {
      const status = error.response?.status;

      if (status === 400 || status === 401) {
        setServerError("نام کاربری یا کلمه عبور صحیح نیست.");
      } else if (!error.response) {
        setServerError("ارتباط با سرور برقرار نشد.");
      } else {
        setServerError("خطایی هنگام ورود به سامانه رخ داد.");
      }
    } finally {
      setIsLoading(false);
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
              <label className="font-bold text-[12px] text-start px-3">
                نام کاربری/ شماره دانشجویی
              </label>

              <input
                type="text"
                autoComplete="username"
                {...register("username")}
                className={`w-full border-2 bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${
                  errors.username
                    ? "border-red-500 outline-0"
                    : "border-myblue-200"
                }`}
              />

              {errors.username?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start justify-center w-full">
              <label className="font-bold text-[12px] text-start px-3">
                کلمه عبور
              </label>

              <input
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className={`w-full border-2 border-myblue-200 bg-mygray-200 rounded-4 px-16 py-2 text-center font-normal ${
                  errors.password
                    ? "border-red-500 outline-0"
                    : "border-myblue-200"
                }`}
              />

              {errors.password?.message && (
                <span className="text-red-500 text-[13px]">
                  {errors.password.message}
                </span>
              )}

              <Link
                to="/ForgotPassword"
                className="flex-center text-myblue-300 text-[12px] text-start p-2 self-end"
              >
                فراموشی کلمه عبور
                <IoIosArrowBack size={18} />
              </Link>
            </div>

            {serverError && (
              <p role="alert" className="text-red-500 text-[13px] text-center">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-myblue-600 text-white rounded-4 px-16 py-2 text-center disabled:opacity-60"
            >
              {isLoading ? "در حال ورود..." : "ورود"}
            </button>
          </form>
        </div>

        <SecurityTips />
      </div>
    </div>
  );
};

export default Login;
