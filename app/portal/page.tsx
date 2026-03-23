import { QRCodeSVG } from "qrcode.react";
import { BackIcon } from "@/components/ui/Icons";

export default function Portal() {
  return (
    <div className="min-h-screen relative p-10 overflow-hidden">
      {/**Back Button - Now truly independent of the main layout flow */}
      <div className="absolute top-8 left-8 hover:cursor-pointer hover:opacity-80 items-center rounded-full gap-2 w-fit bg-surface px-6 py-3 flex flex-row shadow-lg z-50">
        <BackIcon />
        <button className="p-sm-md text-[#a1a1a1] uppercase tracking-wider">
          Exit
        </button>
      </div>

      <main className="flex flex-col items-center justify-center gap-4 mt-15">
        {/**Greet User Section */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="h3-b-lexend text-white mb-2">Welcome, Alex</h1>
          <p className="p-sm-md text-muted">Ready to train today?</p>
        </div>

        {/**QR Code Section */}
        <section className="flex justify-center flex-col items-center">
          <div className="bg-surface rounded-xl p-8 relative">
            {/* fix: must be a bit rounded at the corners */}
            <div className="rounded-tl-lg absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
            <div className="rounded-tr-lg absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-primary"></div>
            <div className="rounded-bl-lg absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-primary"></div>
            <div className="rounded-br-lg absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-primary"></div>
            <QRCodeSVG
              value="https://google.com"
              size={200}
              level={"M"}
              marginSize={1}
              className="rounded-xl"
            />
          </div>
          <p className="p-xs-sb text-muted mt-6 uppercase tracking-[0.2em]">
            Show this QR code at the gym entrance
          </p>
        </section>
      </main>
    </div>
  );
}
