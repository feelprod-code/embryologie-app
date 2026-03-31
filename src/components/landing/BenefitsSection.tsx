import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  {
    title: "Chronologie Complète",
    description: "Explorez chaque phase clef : Fécondation, Clivage (J1-4), Nidation, Gastrulation (J14-21), jusqu'à la maturation de l'enfant (12 ans).",
    features: ["Frise Chronologique Active", "De la Morula au Desmocrâne", "Marqueurs par Lignée Tissulaire"]
  },
  {
    title: "Intégration Clinique D.O.",
    description: "Chaque étape du développement est reliée à sa perception palpatoire en cabinet. Apprenez le ressenti exact de la puissance embryonnaire.",
    features: ["Appui sur les Fulcrums", "Perception de la 'Hola' Notochordale", "Visions Psychosomatiques"]
  },
  {
    title: "Application Premium",
    description: "Naviguez non pas dans un PDF, mais dans une plateforme interactive. Animations, vidéos HD et modes d'écoute adaptés à votre pratique.",
    features: ["Vidéos Dynamiques", "Mode Podcast Intégré", "Interface Fluide et Interactive"]
  }
];

export function BenefitsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#1E2A33] text-[#FDFBEF] relative">
      <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none mix-blend-overlay">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-[#AE7D5C] to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-[#AE7D5C] font-semibold tracking-widest uppercase text-sm mb-4 block">
            Contenu de la Formation
          </span>
          <h2 className="font-bebas text-5xl md:text-7xl mb-6">
            POUR LA <span className="text-[#AE7D5C]">CLINIQUE</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {benefits.map((b, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-[#FDFBEF]/5 rounded-[2.5rem] p-10 backdrop-blur-md border border-[#FDFBEF]/10 hover:border-[#AE7D5C]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bebas text-4xl mb-6 tracking-wide text-[#AE7D5C]">
                  {b.title}
                </h3>
                <p className="text-[#FDFBEF]/70 text-lg font-light leading-relaxed mb-10">
                  {b.description}
                </p>
              </div>

              <ul className="space-y-4">
                {b.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-[#FDFBEF]/90 font-medium">
                    <CheckCircle2 size={20} className="text-[#AE7D5C] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
