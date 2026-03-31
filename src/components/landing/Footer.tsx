export function Footer() {
  return (
    <footer className="bg-[#1E2A33] border-t border-white/5 py-12 text-center text-[#FDFBEF]">
      <div className="container mx-auto px-6 opacity-60">
        <p className="font-bebas tracking-[0.1em] text-xl mb-4">TDT EMBRYOLOGIE</p>
        <p className="text-sm font-light">© {new Date().getFullYear()} FeelProd / TDT. Tous droits réservés.</p>
        <div className="mt-8 flex justify-center gap-6 text-xs uppercase tracking-widest font-medium">
          <a href="#" className="hover:text-[#AE7D5C] transition-colors">Mentions Légales</a>
          <a href="#" className="hover:text-[#AE7D5C] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
