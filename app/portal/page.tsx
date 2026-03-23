import { QRCodeSVG } from "qrcode.react";

export default function Portal() {
  return (
    <main>
      {/**Exit Button */}
      <div>
        <button>Exit</button>
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
