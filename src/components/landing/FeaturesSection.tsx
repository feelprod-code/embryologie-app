import { motion } from 'framer-motion';
import { Activity, Dna, Droplets, Eye } from 'lucide-react';

const features = [
  {
    icon: <Activity size={40} className="text-[#5A9C51]" />,
    title: "L'Ectoderme",
    description: "De la ligne primitive à la télencéphalisation. Comprenez la dynamique d'enroulement central, la migration de la crête neurale, et la formation du LCR.",
    colorClass: "hover:border-[#5A9C51]/40 border-[#5A9C51]/10",
    bgClass: "bg-[#5A9C51]/10"
  },
  {
    icon: <Dna size={40} className="text-[#F27D33]" />,
    title: "Le Mésoderme",
    description: "L'émergence du 3ème tissu. Étudiez la cardialisation, l'apparition de la notochorde, et la formation dynamique du système musculo-squelettique.",
    colorClass: "hover:border-[#F27D33]/40 border-[#F27D33]/10",
    bgClass: "bg-[#F27D33]/10"
  },
  {
    icon: <Droplets size={40} className="text-[#4171B5]" />,
    title: "L'Endoderme",
    description: "Naissance des organes par changements de pression (Loosing Fields). De l'hépatisation à la pneumatisation pulmonaire et au basculement de l'estomac.",
    colorClass: "hover:border-[#4171B5]/40 border-[#4171B5]/10",
    bgClass: "bg-[#4171B5]/10"
  },
  {
    icon: <Eye size={40} className="text-[#F2B729]" />,
    title: "L'Oeil",
    description: "Développement complexe de l'appareil visuel. La convergence des tissus embryonnaires pour former le prolongement direct de l'axe neuronal.",
    colorClass: "hover:border-[#F2B729]/40 border-[#F2B729]/10",
    bgClass: "bg-[#F2B729]/10"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-[#FDFBEF] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-[800px] bg-[#4171B5]/5 rounded-bl-[100%] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F27D33]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 flex flex-col items-center"
        >
          {/* L'icône Wu-Wei */}
          <motion.img 
            src="/icon-emb.png" 
            alt="Wu Wei Embryologie" 
            className="w-32 h-32 md:w-40 md:h-40 mb-8 drop-shadow-2xl mix-blend-multiply opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.9, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <span className="text-[#F27D33] font-bebas tracking-[0.2em] uppercase text-2xl mb-2 block">
            Programme d'Étude
          </span>
          <h2 className="font-anton text-5xl md:text-7xl lg:text-8xl text-[#1c2e4a] leading-none mb-6">
            LES 4 PILIERS <span className="text-[#4171B5]">EMBRYONNAIRES</span>
          </h2>
          <p className="max-w-3xl mx-auto text-[#1c2e4a]/80 text-lg md:text-xl font-medium tracking-wide">
            Découvrez la physiologie subtile de la vie. Une plongée profonde dans la structuration des tissus, de la fécondation du zygote aux clivages cellulaires.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className={`bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(30,42,51,0.08)] border transition-colors group flex flex-col items-center text-center ${feature.colorClass}`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 ${feature.bgClass}`}>
                {feature.icon}
              </div>
              <h3 className="font-bebas text-3xl text-[#1E2A33] mb-4 tracking-wide">{feature.title}</h3>
              <p className="text-[#1E2A33]/70 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
