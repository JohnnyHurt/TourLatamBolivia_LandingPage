import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Standard password hashing helper for seed (using simple sha256 or bcrypt representation)
// In production app, bcryptjs/argon2 is used by auth service.
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'tourlatam_salt_2026').digest('hex');
}

async function main() {
  console.log('🌱 Starting TourLatam 2026 database seed...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agendaItem.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.focusArea.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.pageSection.deleteMany();
  await prisma.eventSettings.deleteMany();
  await prisma.socialLink.deleteMany();

  // 2. Create Users
  const adminPassword = hashPassword('Admin123!');
  const editorPassword = hashPassword('Editor123!');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tourlatam.org',
      name: 'Administrador PMI Bolivia',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      email: 'editor@tourlatam.org',
      name: 'Editor de Contenidos PMI',
      password: editorPassword,
      role: 'EDITOR',
      isActive: true,
    },
  });

  console.log('✅ Users created: admin@tourlatam.org, editor@tourlatam.org');

  // 3. Create Event Settings
  await prisma.eventSettings.create({
    data: {
      eventName: 'Tour LATAM Bolivia 2026',
      organizerName: 'PMI Bolivia Chapter',
      tagline: 'Congreso Internacional de Dirección de Proyectos',
      startDate: new Date('2026-11-20T08:30:00Z'),
      endDate: new Date('2026-11-21T18:30:00Z'),
      city: 'Santa Cruz de la Sierra',
      venue: 'Transmisión HD Interactiva & Sede Virtual',
      address: 'PMI Bolivia Chapter — Modalidad 100% Virtual',
      modality: 'Modalidad Virtual (Streaming Internacional)',
      registrationUrl: 'https://tourlatam.pmi-bolivia.org/registro',
      contactEmail: 'tourlatam@pmi-bolivia.org',
      contactPhone: '+591 3 334 5678',
      primaryCtaText: 'REGÍSTRATE AHORA',
      secondaryCtaText: 'VER PROGRAMA OFICIAL',
      heroTitle: 'Tour LATAM Bolivia 2026',
      heroSubtitle: 'Congreso Internacional de Dirección de Proyectos • PMO • Agilidad • IA',
      heroBackgroundUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80',
      heroVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      heroOverlayOpacity: 0.85,
      aboutTitle: 'Congreso Internacional de Dirección de Proyectos',
      aboutSubtitle: 'Impulsando el Futuro de la Gestión con PMO, Agilidad e Inteligencia Artificial',
      aboutDescription: 'Tour LATAM Bolivia 2026 es el congreso internacional cumbre que reúne a líderes, directores de proyecto, gestores de PMO y expertos en agilidad e inteligencia artificial. Organizado por el PMI Bolivia Chapter, esta edición 100% virtual ofrece conferencias magistrales, workshops de IA y acreditación oficial de 24 PDUs.',
      aboutImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      gaTrackingId: 'G-TOURLATAM2026',
      gtmId: 'GTM-PMIBOLIVIA',
      metaPixelId: '9876543210',
    },
  });

  console.log('✅ Event Settings initialized');

  // 4. Create Page Sections Ordering & Config
  const sections = [
    { sectionType: 'HERO', title: 'Portada Principal', subtitle: 'Hero con impacto visual', displayOrder: 1, isVisible: true },
    { sectionType: 'EVENT_INFO', title: 'Información Clave', subtitle: 'Datos rápidos del evento', displayOrder: 2, isVisible: true },
    { sectionType: 'ABOUT', title: 'Sobre TourLatam', subtitle: 'Nuestra visión y propósito', displayOrder: 3, isVisible: true },
    { sectionType: 'FOCUS_AREAS', title: 'Áreas de Enfoque', subtitle: 'Pilares estratégicos 2026', displayOrder: 4, isVisible: true },
    { sectionType: 'SPEAKERS', title: 'Speakers Destacados', subtitle: 'Líderes globales en dirección de proyectos', displayOrder: 5, isVisible: true },
    { sectionType: 'AGENDA', title: 'Programa del Congreso', subtitle: 'Cronograma oficial por jornadas', displayOrder: 6, isVisible: true },
    { sectionType: 'PRICING', title: 'Inversión y Passports', subtitle: 'Tarifas especiales Early Bird', displayOrder: 7, isVisible: true },
    { sectionType: 'SPONSORS', title: 'Patrocinadores y Aliados', subtitle: 'Empresas comprometidas con la excelencia', displayOrder: 8, isVisible: true },
    { sectionType: 'TESTIMONIALS', title: 'Testimonios', subtitle: 'Experiencias de ediciones previas', displayOrder: 9, isVisible: true },
    { sectionType: 'FAQ', title: 'Preguntas Frecuentes', subtitle: 'Respuestas a tus dudas', displayOrder: 10, isVisible: true },
    { sectionType: 'CTA', title: 'Llamado a la Acción Final', subtitle: '¡Reserva tu lugar hoy!', displayOrder: 11, isVisible: true },
  ];

  for (const s of sections) {
    await prisma.pageSection.create({ data: s });
  }

  console.log('✅ Page Sections created');

  // 5. Create 3 Focus Areas (PMO, AGILIDAD, IA)
  const focusAreas = [
    {
      slug: 'pmo',
      name: 'PMO (Value Management Office)',
      shortDescription: 'Evolución de las PMOs tradicionales hacia centros estratégicos de entrega de valor sostenido.',
      description: 'Aprende a estructurar Value Management Offices (VMOs) conectadas directamente con los objetivos estratégicos corporativos, gobierno de portafolios ágiles, métricas de ROI y optimización de recursos en proyectos de alta complejidad.',
      icon: 'BarChart3',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      accentColor: '#7928CA',
      displayOrder: 1,
      isActive: true,
    },
    {
      slug: 'agilidad',
      name: 'AGILIDAD & Liderazgo',
      shortDescription: 'Escalado ágil, hibridación de marcos de trabajo y resiliencia humana en entornos BANI.',
      description: 'Descubre cómo implementar modelos de agilidad organizacional híbridos (Scrum + PMBOK® + Kanban) adaptados a la realidad latinoamericana, potenciando el liderazgo empático, la agilidad de equipos y la gestión del cambio cultural.',
      icon: 'Zap',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      accentColor: '#FF007F',
      displayOrder: 2,
      isActive: true,
    },
    {
      slug: 'ia',
      name: 'IA (Inteligencia Artificial)',
      shortDescription: 'GenAI, análisis predictivo de riesgos y asistentes cognitivos para directores de proyectos.',
      description: 'Explora cómo la Inteligencia Artificial Generativa y el Machine Learning están revolucionando la estimación de cronogramas, la detección temprana de riesgos, la asignación inteligente de cargas de trabajo y la automatización de reportes ejecutivos.',
      icon: 'Bot',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      accentColor: '#00F2FE',
      displayOrder: 3,
      isActive: true,
    },
  ];

  for (const fa of focusAreas) {
    await prisma.focusArea.create({ data: fa });
  }

  console.log('✅ Focus Areas created');

  // 6. Create 5 Fictional Speakers
  const speakersData = [
    {
      slug: 'dr-carlos-mendoza',
      name: 'Dr. Carlos Mendoza',
      position: 'Global Head of AI & Project Governance',
      company: 'Innovatech Global Latam',
      country: 'México',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      shortBio: 'Pionero en la implementación de modelos de aprendizaje profundo para la estimación de riesgos en megaproyectos.',
      fullBio: 'El Dr. Carlos Mendoza cuenta con más de 22 años de trayectoria internacional en dirección de tecnología e innovación. Ha liderado la implantación de PMOs cognitivas en más de 30 corporaciones multinacionales en América Latina y Europa. Es autor del libro "Inteligencia Artificial y Dirección Estratégica" y speaker habitual en congresos globales de PMI.',
      specialties: JSON.stringify(['IA & GenAI', 'PMO Transformational', 'Predictive Governance']),
      linkedinUrl: 'https://linkedin.com/in/carlos-mendoza-fictional',
      websiteUrl: 'https://carlosmendoza-ai.org',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isFeatured: true,
      displayOrder: 1,
      isActive: true,
    },
    {
      slug: 'dra-valeria-silva',
      name: 'Dra. Valeria Silva',
      position: 'VP of Agile Portfolio & Enterprise Transformation',
      company: 'Andean Financial Group',
      country: 'Colombia',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      shortBio: 'Especialista en escalado ágil y transformación cultural en el sector bancario y asegurador.',
      fullBio: 'Valeria Silva es una reconocida estratega de agilidad empresarial (PMP®, PfMP®, SPC®). Lideró la reestructuración del portafolio digital de uno de los grupos financieros más grandes de la región andina, logrando acelerar el Time-to-Market en un 40%.',
      specialties: JSON.stringify(['Agilidad at Scale', 'Change Management', 'Value Stream Management']),
      linkedinUrl: 'https://linkedin.com/in/valeria-silva-fictional',
      websiteUrl: 'https://valeriasilva.co',
      videoUrl: 'https://vimeo.com/76979871',
      isFeatured: true,
      displayOrder: 2,
      isActive: true,
    },
    {
      slug: 'ing-roberto-arce',
      name: 'Ing. Roberto Arce',
      position: 'Chief Operations Officer & Digital PMO Director',
      company: 'Santa Cruz Tech Solutions',
      country: 'Bolivia',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      shortBio: 'Experto en dirección de megaproyectos de infraestructura tecnológica e integración energética.',
      fullBio: 'Roberto Arce (PMP®, PMI-RMP®) ha supervisado la entrega de infraestructura crítica y centros de datos en el Cono Sur. Past President de capítulos PMI y apasionado por el desarrollo del talento joven en dirección de proyectos.',
      specialties: JSON.stringify(['PMO & Governance', 'Risk Management', 'Infrastructure & Energy']),
      linkedinUrl: 'https://linkedin.com/in/roberto-arce-fictional',
      isFeatured: true,
      displayOrder: 3,
      isActive: true,
    },
    {
      slug: 'mag-camila-torres',
      name: 'Mag. Camila Torres',
      position: 'Director of Human-Centric Leadership & Sustainability',
      company: 'EcoLatam Initiative',
      country: 'Chile',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      shortBio: 'Líder en proyectos sostenibles ESG, economía circular y liderazgo inclusivo de alto rendimiento.',
      fullBio: 'Camila Torres es consultora en proyectos con impacto ambiental y social (ESG). Asesora a gobiernos y ONGs en la incorporación de estándares de sostenibilidad PMI dentro de los ciclos de vida de proyectos.',
      specialties: JSON.stringify(['Agilidad & ESG', 'Inclusive Leadership', 'Sustainability']),
      linkedinUrl: 'https://linkedin.com/in/camila-torres-fictional',
      isFeatured: false,
      displayOrder: 4,
      isActive: true,
    },
    {
      slug: 'lic-javier-morales',
      name: 'Lic. Javier Morales',
      position: 'Agile Coach & Product Strategy Lead',
      company: 'ConoSur Software Lab',
      country: 'Argentina',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      shortBio: 'Facilitador de innovación disruptiva, Design Thinking y marcos de trabajo Kanban a gran escala.',
      fullBio: 'Javier Morales (PMI-ACP®, CSM) combina el diseño centrado en el usuario con la optimización del flujo de trabajo en equipos distribuidos globalmente.',
      specialties: JSON.stringify(['Agilidad & Design Thinking', 'Kanban Method', 'IA Assisted Delivery']),
      linkedinUrl: 'https://linkedin.com/in/javier-morales-fictional',
      isFeatured: false,
      displayOrder: 5,
      isActive: true,
    },
  ];

  const createdSpeakers = [];
  for (const sp of speakersData) {
    const created = await prisma.speaker.create({ data: sp });
    createdSpeakers.push(created);
  }

  console.log('✅ 5 Fictional Speakers created');

  // 7. Create Agenda Items (8 Items across 2 Days: Nov 20 & 21, 2026)
  const agendaData = [
    // Día 1: Nov 20, 2026
    {
      date: new Date('2026-11-20T00:00:00Z'),
      startTime: '08:30',
      endTime: '09:30',
      title: 'Apertura Oficial Tour LATAM Bolivia 2026 — PMI Bolivia Chapter',
      description: 'Bienvenida virtual, recorrido por la plataforma interactiva y mensaje de la presidencia del PMI Bolivia Chapter.',
      type: 'NETWORKING',
      room: 'Escenario Plenario Virtual',
      displayOrder: 1,
      isActive: true,
    },
    {
      date: new Date('2026-11-20T00:00:00Z'),
      startTime: '09:30',
      endTime: '11:00',
      title: 'Keynote Magistral: La Era de la IA Generativa en la Dirección Estratégica de Proyectos',
      description: 'Conferencia sobre el impacto de la IA en la toma de decisiones, análisis predictivo de riesgos y automatización en PMOs.',
      type: 'KEYNOTE',
      speakerId: createdSpeakers[0].id,
      room: 'Sala IA & Estrategia',
      displayOrder: 2,
      isActive: true,
    },
    {
      date: new Date('2026-11-20T00:00:00Z'),
      startTime: '11:30',
      endTime: '13:00',
      title: 'Panel Internacional: Transformación de la PMO Tradicional a Value Management Office (VMO)',
      description: 'Casos de éxito de PMOs de alto impacto que maximizan el retorno sobre la inversión en Latinoamérica.',
      type: 'PANEL',
      speakerId: createdSpeakers[1].id,
      room: 'Sala PMO de Valor',
      displayOrder: 3,
      isActive: true,
    },
    {
      date: new Date('2026-11-20T00:00:00Z'),
      startTime: '14:30',
      endTime: '16:30',
      title: 'Workshop Práctico: Construcción de Asistentes Cognitivos con IA para Project Managers',
      description: 'Taller interactivo en vivo configurando modelos de estimación y monitoreo predictivo.',
      type: 'WORKSHOP',
      speakerId: createdSpeakers[0].id,
      room: 'Laboratorio de IA Aplicada',
      displayOrder: 4,
      isActive: true,
    },

    // Día 2: Nov 21, 2026
    {
      date: new Date('2026-11-21T00:00:00Z'),
      startTime: '09:00',
      endTime: '10:30',
      title: 'Conferencia Magistral: Gestión de Megaproyectos de Infraestructura y Resiliencia Energética',
      description: 'Lecciones aprendidas en proyectos de gran envergadura y gobernanza en el Cono Sur.',
      type: 'KEYNOTE',
      speakerId: createdSpeakers[2].id,
      room: 'Escenario Plenario Virtual',
      displayOrder: 5,
      isActive: true,
    },
    {
      date: new Date('2026-11-21T00:00:00Z'),
      startTime: '11:00',
      endTime: '12:30',
      title: 'Masterclass: Escalado Ágil e Hibridación Scrum-PMBOK® en Organizaciones Complejas',
      description: 'Estrategias para balancear la gobernanza de portafolios con la velocidad de equipos ágiles.',
      type: 'WORKSHOP',
      speakerId: createdSpeakers[1].id,
      room: 'Sala Agilidad & Equipos',
      displayOrder: 6,
      isActive: true,
    },
    {
      date: new Date('2026-11-21T00:00:00Z'),
      startTime: '14:00',
      endTime: '16:00',
      title: 'Taller Interactivo: Agilidad Kanban & Design Thinking para Equipos Distribuidos',
      description: 'Optimización de flujos de trabajo remoto y eliminación de cuellos de botella en la entrega de valor.',
      type: 'WORKSHOP',
      speakerId: createdSpeakers[4].id,
      room: 'Laboratorio de Agilidad',
      displayOrder: 7,
      isActive: true,
    },
    {
      date: new Date('2026-11-21T00:00:00Z'),
      startTime: '16:30',
      endTime: '18:00',
      title: 'Keynote de Clausura: El Líder de Proyectos 2030 — Habilidades Humanas, IA y Certificaciones PMI',
      description: 'Cierre del congreso internacional, entrega de reconocimientos y acreditación de PDUs oficiales.',
      type: 'KEYNOTE',
      speakerId: createdSpeakers[3].id,
      room: 'Escenario Plenario Virtual',
      displayOrder: 8,
      isActive: true,
    },
  ];

  for (const ag of agendaData) {
    await prisma.agendaItem.create({ data: ag });
  }

  console.log('✅ 10 Agenda Items created');

  // 8. Create 5 Ticket Types
  const ticketTypesData = [
    {
      name: 'Early Bird — PMI Member',
      description: 'Tarifa preferencial para miembros activos de cualquier capítulo del PMI a nivel global.',
      price: 180.0,
      originalPrice: 250.0,
      currency: 'USD',
      startDate: new Date('2026-06-01T00:00:00Z'),
      endDate: new Date('2026-08-31T23:59:59Z'),
      features: JSON.stringify([
        'Acceso completo a 3 días de conferencias magistrales',
        'Acceso a Workshops inmersivos de IA & Agilidad',
        'Certificado oficial de asistencia con PDU credits (24 PDUs)',
        'Coffee breaks ejecutivos y material digital exclusivo',
        'Acceso a la plataforma virtual por 60 días post-evento',
      ]),
      registrationUrl: 'https://tourlatam.pmi-bolivia.org/registro?plan=pmi-member-early',
      badgeText: 'Promoción Limitada',
      isFeatured: false,
      isActive: true,
      displayOrder: 1,
    },
    {
      name: 'Early Bird — General',
      description: 'Pase general para profesionales no asociados al PMI con descuento anticipado.',
      price: 240.0,
      originalPrice: 320.0,
      currency: 'USD',
      startDate: new Date('2026-06-01T00:00:00Z'),
      endDate: new Date('2026-08-31T23:59:59Z'),
      features: JSON.stringify([
        'Acceso a todas las conferencias presenciales',
        'Kits oficiales de bienvenida TourLatam 2026',
        'Certificado de participación internacional',
        'Acceso a sesiones grabadas en HD',
        'Networking Lounge comercial',
      ]),
      registrationUrl: 'https://tourlatam.pmi-bolivia.org/registro?plan=general-early',
      badgeText: 'Más Vendido',
      isFeatured: true,
      isActive: true,
      displayOrder: 2,
    },
    {
      name: 'VIP Executive Passport',
      description: 'Experiencia premium exclusiva para Directores de PMO, ejecutivos C-Level y patrocinadores.',
      price: 450.0,
      originalPrice: 550.0,
      currency: 'USD',
      features: JSON.stringify([
        'Todos los beneficios del Pase General',
        'Acceso prioritario a reservación de asientos VIP',
        'Entrada al Cocktail Internacional & Gala de Premiación',
        'Sesión privada de Meet & Greet con Keynote Speakers',
        'Descarga de presentaciones completas y whitepapers exclusivos',
        'Parqueo preferencial en sede',
      ]),
      registrationUrl: 'https://tourlatam.pmi-bolivia.org/registro?plan=vip-executive',
      badgeText: 'Experiencia Premium',
      isFeatured: true,
      isActive: true,
      displayOrder: 3,
    },
    {
      name: 'Estudiantes Universitaris / Académicos',
      description: 'Tarifa subsidiada destinada a promover la disciplina entre estudiantes universitarios acreditados.',
      price: 90.0,
      originalPrice: 150.0,
      currency: 'USD',
      features: JSON.stringify([
        'Acceso a sesiones plenarias y conferencias magistrales',
        'Certificado digital de asistencia',
        'Acceso a la feria de patrocinadores y bolsa de empleo',
        'Requerido carnet de estudiante vigente',
      ]),
      registrationUrl: 'https://tourlatam.pmi-bolivia.org/registro?plan=student',
      badgeText: 'Académico',
      isFeatured: false,
      isActive: true,
      displayOrder: 4,
    },
    {
      name: 'Pase Corporativo (Grupo de 5+)',
      description: 'Descuento especial por volumen para delegaciones de empresas e instituciones.',
      price: 200.0,
      originalPrice: 280.0,
      currency: 'USD',
      features: JSON.stringify([
        'Beneficios del Pase General para cada participante',
        'Mención especial del logotipo de la empresa en pantallas del evento',
        'Facturación corporativa unificada',
        'Soporte dedicado para inscripciones grupales',
      ]),
      registrationUrl: 'https://tourlatam.pmi-bolivia.org/registro?plan=group',
      badgeText: 'Corporativo (5+ Pax)',
      isFeatured: false,
      isActive: true,
      displayOrder: 5,
    },
  ];

  for (const tk of ticketTypesData) {
    await prisma.ticketType.create({ data: tk });
  }

  console.log('✅ 5 Ticket Types created');

  // 9. Create 5 Fictional Sponsors
  const sponsorsData = [
    {
      name: 'TechLatam Cloud Systems',
      slug: 'techlatam-cloud-systems',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      website: 'https://techlatam-example.com',
      description: 'Proveedor líder de infraestructura en la nube, soluciones Multi-Cloud y almacenamiento seguro para proyectos de alta tecnología en Latinoamérica.',
      tier: 'TITLE',
      displayOrder: 1,
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Banco Andino de Desarrollo',
      slug: 'banco-andino-desarrollo',
      logo: 'https://images.unsplash.com/photo-1556742049-0a67daf4005a?auto=format&fit=crop&w=400&q=80',
      website: 'https://bancoandino-example.com',
      description: 'Institución financiera comprometida con el financiamiento sustentable y la transformación digital en la región.',
      tier: 'GOLD',
      displayOrder: 2,
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'ConoSur Software Lab',
      slug: 'conosur-software-lab',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=400&q=80',
      website: 'https://conosur-example.com',
      description: 'Consultora especializada en soluciones de software a medida, automatización con GenAI y agilidad organizacional.',
      tier: 'GOLD',
      displayOrder: 3,
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'PMO Global Tools',
      slug: 'pmo-global-tools',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80',
      website: 'https://pmotools-example.com',
      description: 'Plataforma SaaS para la gestión integrada de portafolios de proyectos, OKRs y asignación inteligente de recursos.',
      tier: 'SILVER',
      displayOrder: 4,
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'Revista Proyectos & Negocios Latam',
      slug: 'revista-proyectos-negocios',
      logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80',
      website: 'https://proyectosynegocios-example.com',
      description: 'Medio oficial de comunicación y difusión de buenas prácticas de gestión en la región.',
      tier: 'MEDIA_PARTNER',
      displayOrder: 5,
      isFeatured: false,
      isActive: true,
    },
  ];

  for (const sp of sponsorsData) {
    await prisma.sponsor.create({ data: sp });
  }

  console.log('✅ 5 Fictional Sponsors created');

  // 10. Create 5 FAQs
  const faqsData = [
    {
      question: '¿Qué incluye mi entrada para el congreso TourLatam 2026?',
      answer: 'Tu entrada incluye el acceso a las conferencias plenarias durante los 3 días del evento, certificado digital de asistencia acreditando PDUs oficiales del PMI, acceso a la feria comercial de patrocinadores, material digital de los expositores y coffee breaks ejecutivos.',
      displayOrder: 1,
      isActive: true,
    },
    {
      question: '¿Puedo participar en modalidad 100% virtual?',
      answer: '¡Sí! El congreso cuenta con una modalidad Híbrida. Los participantes virtuales tienen acceso a la transmisión en alta definición en tiempo real de los escenarios principales, chat interactivo con ponentes y grabaciones bajo demanda durante 60 días.',
      displayOrder: 2,
      isActive: true,
    },
    {
      question: '¿Cómo obtengo mis PDUs si ya poseo una certificación PMI (PMP®, PfMP®, PMI-ACP®)?',
      answer: 'Al finalizar el congreso, se enviará a tu correo electrónico un código de reclamo automático de PDUs según las categorías del PMI Talent Triangle (Power Skills, Business Acumen y Ways of Working). Podrás reportarlos directamente en el sistema CCRS del PMI.',
      displayOrder: 3,
      isActive: true,
    },
    {
      question: '¿Ofrecen descuentos para grupos de empresas o capítulos PMI?',
      answer: 'Sí, disponemos del Pase Corporativo con descuentos para delegaciones de 5 o más profesionales, así como tarifas especiales Early Bird para miembros de cualquier capítulo PMI a nivel mundial.',
      displayOrder: 4,
      isActive: true,
    },
    {
      question: '¿Cuál es la política de cancelación o transferencia de boleto?',
      answer: 'Los boletos no son reembolsables pero son 100% transferibles a otro participante enviando una solicitud formal al correo de la organización (tourlatam@pmi-bolivia.org) con hasta 7 días de anticipación al inicio del evento.',
      displayOrder: 5,
      isActive: true,
    },
  ];

  for (const faq of faqsData) {
    await prisma.fAQ.create({ data: faq });
  }

  console.log('✅ 5 FAQs created');

  // 11. Create Testimonials
  const testimonialsData = [
    {
      name: 'María Fernanda Ruiz',
      position: 'Directora de PMO Regional',
      company: 'Multinacional de Telecomunicaciones',
      quote: 'TourLatam superó todas mis expectativas. Las ponencias sobre IA y la calidad del networking fueron determinantes para redefinir la hoja de ruta de nuestra PMO.',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Ing. Fernando Gutiérrez',
      position: 'Senior Project Manager PMP®',
      company: 'Consultora de Energía',
      quote: 'El nivel técnico y estratégico de los speakers internacionales colocan a TourLatam como la cita imperdible del año para todo profesional de proyectos.',
      displayOrder: 2,
      isActive: true,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('✅ Testimonials created');

  // 12. Create Social Links
  const socialLinksData = [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/pmi-bolivia-chapter', displayOrder: 1, isActive: true },
    { platform: 'Facebook', url: 'https://www.facebook.com/pmiboliviachapter', displayOrder: 2, isActive: true },
    { platform: 'Instagram', url: 'https://www.instagram.com/pmi_bolivia', displayOrder: 3, isActive: true },
    { platform: 'YouTube', url: 'https://www.youtube.com/@pmiboliviachapter', displayOrder: 4, isActive: true },
    { platform: 'X', url: 'https://x.com/pmibolivia', displayOrder: 5, isActive: true },
  ];

  for (const sl of socialLinksData) {
    await prisma.socialLink.create({ data: sl });
  }

  console.log('✅ Social Links created');

  console.log('🎉 TourLatam 2026 Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
