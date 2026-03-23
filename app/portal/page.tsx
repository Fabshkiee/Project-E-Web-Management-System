import { QRCodeSVG } from "qrcode.react";
import { BackIcon } from "@/components/ui/Icons";

export default function Portal() {
  return (
    <main className="m-10">
      {/**Back Button */}
      <div className="hover:cursor-pointer hover:opacity-80 items-center rounded-full gap-2 w-fit bg-surface px-8 py-4 flex flex-row">
        <BackIcon />
        <button className="p-sm-md text-[#a1a1a1]">Exit</button>
      </div>
      {/**Greet User Section */}
      <div className="flex justify-center flex-col items-center gap-2">
        <h1 className="h3-b-lexend">Welcome, Alex</h1>
        <p className="p-sm-md text-muted">Ready to train today?</p>
      </div>

      {/**QR Code Section */}
      <section className="flex justify-center flex-col items-center">
        <QRCodeSVG
          value="https://google.com"
          size={200}
          level={"M"}
          marginSize={1}
          className="rounded-xl"
        />
      </section>
    </main>
  );
}
