export default function Membership() {
  return (
    <section className=" relative z-0 overflow-hidden">
      {/* HEADING CONTAINER */}
      <div className="relative isolate  ">
        {/* THE BLOB OF RED BEHIND THE TEXT */}
        <div
          className="absolute inset-0 bg-land-crimson/5 rounded-[9999px] w-[800px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        blur-[100px]   "
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] lg:gap-[21px] mx-[32px] py-[33px] justify-items-center mt-16 mb-[96px] items-center   ">
        {/* CONTAINER 1 */}
        <div
          className="group relative w-[320px] h-[366px] bg-land-card-hover ring-1 ring-land-border pl-[33px] justify-items-start rounded-[16px]
       "
        >
          {/* type of pass */}
          <div className="landing-p-lg font-medium  mt-[33px]">Day Pass</div>

          {/* price */}
          <div className="landing-h2 flex items-baseline mt-4">
            $15
            <div className="landing-p-sm text-muted">/ day </div>
          </div>

          {/* description */}
          <div className="landing-p-sm text-muted  mt-4">
            Perfect for travelers or trying us out.
          </div>

          {/* BENEFITS CONTAINER LIST*/}
          <div className="landing-p-lg mt-[32px] gap-4 flex flex-col">
            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                Full gym access
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                Locker room usage
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                Valid for 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* CONTAINER 2 */}
        <div
          className="group relative w-[320px] h-[366px] bg-land-card-hover ring-1 ring-land-border pl-[33px] justify-items-start rounded-[16px]
      "
        >
          {/* type of pass */}
          <div className="landing-p-lg font-medium  mt-[33px]">
            Student Rate
          </div>

          {/* price */}
          <div className="landing-h2 flex items-center mt-4">
            $35
            <div className="landing-p-sm text-muted flex items-center ml-1">
              /<span className="translate-y-[12px] ">month</span>
            </div>
          </div>

          {/* description */}
          <div className="landing-p-sm text-muted  mt-4">
            Valid student ID require upon entry.
          </div>

          {/* BENEFITS CONTAINER LIST*/}
          <div className="landing-p-lg mt-[32px] gap-4 flex flex-col">
            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                24/7 QR Access
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                App Progress Tracking
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                Flexible freeze policy
              </p>
            </div>
          </div>
        </div>

        {/* CONTAINER 3 */}
        <div
          className="group relative w-[320px] h-[366px] bg-land-card-hover ring-1 ring-land-border pl-[33px] justify-items-start rounded-[16px]
       "
        >
          {/* type of pass */}
          <div className="landing-p-lg font-medium  mt-[33px]">Day Pass</div>

          {/* price */}
          <div className="landing-h2 flex items-baseline mt-4">
            $15
            <div className="landing-p-sm text-muted">/ day </div>
          </div>

          {/* description */}
          <div className="landing-p-sm text-muted  mt-4">
            Perfect for travelers or trying us out.
          </div>

          {/* BENEFITS CONTAINER LIST*/}
          <div className="landing-p-lg mt-[32px] gap-4 flex flex-col">
            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                Full gym access
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                Locker room usage
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                Valid for 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* CONTAINER 4 */}
        <div
          className="group relative w-[336px] h-[387px] bg-land-card-hover ring-1 ring-land-crimson px-[33px] justify-items-start rounded-[16px]
      "
        >
          {/* transition-all duration-327 ease-out hover:scale-107 hover:ring-land-crimson hover:shadow-[0_0_30px_rgba(214,0,0,0.3)] hover:z-30 cursor-pointer */}
          {/* TITLE CARD FOR MOST POPULAR */}
          <div
            className=" absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  bg-land-crimson text-main text-center tracking-[0.3px] text-[12px] font-bold
                  px-[12px] py-[4px] rounded-[9999px] z-20 shadow-lg w-[121.2px] h-[25.2px] landing-p-sm  flex items-center justify-center"
          >
            MOST POPULAR
          </div>

          {/* type of pass */}
          <div className="landing-p-lg font-medium  mt-[33px]">
            Monthly Regular
          </div>

          {/* price */}
          <div className="landing-h2 flex items-center mt-4">
            $50
            <div className="landing-p-sm text-muted flex items-center ml-1">
              /<span className="translate-y-[12px] ">month</span>
            </div>
          </div>

          {/* description */}
          <div className="landing-p-sm text-muted  mt-4">
            Our standard membership for committed atheletes.
          </div>

          {/* BENEFITS CONTAINER LIST*/}
          <div className="landing-p-lg mt-[32px] gap-4 flex flex-col">
            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                24/7 QR Access
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                1 Free Guest Pass/month
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">
                App Progress Tracking
              </p>
            </div>

            {/* LIST ITEM */}
            <div className="flex items-start gap-3">
              {/* Check Mark Images */}
              <img
                src="/assets/redCheck.webp"
                alt="bullet"
                className="w-[16px] h-[16px] mt-1 object-cover"
              />

              {/* The list item text */}
              <p className="pl-[12px] landing-p-sm text-muted">10% Off Merch</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
