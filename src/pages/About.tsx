import { Wifi } from "lucide-react";

const About = () => {
  return (
    <div className="p-4 md:p-6 flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center glow-cyan">
        <Wifi className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Z3 Tech <span className="text-primary">Fiber</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Gestão de CTOs e manutenção de fibra óptica
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Versão 1.0.0 — PWA
        </p>
      </div>
    </div>
  );
};

export default About;
