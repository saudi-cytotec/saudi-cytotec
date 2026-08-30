import { Link } from "react-router-dom";
import { DISCLAIMER_SHORT } from "../data/site";

export function DisclaimerBanner() {
  return (
    <div className="rounded-3xl border-r-4 border-warn bg-warn-soft px-5 py-4 text-sm leading-8">
      <strong className="text-warn">تنبيه طبي: </strong>
      {DISCLAIMER_SHORT}{" "}
      <Link to="/medical-disclaimer" className="font-semibold text-brand underline underline-offset-4">
        اقرأ إخلاء المسؤولية كاملاً
      </Link>
    </div>
  );
}
