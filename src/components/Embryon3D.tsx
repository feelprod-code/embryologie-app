import Spline from '@splinetool/react-spline';

export function Embryon3D() {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* 1. L'OBJET 3D INTERACTIF */}
      <div className="absolute inset-0 z-0">
        {/* URL de démonstration (Logo Spline interactif 3D). À remplacer par l'URL de ton embryon exporté de Spline.design */}
        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </div>

      {/* 2. LE TEXTE EN SURIMPRESSION (GLASSMORPHISM) */}
      <div className="relative z-10 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl text-center max-w-[85%] pointer-events-none">
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-2 drop-shadow-lg">
          Mouvement Fluide
        </h1>
        <p className="text-sm sm:text-base text-white/90 font-light drop-shadow-md">
          Survolez ou touchez pour interagir avec l'espace 3D.
        </p>
      </div>
    </div>
  );
}
