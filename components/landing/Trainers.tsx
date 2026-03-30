import Image from "next/image";

export default function Trainers() {
  return (
    <section className="py-[80px]  bg-land-dark">
      {/* Title Bar Container */}
      <div className="container px-[32px] text-left">
        <h2 className="landing-h2">Meet Your Trainers</h2>
        <p className="landing-p-lg mt-[16px] text-muted">
          Elite coaches dedicated to your performance.
        </p>
      </div>

      {/* Trainers Containers */}
      <div
        className="container px-10 md:px-17 xl:px-[214px] mt-[48px] grid grid-cols-1 md:grid-cols-2 gap-[200px] place-items-center mx-auto py-[25px]
      "
      >
        {/* 2nd Trainer Card */}
        <div className=" relative group overflow-hidden bg-land-light rounded-md text-center ring-3 ring-land-crimson/20 shadow-2xl shadow-black w-[369.6px] h-[545.6px] ">
          <img
            src="/assets/coachEric.webp"
            alt="Coach Eric"
            className="w-full h-full  rounded-md object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-land-black/50 to-transparent"></div>

          {/* Text Container */}
          <div className="absolute bottom-[35.2px] left-[35.2px] right-[35.2px] text-left">
            {/* Name of Coach */}
            <div className=" h3-b">ERIC DIONES</div>
            {/* Coach Specialty */}
            <div className="landing-p-sm tracking-[1.4px] mt-[8px] text-land-crimson ">
              OWNER/SPECIALTY
            </div>
          </div>
        </div>

        {/* 2nd Trainer Card */}
        <div className=" relative group overflow-hidden bg-land-light rounded-md text-center ring-3 ring-land-crimson/20 shadow-2xl shadow-black w-[369.6px] h-[545.6px] ">
          <img
            src="/assets/coachEzekiel.webp"
            alt="Coach Ezekiel"
            className="w-full h-full  rounded-md object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-land-black/50 to-transparent"></div>

          {/* Text Container */}
          <div className="absolute bottom-[35.2px] left-[35.2px] right-[35.2px] text-left">
            {/* Name of Coach */}
            <div className=" h3-b">COACH EZEKIEL</div>
            {/* Coach Specialty */}
            <div className="landing-p-sm tracking-[1.4px] mt-[8px] text-land-crimson ">
              SPECIALTY
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
