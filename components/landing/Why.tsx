import ScrollReveal from "./ScrollReveal";

export default function Why() {
  return (
    <section
      id="features"
      className="py-[100px] bg-land-bg border-b border-land-border scroll-mt-24 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16">
        {/* Header + Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-12 md:mb-16">
          <h2 className="landing-h2 text-4xl md:text-5xl max-w-2xl leading-[1.1]">
            Why Choose Project-E
          </h2>
          <p className="landing-p-lg mt-6 text-[#A1A1AA] text-lg md:text-xl max-w-xl leading-relaxed mx-auto md:mx-0">
            We combine expert coaching with modern technology for a seamless, high-performance gym experience.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Expert Coaching */}
          <ScrollReveal delay={100}>
            <div className="group bg-white/5 border border-white/10 rounded-[24px] p-8 md:p-10 transition-all duration-300 hover:border-land-crimson/50 hover:bg-white/10 min-h-[280px] flex flex-col items-center md:items-start text-center md:text-left h-full">
              <div className="w-14 h-14 bg-land-crimson/10 rounded-2xl flex items-center justify-center mb-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/expert_coaching_icon.svg"
                  alt="Expert Coaching"
                  className="w-7 h-7"
                />
              </div>
              <h3 className="text-white mb-4 text-2xl font-bold">
                Expert Coaching
              </h3>
              <p className="text-[#A1A1AA] text-base md:text-lg leading-relaxed font-inter">
                Work with elite trainers who build personalized plans to help
                you smash your goals safely and effectively.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 2: Seamless Access */}
          <ScrollReveal delay={200}>
            <div className="group bg-white/5 border border-white/10 rounded-[24px] p-8 md:p-10 transition-all duration-300 hover:border-land-crimson/50 hover:bg-white/10 min-h-[280px] flex flex-col items-center md:items-start text-center md:text-left h-full">
              <div className="w-14 h-14 bg-land-crimson/10 rounded-2xl flex items-center justify-center mb-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/seamless_access_icon.svg"
                  alt="Seamless Access"
                  className="w-7 h-7"
                />
              </div>
              <h3 className="text-white mb-4 text-2xl font-bold">
                Seamless Access
              </h3>
              <p className="text-[#A1A1AA] text-base md:text-lg leading-relaxed font-inter">
                Enjoy touchless QR entry through our mobile app for secure and
                convenient 24/7 gym access.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 3: Affordable Membership Rates */}
          <ScrollReveal delay={300}>
            <div className="group bg-white/5 border border-white/10 rounded-[24px] p-8 md:p-10 transition-all duration-300 hover:border-land-crimson/50 hover:bg-white/10 min-h-[280px] flex flex-col items-center md:items-start text-center md:text-left h-full md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-land-crimson/10 rounded-2xl flex items-center justify-center mb-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/affordable_membership_icon.svg"
                  alt="Affordable Membership Rates"
                  className="w-7 h-7"
                />
              </div>
              <h3 className="text-white mb-4 text-2xl font-bold">
                Smart Pricing
              </h3>
              <p className="text-[#A1A1AA] text-base md:text-lg leading-relaxed font-inter">
                Access professional coaching and high-quality equipment at rates
                that make sense for your budget.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
