import React, { useState } from 'react';
import { Bot, BarChart3, Zap, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { FocusAreaDTO } from '@tourlatam/types';

interface FocusAreasProps {
  areas: FocusAreaDTO[];
}

export const FocusAreas: React.FC<FocusAreasProps> = ({ areas }) => {
  const [selectedArea, setSelectedArea] = useState<FocusAreaDTO | null>(null);

  // Default 3 pillars from poster if areas is empty or to enrich them
  const defaultPillars: FocusAreaDTO[] = [
    {
      id: '1',
      slug: 'pmo',
      name: 'PMO (Value Management Office)',
      shortDescription: 'Evolución de las PMOs tradicionales hacia centros estratégicos de entrega de valor sostenido.',
      description: 'Aprende a estructurar Value Management Offices (VMOs) conectadas directamente con los objetivos estratégicos corporativos, gobierno de portafolios ágiles, métricas de ROI y optimización de recursos en proyectos de alta complejidad.',
      icon: 'BarChart3',
      accentColor: '#7928CA',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      slug: 'agilidad',
      name: 'AGILIDAD & Liderazgo',
      shortDescription: 'Escalado ágil, hibridación de marcos de trabajo y resiliencia humana en entornos BANI.',
      description: 'Descubre cómo implementar modelos de agilidad organizacional híbridos (Scrum + PMBOK® + Kanban) adaptados a la realidad latinoamericana, potenciando el liderazgo empático, la agilidad de equipos y la gestión del cambio cultural.',
      icon: 'Zap',
      accentColor: '#FF007F',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      slug: 'ia',
      name: 'IA (Inteligencia Artificial)',
      shortDescription: 'GenAI, análisis predictivo de riesgos y asistentes cognitivos para directores de proyectos.',
      description: 'Explora cómo la Inteligencia Artificial Generativa y el Machine Learning están revolucionando la estimación de cronogramas, la detección temprana de riesgos, la asignación inteligente de cargas de trabajo y la automatización de reportes ejecutivos.',
      icon: 'Bot',
      accentColor: '#00F2FE',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];


  const displayAreas = areas && areas.length > 0 ? areas : defaultPillars;

  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'bot':
      case 'ia':
      case 'ai':
        return Bot;
      case 'barchart3':
      case 'pmo':
        return BarChart3;
      case 'zap':
      case 'agilidad':
      case 'agility':
        return Zap;
      default:
        return Bot;
    }
  };

  return (
    <section id="focus-areas" className="py-24 bg-dark-850 relative overflow-hidden">
      {/* Background radial highlights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-cyan/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-magenta/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-black text-brand-cyan uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PILARES ESTRATÉGICOS 2026</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            PMO <span className="text-brand-cyan">•</span> AGILIDAD <span className="text-brand-magenta">•</span> IA
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Las 3 fuerzas transformadoras que definirán el Congreso Internacional de Dirección de Proyectos TourLatam Bolivia 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayAreas.map((area, index) => {
            const Icon = getIcon(area.icon);
            const isMagenta = index === 1;
            const isCyan = index === 2 || index === 0;

            return (
              <div
                key={area.id || index}
                className={`glass-card rounded-3xl p-8 flex flex-col justify-between group cursor-pointer border ${
                  isMagenta ? 'glass-card-magenta' : ''
                }`}
                onClick={() => setSelectedArea(area)}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${area.accentColor || '#00F2FE'}20`,
                        border: `1.5px solid ${area.accentColor || '#00F2FE'}60`,
                        color: area.accentColor || '#00F2FE',
                      }}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{
                        backgroundColor: `${area.accentColor || '#00F2FE'}15`,
                        color: area.accentColor || '#00F2FE',
                      }}
                    >
                      Pilar 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-brand-cyan transition-colors">
                    {area.name}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                    {area.shortDescription}
                  </p>
                </div>

                <div
                  className="pt-4 border-t border-dark-600/80 flex items-center justify-between text-xs font-black tracking-wider group-hover:translate-x-1 transition-all uppercase"
                  style={{ color: area.accentColor || '#00F2FE' }}
                >
                  <span>EXPLORAR CONTENIDOS</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus Area Detail Modal */}
      {selectedArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl bg-dark-800 border border-dark-600 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            <button
              onClick={() => setSelectedArea(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${selectedArea.accentColor || '#00F2FE'}25`,
                  color: selectedArea.accentColor || '#00F2FE',
                  border: `1.5px solid ${selectedArea.accentColor || '#00F2FE'}60`,
                }}
              >
                {React.createElement(getIcon(selectedArea.icon), { className: 'w-8 h-8' })}
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedArea.name}</h3>
                <span className="text-xs font-bold text-brand-cyan tracking-wider uppercase">
                  Pilar Estratégico • TourLatam Bolivia 2026
                </span>
              </div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-8">
              <div className="p-4 rounded-2xl bg-dark-900/80 border border-dark-600 font-semibold text-white">
                {selectedArea.shortDescription}
              </div>
              <p className="whitespace-pre-line text-slate-300">{selectedArea.description}</p>
            </div>

            <div className="pt-4 border-t border-dark-600 flex justify-end">
              <button
                onClick={() => setSelectedArea(null)}
                className="px-6 py-2.5 rounded-xl bg-brand-cyan text-dark-950 font-black hover:bg-white transition-colors uppercase text-xs tracking-wider"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
