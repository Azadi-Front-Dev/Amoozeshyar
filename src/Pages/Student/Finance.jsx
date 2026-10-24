
import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineCreditCard,
  HiOutlineBanknotes,
  HiOutlineReceiptPercent,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlineXMark,
  HiOutlineArrowPath,
} from "react-icons/hi2";

const API_URL = "http://127.0.0.1:8000/api/finance/student/";

const formatMoney = (amount) =>
  new Intl.NumberFormat("fa-IR").format(Number(amount) || 0);

const formatDate = (value) => {
  if (!value) return "ثبت نشده";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    calendar: "persian",
  }).format(date);
};

const invoiceStatus = (status) => {
  const statuses = {
    UNPAID: "پرداخت‌نشده",
    PARTIALLY_PAID: "پرداخت‌نشده",
    PAID: "پرداخت‌شده",
    CANCELLED: "لغوشده",
  };

  return statuses[String(status || "").toUpperCase()] || status || "نامشخص";
};

const paymentStatus = (status) => {
  const statuses = {
    PENDING: "در انتظار پرداخت",
    SUCCESS: "موفق",
    FAILED: "ناموفق",
    REFUNDED: "مستردشده",
  };

  return statuses[String(status || "").toUpperCase()] || status || "نامشخص";
};

const paymentMethod = (method) => {
  const methods = {
    ONLINE: "درگاه پرداخت",
    CARD: "کارت بانکی",
    CASH: "نقدی",
    BANK_TRANSFER: "انتقال بانکی",
  };

  return methods[String(method || "").toUpperCase()] || method || "ثبت نشده";
};

const invoiceTitle = (type) => {
  const types = {
    TUITION: "شهریه",
    REGISTRATION: "ثبت‌نام",
    SERVICE: "خدمات آموزشی",
    OTHER: "سایر هزینه‌ها",
  };

  return types[String(type || "").toUpperCase()] || "هزینه آموزشی";
};

function SummaryCard({ title, amount, caption, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{title}</p>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            tones[tone] || tones.blue
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-slate-800">
          {formatMoney(amount)}
        </span>
        <span className="text-xs text-slate-400">تومان</span>
      </div>

      <p className="mt-2 text-xs text-slate-400">{caption}</p>
    </div>
  );
}

function ChargeStatus({ status }) {
  const paid = status === "PAID";
  const cancelled = status === "CANCELLED";

  const styles = paid
    ? "bg-emerald-50 text-emerald-700"
    : cancelled
      ? "bg-slate-100 text-slate-500"
      : "bg-amber-50 text-amber-700";

  const Icon = paid
    ? HiOutlineCheckCircle
    : cancelled
      ? HiOutlineXMark
      : HiOutlineClock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${styles}`}
    >
      <Icon className="h-4 w-4" />
      {invoiceStatus(status)}
    </span>
  );
}

function TransactionStatus({ status }) {
  const successful = status === "SUCCESS";
  const pending = status === "PENDING";
  const refunded = status === "REFUNDED";

  const styles = successful
    ? "bg-emerald-50 text-emerald-700"
    : pending
      ? "bg-amber-50 text-amber-700"
      : refunded
        ? "bg-slate-100 text-slate-600"
        : "bg-rose-50 text-rose-700";

  const Icon = successful
    ? HiOutlineCheckCircle
    : pending
      ? HiOutlineClock
      : HiOutlineExclamationCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${styles}`}
    >
      <Icon className="h-4 w-4" />
      {paymentStatus(status)}
    </span>
  );
}

