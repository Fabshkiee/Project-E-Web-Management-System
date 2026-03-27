import Image from 'next/image';



export default function Trainers() {
  return (

    <section className="py-27 pt-5 px-5 border-b bg-land-dark">


    {/* Title Bar Container */}
      <div className="container px-4 text-left mt-10">
        <h2 className="landing-h1 text-5xl">Meet Your Trainers</h2>
        <p className="landing-p-lg mt-8 text-gray-300">
        Elite coaches dedicated to your performance.
        </p>
      </div>


    {/* Trainers Containers */}
      <div className="container px-10 md:px-17 xl:px-32 mt-25 grid grid-cols-1 md:grid-cols-2 gap-15 place-items-center mx-auto">

        
        
        {/* 1st Trainer Card */}
        <div className=" relative group overflow-hidden bg-land-light rounded-md text-center ring-3 ring-land-crimson/20 shadow-2xl shadow-black">
          <img
            src="/assets/coachEric.svg"
            alt="Coach Eric"
            className="w-full h-[610.6px] rounded-md mx-auto object-cover"
          />

        <div className="absolute inset-0 bg-gradient-to-t from-land-dark via-land-dark/50 to-transparent"></div>

        {/* Text Container */}
        <div className="absolute bottom-10 left-10 text-left">

          {/* Name of Coach */}
          <div className=" text-4xl md:text-5xl font-semibold font-teko mb-5">
           ERIC DIONES
          </div>
          {/* Coach Specialty */}
          <div className="landing-h4 font-light  text-base md:text-lg text-land-crimson font-space tracking-widest">
          OWNER/SPECIALTY
          </div>
        </div>

      </div>



      {/* 2nd Trainer Card */}
        <div className=" relative group overflow-hidden bg-land-light rounded-md text-center ring-3 ring-land-crimson/20 shadow-2xl shadow-black ">
          <img
            src="/assets/coachEzekiel.svg"
            alt="Coach Ezekiel"
            className="w-full h-[610.6px] rounded-md mx-auto object-cover"
          />

        <div className="absolute inset-0 bg-gradient-to-t from-land-dark via-land-dark/50 to-transparent"></div>

        {/* Text Container */}
        <div className="absolute bottom-10 left-10 text-left">

          {/* Name of Coach */}
          <div className=" text-4xl md:text-5xl font-semibold font-teko mb-5">
           COACH EZEKIEL
          </div>
          {/* Coach Specialty */}
          <div className="landing-h4 font-light  text-base md:text-lg text-land-crimson font-space tracking-widest">
          SPECIALTY
          </div>
        </div>


      </div>


    </div>


    </section>
  );
}
