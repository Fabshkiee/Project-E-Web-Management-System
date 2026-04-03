const MEMBERSHIP_PLANS = [
  {
    id: "dayPass1",
    title: "Day Pass",
    price: "150",
    unit: "day",
    description: "Perfect for first-timers or travelers.",
    features: [
      "Access to strength equipment",
      "Standard shower & locker use",
      "Valid for 24 hours",
    ],
  },
  {
    id: "dayPass2",
    title: "Student Day Pass",
    price: "100",
    unit: "day",
    description: "A budget-friendly option for students.",
    features: [
      "Accesss to strength equipment",
      "Standard shower & locker use",
      "Valid for 24 hours",
      "Save 33%",
    ],
  },
  {
    id: "memPlan1",
    title: "Monthly Pass",
    price: "900",
    unit: "monthly",
    description: "The complete fitness experience.",
    features: [
      "Unlimited Entry and Access",
      "Full amenity access",
      "Valid for 30 days",
    ],
  },
  {
    id: "memPlan2",
    title: "Student Monthly Pass",
    price: "700",
    unit: "monthly",
    description:
      "Best option for student atheletes. Valid student ID required upon registration.",
    features: [
      "Unlimited Entry and Access",
      "Full amenity access",
      "Save 22% off from standard monthly rate.",
      "Valid for 30 days",
    ],
    isPopular: true,
  },
];

export default function Membership() {
  return (
    <section className=" relative z-0 overflow-hidden">
      {/* HEADING CONTAINER */}
      <div className="relative isolate  ">
        {/* THE BLOB OF RED BEHIND THE TEXT */}
        <div
          className="absolute inset-0 bg-land-crimson/10 rounded-[9999px] w-[800px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        blur-[200px]   "
        />

        {/* Title CARD: MEMBERSHIP RATES */}
        <div className="">
          <div className="landing-h2 text-center mt-[96px] mb-4">
            Membership Rates
          </div>
          <div className="landing-p-lg text-center text-muted">
            No hidden fees. Cancel anytime.
          </div>
        </div>
      </div>

      {/* GRID FOR DIFFERENT MEMBER PRICES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] lg:gap-[15px] mx-[32px] py-[33px] justify-items-center mt-16 mb-[96px] items-center   ">
        
        
        {/* INDIVIDUAL CARD FOR EACH MEMBERSHIP PLAN */}
        {MEMBERSHIP_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`group relative bg-land-card-hover ring-1 justify-items-start rounded-[16px] ${
              plan.isPopular
                ? "w-[336px] h-[387px] ring-land-crimson px-[33px]"
                : "w-[320px] h-[366px] ring-land-border pl-[33px]"
            }`}
          >
            {/* POPULAR BADGE */}
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-land-crimson text-main text-center tracking-[0.3px] text-[12px] font-bold px-[12px] py-[4px] rounded-[9999px] z-20 shadow-lg w-[121.2px] h-[25.2px] landing-p-sm flex items-center justify-center">
                MOST POPULAR
              </div>
            )}

            {/* TYPE OF PASS */}
            <div className="landing-p-lg font-medium mt-[33px]">
              {plan.title}
            </div>

            {/* PRICE */}
            <div
              className={`landing-h2 flex mt-4 ${plan.unit === "month" ? "items-center" : "items-baseline"}`}
            >
              ₱{plan.price}
              <div
                className={`landing-p-sm text-muted ${plan.unit === "month" ? "flex items-center ml-1" : "ml-1"}`}
              >
                /{" "}
                <span
                  className={plan.unit === "month" ? "translate-y-[12px]" : ""}
                >
                  {plan.unit}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="landing-p-sm text-muted mt-4">
              {plan.description}
            </div>

            {/* BENEFITS CONTAINER LIST */}
            <ul className="landing-p-lg mt-[32px] gap-4 flex flex-col">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <img
                    src="/assets/Checkmark.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-[16px] h-[16px] mt-1 object-cover"
                  />
                  <p className="pl-[12px] landing-p-sm text-muted">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