function EmptyState({ message, icon: Icon = HiOutlineDocumentText }) {
  return (
    <div className="px-5 py-12 text-center">
      <Icon className="mx-auto h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default function Finance() {
  const [account, setAccount] = useState(null);
  const [charges, setCharges] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chargeFilter, setChargeFilter] = useState("همه");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const loadFinance = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        throw new Error("نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.");
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("احراز هویت ناموفق است؛ دوباره وارد حساب کاربری شوید.");
      }

      if (response.status === 403) {
        throw new Error("شما مجوز مشاهده اطلاعات مالی دانشجو را ندارید.");
      }

      if (response.status === 404) {
        throw new Error("حساب مالی فعالی برای این دانشجو پیدا نشد.");
      }

      if (!response.ok) {
        throw new Error(`خطا در دریافت اطلاعات مالی (کد ${response.status})`);
      }

      const data = await response.json();

      setAccount(data);
      setCharges(Array.isArray(data.invoices) ? data.invoices : []);
      setTransactions(Array.isArray(data.payments) ? data.payments : []);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "ارتباط با سرور برقرار نشد. روشن بودن Django و آدرس API را بررسی کنید."
          : err.message || "دریافت اطلاعات مالی ناموفق بود."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const unpaidAmount = useMemo(
    () =>
      charges
        .filter((charge) =>
          ["UNPAID", "PARTIALLY_PAID"].includes(
            String(charge.status || "").toUpperCase()
          )
        )
        .reduce((sum, charge) => sum + (Number(charge.amount) || 0), 0),
    [charges]
  );

  const paidChargesAmount = useMemo(
    () =>
      charges
        .filter(
          (charge) =>
            String(charge.status || "").toUpperCase() === "PAID"
        )
        .reduce((sum, charge) => sum + (Number(charge.amount) || 0), 0),
    [charges]
  );

  const totalTransactions = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            String(transaction.status || "").toUpperCase() === "SUCCESS"
        )
        .reduce(
          (sum, transaction) => sum + (Number(transaction.amount) || 0),
          0
        ),
    [transactions]
  );

  const filteredCharges = useMemo(
    () =>
      charges.filter((charge) => {
        const status = String(charge.status || "").toUpperCase();

        if (chargeFilter === "همه") return true;
        if (chargeFilter === "پرداخت‌نشده") {
          return ["UNPAID", "PARTIALLY_PAID"].includes(status);
        }
        if (chargeFilter === "پرداخت‌شده") return status === "PAID";

        return true;
      }),
    [charges, chargeFilter]
  );

  const filteredTransactions = useMemo(() => {
    const query = transactionSearch.trim().toLowerCase();

    if (!query) return transactions;

    return transactions.filter((transaction) => {
      const searchable = [
        transaction.description,
        transaction.tracking_code,
        transaction.payment_id,
        transaction.invoice_title,
        paymentMethod(transaction.payment_method),
        paymentStatus(transaction.status),
        formatDate(transaction.payment_date),
      ];

      return searchable.some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );
    });
  }, [transactions, transactionSearch]);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-slate-50/70 p-6"
      >
        <div className="text-center">
          <HiOutlineArrowPath className="mx-auto h-9 w-9 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">
            در حال دریافت اطلاعات مالی...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="min-h-[60vh] bg-slate-50/70 p-4 sm:p-8"
      >
        <div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
          <HiOutlineExclamationCircle className="h-9 w-9 text-rose-500" />
          <h1 className="mt-4 text-xl font-bold text-slate-800">
            دریافت اطلاعات مالی ناموفق بود
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{error}</p>

          <button
            type="button"
            onClick={loadFinance}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <HiOutlineArrowPath className="h-4 w-4" />
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <HiOutlineCreditCard className="h-5 w-5" />
              <span>پنل دانشجویی</span>
              <span>/</span>
              <span>امور مالی</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
              امور مالی
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              مشاهده وضعیت شهریه، بدهی‌ها و سوابق پرداخت
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPaymentInfo(true)}
            disabled={unpaidAmount <= 0}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <HiOutlineCreditCard className="h-5 w-5" />
            پرداخت شهریه
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="بدهی فاکتورها"
            amount={unpaidAmount}
            caption="مجموع مبلغ فاکتورهای تسویه‌نشده"
            icon={HiOutlineExclamationCircle}
            tone="amber"
          />

          <SummaryCard
            title="پرداخت‌های موفق"
            amount={totalTransactions}
            caption="مجموع تراکنش‌های موفق ثبت‌شده"
            icon={HiOutlineCheckCircle}
            tone="emerald"
          />

          <SummaryCard
            title="فاکتورهای تسویه‌شده"
            amount={paidChargesAmount}
            caption="مجموع مبلغ فاکتورهای پرداخت‌شده"
            icon={HiOutlineBanknotes}
            tone="blue"
          />
        </section>

        {account && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-800">حساب مالی دانشجو</h2>
                <p className="mt-1 text-xs text-slate-500">
                  شماره حساب: {formatMoney(account.account_id)}
                </p>
              </div>

              <span
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  account.is_active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {account.is_active ? "حساب فعال" : "حساب غیرفعال"}
              </span>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">مانده حساب طبق سرور</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-800">
                {formatMoney(account.balance)}{" "}
                <span className="text-xs font-medium text-slate-400">
                  تومان
                </span>
              </p>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-800">ریز بدهی‌ها و شهریه</h2>
              <p className="mt-1 text-xs text-slate-500">
                فاکتورها و وضعیت تسویه آن‌ها
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["همه", "پرداخت‌نشده", "پرداخت‌شده"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setChargeFilter(filter)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    chargeFilter === filter
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-right">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs text-slate-500">
                  <th className="px-5 py-4 font-semibold">عنوان هزینه</th>
                  <th className="px-4 py-4 font-semibold">تاریخ سررسید</th>
                  <th className="px-4 py-4 font-semibold">مبلغ</th>
                  <th className="px-5 py-4 font-semibold">وضعیت</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCharges.map((charge) => (
                  <tr
                    key={charge.invoice_id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {charge.title || invoiceTitle(charge.invoice_type)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {invoiceTitle(charge.invoice_type)}
                        {" · "}
                        شماره فاکتور {charge.invoice_id}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                      {formatDate(charge.due_date)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="text-sm font-bold text-slate-800">
                        {formatMoney(charge.amount)}
                      </span>
                      <span className="mr-1 text-xs text-slate-400">
                        تومان
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <ChargeStatus status={charge.status} />
                    </td>
                  </tr>
                ))}

                {filteredCharges.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <EmptyState message="فاکتوری برای نمایش وجود ندارد." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-slate-500">
              {formatMoney(filteredCharges.length)} مورد
            </span>
            <div className="text-sm">
              <span className="text-slate-500">جمع فاکتورهای پرداخت‌نشده: </span>
              <span className="font-bold text-amber-700">
                {formatMoney(unpaidAmount)} تومان
              </span>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-800">سوابق پرداخت</h2>
              <p className="mt-1 text-xs text-slate-500">
                تاریخچه تراکنش‌های ثبت‌شده در حساب مالی
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={transactionSearch}
                onChange={(event) => setTransactionSearch(event.target.value)}
                placeholder="جست‌وجوی تراکنش..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-right">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs text-slate-500">
                  <th className="px-5 py-4 font-semibold">شرح تراکنش</th>
                  <th className="px-4 py-4 font-semibold">شماره پیگیری</th>
                  <th className="px-4 py-4 font-semibold">تاریخ</th>
                  <th className="px-4 py-4 font-semibold">مبلغ</th>
                  <th className="px-5 py-4 font-semibold">وضعیت</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.payment_id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <HiOutlineReceiptPercent className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {transaction.description ||
                              transaction.invoice_title ||
                              "پرداخت مالی"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {paymentMethod(transaction.payment_method)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        dir="ltr"
                        className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        {transaction.tracking_code || "ثبت نشده"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                      {formatDate(transaction.payment_date)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="text-sm font-bold text-slate-800">
                        {formatMoney(transaction.amount)}
                      </span>
                      <span className="mr-1 text-xs text-slate-400">
                        تومان
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <TransactionStatus status={transaction.status} />
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState
                        icon={HiOutlineMagnifyingGlass}
                        message="تراکنشی با این مشخصات پیدا نشد."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
            <p className="text-xs text-slate-500">
              تعداد تراکنش‌های قابل نمایش: {formatMoney(filteredTransactions.length)}
            </p>
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <HiOutlineDocumentText className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              راهنمای امور مالی
            </p>
            <p className="mt-1 text-xs leading-6 text-blue-800/80">
              اطلاعات این صفحه از سامانه مالی دریافت می‌شود. برای پرداخت واقعی
              باید درگاه معتبر دانشگاه و تأیید سمت سرور پیاده‌سازی شود.
              در صورت مغایرت، شماره پیگیری تراکنش را نگه دارید و با امور مالی
              دانشگاه تماس بگیرید.
            </p>
          </div>
        </div>
      </div>

      {showPaymentInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={() => setShowPaymentInfo(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <HiOutlineCreditCard className="h-6 w-6" />
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentInfo(false)}
                aria-label="بستن"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <h3
              id="payment-modal-title"
              className="mt-5 text-lg font-bold text-slate-800"
            >
              پرداخت شهریه
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              اتصال به درگاه پرداخت هنوز فعال نشده است. در حال حاضر امکان
              پرداخت واقعی از این صفحه وجود ندارد.
            </p>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                مجموع فاکتورهای پرداخت‌نشده
              </p>
              <p className="mt-2 text-xl font-extrabold text-slate-800">
                {formatMoney(unpaidAmount)}{" "}
                <span className="text-xs font-medium text-slate-500">
                  تومان
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPaymentInfo(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
