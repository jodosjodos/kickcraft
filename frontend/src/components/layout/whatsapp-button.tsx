export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/250700000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center justify-center rounded-full bg-[#25D366] p-4 text-white shadow-[0_0_20px_rgba(37,211,102,0.35)] hover:bg-[#1EBE5C] transition-colors"
    >
      <span className="material-symbols-outlined icon-filled leading-none text-[28px]">
        chat
      </span>
    </a>
  );
}
