export function Footer() {
  return (
    <footer className="py-8 px-6 md:px-16" style={{ borderTop: "1px solid rgba(1,61,71,0.1)" }}>
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-sm"
            style={{ background: "var(--teal)", color: "white" }}
          >
            S
          </div>
          <span className="font-bold text-[14px]" style={{ color: "var(--teal)" }}>SabiHub</span>
          <span className="text-[12px]" style={{ color: "#A0AEC0" }}>by OMobile</span>
        </div>
        <p className="text-[12px]" style={{ color: "#A0AEC0" }}>
          © 2026 SabiHub. NDPR compliant. No Dey Dull – Learn Well-Well!
        </p>
      </div>
    </footer>
  );
}
