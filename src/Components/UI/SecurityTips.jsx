import React from "react";

const SecurityTips = () => {
  return (
    <div className="flex-col-center w-full h-full rounded-16 ">
      <div className="flex-center w-full h-30 hidden md:block"></div>
      <ul className="flex flex-col items-start font-normal text-[14px] gap-5 p-5">
        <h4 className="text-[18px] font-bold">نکات امنیتی</h4>
        <li>
          سامانه دانشگاه با استفاده از پروتکل امن SSL به مشتریان خود ارائه خدمت
          نموده و با آدرس https://login.com شروع می شود.
        </li>
        <li>
          لطفا پیش از ورود هرگونه اطلاعات، آدرس موجود در بخش مرورگر وب خود را با
          آدرس فوق مقایسه نمایید و درصورت مشاهده هر نوع مغایرت احتمالی، از ادامه
          کار منصرف شده و موضوع را با ما در میان بگذارید.
        </li>
        <li>
          برای حفاظت از اطلاعات حساب کاربری خود، حتی المقدور از صفحه کلید مجازی
          استفاده نمایید.
        </li>
        <li>
          هرگز اطلاعات حساب کاربری (نام کاربری و کلمه عبور) خود را در اختیار
          دیگران قرار ندهید.
        </li>
        <li>
          پس از اتمام کار با سامانه، حتما بر روی دکمه خروج از سامانه کلیک
          نمایید.
        </li>
        <li>رویه ارائه خدمات و انجام معاملات برخط سامانه را مطالعه نمایید.</li>
      </ul>
    </div>
  );
};

export default SecurityTips;
