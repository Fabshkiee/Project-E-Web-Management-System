import Image from "next/image";

const MEMBERSHIP_PLANS = [
  {
    id: "plan1",
    title: "Day Pass",
    price: "150",
    unit: "day",
    studentPrice: "100 ",
    description: "Perfect for first-timers or travelers",
    features: [
      "Access to strength equipment",
      "Standard locker use",
      "Valid for 24 hours",
    ],
  },
  {
    id: "plan2",
    title: "Monthly Pass",
    price: "900",
    unit: "month",
    studentPrice: "700",
    description: "Perfect for independent training",
    features: [
      "Full Gym Access",
      "Private Locker Amenities",
      "30-Day Unlimited Pass",
    ],
  },
  {
    id: "plan3",
    title: "Supervised Training Pass",
    price: "1500",
    unit: "month",
    studentPrice: "1200",
    description: "Train with expert guidance",
    features: [
      "Guided Training",
      "Full Gym Access",
      "Private Locker Amenities",
      "30-Day Unlimited Pass",
    ],
  },
  {
    id: "plan4",
    title: "Full-Access Coaching Pass",
    price: "3000",
    unit: "month",
    studentPrice: "2500",
    description: "The complete fitness experience",
    features: [
      "Personal Coaching Sessions",
      "Full Gym Access",
      "Private Locker Amenities",
      "30-Day Unlimited Pass",
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
          className="absolute bg-land-crimson/20 rounded-[9999px] w-[600px] h-[300px] top-[45%] left-[55%] -z-1 animate-blob-pulse"
          style={{ animationDelay: "-5s", animationDuration: "12s" }}
        />
        <div className="absolute bg-land-crimson/10 rounded-[9999px] w-[800px] h-[400px] top-1/2 left-1/2 -z-1 animate-blob-pulse" />

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-[40px] md:gap-x-[20px] xl:gap-x-[15px] mx-auto max-w-[340px] md:max-w-[760px] xl:max-w-[1400px] py-[33px] justify-items-center mt-16 mb-[96px] items-center">
        {/* INDIVIDUAL CARD FOR EACH MEMBERSHIP PLAN */}
        {MEMBERSHIP_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`group relative flex flex-col items-start rounded-[16px] transition-all duration-500 ${
              plan.isPopular
                ? "w-[336px] h-[387px] ring-1 ring-land-crimson px-[33px] shadow-[0_0_40px_rgba(242,13,51,0.1)]"
                : "w-[320px] h-[366px] bg-land-card-hover ring-1 ring-land-border px-[33px] hover:ring-land-crimson/40"
            }`}
          >
            {/* BORDER BEAM ANIMATION FOR POPULAR CARD */}
            {plan.isPopular && (
              <div className="absolute inset-0 pointer-events-none rounded-[16px] overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-[-150%] animate-border-beam bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,var(--color-land-crimson)_360deg)]" />
                </div>
                {/* DARK INNER COVER */}
                <div className="absolute inset-[2px] bg-land-card-hover rounded-[15px] z-0" />
              </div>
            )}

            {/* CARD CONTENT LAYER */}
            <div className="relative z-10 w-full flex flex-col items-start">
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
              <div className="flex items-baseline mt-4 landing-h2">
                <span>₱{plan.price}</span>
                <div className="landing-p-sm text-muted ml-1">
                  / {plan.unit}
                </div>
              </div>

              {/* Student PRICE */}
              {plan.studentPrice && (
                <div
                  className="flex justify-between items-center w-full landing-p-md font-bold mt-2 border
               border-dashed border-land-crimson/40  px-3 py-1 rounded-[6px] bg-land-crimson/10"
                >
                  <span className="text-land-crimson landing-p-sm font-bold">
                    Student Rate
                  </span>
                  <span>₱{plan.studentPrice}</span>
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="landing-p-sm text-muted mt-4">
                {plan.description}
              </div>

              {/* BENEFITS CONTAINER LIST */}
              <ul className="mt-5 space-y-3 w-full">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <Image
                      src="/assets/Checkmark.svg"
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                      className="w-4 h-4 mt-1 shrink-0"
                    />
                    <span className="landing-p-sm text-muted leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
