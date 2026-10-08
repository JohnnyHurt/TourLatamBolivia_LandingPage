import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { Header } from '../../components/public/Header';
import { Footer } from '../../components/public/Footer';

export const ThankYouPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 selection:bg-brand-cyan selection:text-dark-950 flex flex-col">
      <Header settings={null} />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-cyan/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-magenta/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-dark-600 mb-10 shadow-2xl bg-dark-800/90 text-center relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta" />

            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-full" />
                <CheckCircle2 className="w-24 h-24 text-brand-cyan relative z-10" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 uppercase">
              ¡Inscripción Confirmada!
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-300 mb-10">
              Muchas gracias por registrarte al <span className="text-brand-cyan font-bold">Congreso Internacional de Dirección de Proyectos Tour LATAM Bolivia 2026</span>.
            </p>

            <div className="bg-dark-900 border border-dark-600 rounded-2xl p-6 text-left mb-10 inline-block w-full max-w-xl mx-auto shadow-inner">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-magenta" />
                <span>Próximos pasos importantes</span>
              </h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
                  <p>Hemos recibido tu pago exitosamente y tu lugar está asegurado.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-magenta shrink-0" />
                  <p>
                    <strong className="text-white">Días antes del congreso</strong>, recibirás un correo electrónico con tu información de acceso y el enlace único para ingresar a la plataforma <strong className="text-brand-cyan">Airmeet</strong>.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0" />
                  <p>Te sugerimos agregar nuestra dirección a tus contactos para evitar que el correo llegue a la bandeja de spam.</p>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyanLight text-dark-950 font-black text-sm hover:bg-white transition-all shadow-glow-cyan uppercase tracking-wider w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Inicio
              </Link>
              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Tour+LATAM+Bolivia+2026&dates=20261120T123000Z/20261121T223000Z&details=Congreso+Internacional+de+Direcci%C3%B3n+de+Proyectos.+Ingreso+por+Airmeet.&location=Virtual"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-dark-700 text-white font-bold text-sm hover:bg-dark-600 border border-dark-600 transition-colors uppercase tracking-wider w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4" />
                Agendar Evento
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={null} />
    </div>
  );
};
