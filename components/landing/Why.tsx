export default function Why() {
  return (
    <section className="py-[80px] bg-land-bf border-b border-land-border">
      
      {/* Header + Description */}
      <div className="px-[32px] text-left">
        <h2 className="landing-h2 text-4xl">Why Choose Project-E</h2>
        <p className="landing-p-lg mt-[16px] text-muted text-lg">
          We combine expert coaching with modern technology for a seamless, high-<br />
          performance gym experience.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="mt-16 px-6 xl:px-0 flex justify-center">
        <div className="max-w-[1376px] w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            
            {/* Card 1: Expert Coaching */}
            <div className="bg-land-card-hover border border-land-border rounded-[12px] p-8 w-full h-[250px] flex flex-col justify-start">
              <div className="w-12 h-12 bg-[#37181D] rounded-[12px] flex items-center justify-center mb-6 flex-shrink-0">
                <img 
                  src="/assets/expert_coaching_icon.svg" 
                  alt="Expert Coaching"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="landing-h4 text-white mb-3 text-xl font-semibold">Expert Coaching</h3>
              <p className="landing-p-md text-[#A1A1AA] text-base leading-relaxed">
                Work with elite trainers who build<br />
                personalized plans to help you smash<br />
                your goals safely and effectively.
              </p>
            </div>

            {/* Card 2: Seamless Access */}
            <div className="bg-land-card-hover border border-land-border rounded-[12px] p-8 w-full h-[250px] flex flex-col justify-start">
              <div className="w-12 h-12 bg-[#37181D] rounded-[12px] flex items-center justify-center mb-6 flex-shrink-0">
                <img 
                  src="/assets/seamless_access_icon.svg"
                  alt="Seamless Access" 
                  className="w-6 h-6" 
                />
              </div>
              <h3 className="landing-h4 text-white mb-3 text-xl font-semibold">Seamless Access</h3>
              <p className="landing-p-md text-[#A1A1AA] text-base leading-relaxed">
                Enjoy touchless QR entry through our<br />
                mobile app for secure<br />
                24/7 gym access.
              </p>
            </div>

            {/* Card 3: Affordable Membership Rates */}
            <div className="bg-land-card-hover border border-land-border rounded-[12px] p-8 w-full h-[250px] flex flex-col justify-start">
              <div className="w-12 h-12 bg-[#37181D] rounded-[12px] flex items-center justify-center mb-6 flex-shrink-0">
                <img 
                  src="/assets/affordable_membership_icon.svg" 
                  alt="Affordable Membership Rates" 
                  className="w-6 h-6" 
                />
              </div>
              <h3 className="landing-h4 text-white mb-3 text-xl font-semibold">Affordable Membership Rates</h3>
              <p className="landing-p-md text-[#A1A1AA] text-base leading-relaxed">
                Access professional coaching and<br />
                high-quality equipment at rates that<br />
                make sense for your budget.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}