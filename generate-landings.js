/**
 * generate-landings.js
 * Genera landing pages personalizadas para cada negocio usando el template universal
 * Uso: node generate-landings.js
 */

const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'landing-universal.html');
const dbPath = path.join(__dirname, 'market-analysis', 'negocios-database.json');
const outDir = path.join(__dirname, 'generated');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const template = fs.readFileSync(templatePath, 'utf-8');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Variables por tipo de negocio
const tipoConfig = {
  gimnasio: {
    tagline: 'Gimnasio · Acceso Flexible · Sin Compromisos',
    badge: '🏋️ Abierto 365 días',
    svc_icon1: '🏋️', svc_name1: 'Pesas libre', svc_desc1: 'Área completa de pesas y mancuernas',
    svc_icon2: '🚴', svc_name2: 'Cardio', svc_desc2: 'Bicicletas, elípticas y caminadoras',
    svc_icon3: '👨‍🏫', svc_name3: 'Entrenadores', svc_desc3: 'Coaches certificados disponibles',
    svc_icon4: '🚿', svc_name4: 'Vestidores', svc_desc4: 'Regaderas y lockers seguros',
    stat1_num: '365', stat1_label: 'Días al año',
    stat2_num: '+500', stat2_label: 'Miembros activos',
    stat3_num: '5AM', stat3_label: 'Apertura diaria',
    cta_titulo: '¿Listo para empezar?',
    cta_sub: 'Únete hoy sin compromisos. Elige el plan que se adapte a ti.',
    faq1_q: '¿Necesito credencial para entrar?', faq1_a: 'Solo tu nombre o número de miembro activo.',
    faq2_q: '¿Puedo cancelar mi membresía?', faq2_a: 'Sí, en cualquier momento sin penalizaciones.',
    faq3_q: '¿Hay clases grupales?', faq3_a: 'Consulta con nuestros coaches disponibles.',
    faq4_q: '¿Aceptan tarjetas de crédito?', faq4_a: 'Sí, Visa, Mastercard, OXXO y transferencia.',
    faq5_q: '¿Tienen estacionamiento?', faq5_a: 'Hay estacionamiento disponible en la zona.',
    test1_texto: 'El mejor gym de Arboledas. Los precios son accesibles y el ambiente es increíble. Llevo 2 años entrenando aquí.',
    test1_nombre: 'Carlos M.', test1_role: 'Miembro desde 2023',
    test2_texto: 'Me encanta que estén abiertos desde las 5 AM. Puedo entrenar antes del trabajo sin problema.',
    test2_nombre: 'Sandra R.', test2_role: 'Miembro mensual',
    test3_texto: 'El plan de visita del día es perfecto cuando viajo. No tienes que comprometerte con mensualidad.',
    test3_nombre: 'Miguel A.', test3_role: 'Cliente frecuente',
    schema_type: 'SportsActivityLocation',
    horarios_schema: 'Mo-Fr 05:00-23:00, Sa-Su 07:00-19:00'
  },
  barberia: {
    tagline: 'Barbería · Citas en Segundos · Sin Esperas',
    badge: '✂️ Agenda tu cita ahora',
    svc_icon1: '✂️', svc_name1: 'Corte clásico', svc_desc1: 'Corte profesional con acabado perfecto',
    svc_icon2: '🧔', svc_name2: 'Corte + barba', svc_desc2: 'Combo completo para lucir impecable',
    svc_icon3: '🪒', svc_name3: 'Afeitado', svc_desc3: 'Afeitado profesional con navaja',
    svc_icon4: '💈', svc_name4: 'Diseño de barba', svc_desc4: 'Diseño y perfilado con detalle',
    stat1_num: '100%', stat1_label: 'Sin esperas',
    stat2_num: '+1K', stat2_label: 'Clientes satisfechos',
    stat3_num: '6', stat3_label: 'Días a la semana',
    cta_titulo: '¿Listo para tu próximo look?',
    cta_sub: 'Agenda tu cita en segundos. Barberos expertos te esperan.',
    faq1_q: '¿Necesito cita previa?', faq1_a: 'Recomendamos agendar, aunque también aceptamos walk-ins si hay disponibilidad.',
    faq2_q: '¿Cuánto tiempo tarda un corte?', faq2_a: 'Entre 20 y 40 minutos según el servicio.',
    faq3_q: '¿Aceptan pagos con tarjeta?', faq3_a: 'Sí, Visa, Mastercard y transferencia.',
    faq4_q: '¿Puedo cambiar o cancelar mi cita?', faq4_a: 'Sí, con al menos 2 horas de anticipación.',
    faq5_q: '¿Qué productos usan?', faq5_a: 'Productos profesionales de marcas reconocidas.',
    test1_texto: 'Siempre salgo bien arreglado. Los barberos son expertos y el ambiente es muy bueno.',
    test1_nombre: 'Roberto L.', test1_role: 'Cliente regular',
    test2_texto: 'Por fin una barbería donde puedes agendar sin esperar una hora parado. 10/10',
    test2_nombre: 'Andrés V.', test2_role: 'Cliente frecuente',
    test3_texto: 'El mejor corte que he tenido en Arboledas. Volvería mil veces.',
    test3_nombre: 'Iván M.', test3_role: 'Cliente nuevo',
    schema_type: 'HealthAndBeautyBusiness',
    horarios_schema: 'Mo-Sa 10:00-20:00'
  },
  restaurante: {
    tagline: 'Restaurante · Reserva en Segundos · Sabores Auténticos',
    badge: '🍽️ Reserva tu mesa hoy',
    svc_icon1: '🍖', svc_name1: 'Comida tradicional', svc_desc1: 'Platillos auténticos con sazón casera',
    svc_icon2: '🍺', svc_name2: 'Bebidas', svc_desc2: 'Amplia selección de bebidas frías y calientes',
    svc_icon3: '👨‍🍳', svc_name3: 'Chef experto', svc_desc3: 'Cocineros con años de experiencia',
    svc_icon4: '🎉', svc_name4: 'Eventos', svc_desc4: 'Ideal para reuniones y celebraciones',
    stat1_num: '+10', stat1_label: 'Años de experiencia',
    stat2_num: '100%', stat2_label: 'Ingredientes frescos',
    stat3_num: '7', stat3_label: 'Días a la semana',
    cta_titulo: '¿Se te antojó?',
    cta_sub: 'Reserva tu mesa o haz tu pedido ahora mismo.',
    faq1_q: '¿Necesito reservación?', faq1_a: 'Recomendamos reservar para fines de semana y días festivos.',
    faq2_q: '¿Tienen opciones vegetarianas?', faq2_a: 'Sí, pregunta por nuestras opciones del día.',
    faq3_q: '¿Aceptan tarjetas?', faq3_a: 'Sí, Visa, Mastercard y efectivo.',
    faq4_q: '¿Tienen servicio a domicilio?', faq4_a: 'Consulta disponibilidad por WhatsApp.',
    faq5_q: '¿Tienen estacionamiento?', faq5_a: 'Hay estacionamiento disponible en la zona.',
    test1_texto: 'La mejor comida de Arboledas, sin duda. El sazón es como hecho en casa.',
    test1_nombre: 'Patricia G.', test1_role: 'Cliente habitual',
    test2_texto: 'Excelente servicio y porciones generosas. Siempre vuelvo con familia y amigos.',
    test2_nombre: 'Luis H.', test2_role: 'Cliente frecuente',
    test3_texto: 'Reservé por WhatsApp y fue súper rápido. La comida estuvo deliciosa.',
    test3_nombre: 'Diana C.', test3_role: 'Cliente nueva',
    schema_type: 'Restaurant',
    horarios_schema: 'Mo-Su 13:00-23:00'
  },
  cafe: {
    tagline: 'Café · Desayunos · Pedidos Online',
    badge: '☕ Pide antes de llegar',
    svc_icon1: '☕', svc_name1: 'Bebidas calientes', svc_desc1: 'Café, té, chocolate y más',
    svc_icon2: '🥐', svc_name2: 'Desayunos', svc_desc2: 'Completos y deliciosos cada mañana',
    svc_icon3: '🥤', svc_name3: 'Malteadas', svc_desc3: 'Frappes y bebidas frías especiales',
    svc_icon4: '📦', svc_name4: 'Para llevar', svc_desc4: 'Ordena y recoge sin esperar',
    stat1_num: '7AM', stat1_label: 'Abrimos desde',
    stat2_num: '+20', stat2_label: 'Opciones en menú',
    stat3_num: '7', stat3_label: 'Días a la semana',
    cta_titulo: '¿Se te antojó el café?',
    cta_sub: 'Ordena por WhatsApp y recoge listo. Sin filas, sin esperas.',
    faq1_q: '¿Puedo ordenar con anticipación?', faq1_a: 'Sí, mándanos WhatsApp y te tenemos listo tu pedido.',
    faq2_q: '¿Tienen WiFi?', faq2_a: 'Sí, WiFi gratis para todos los clientes.',
    faq3_q: '¿Aceptan tarjetas?', faq3_a: 'Sí, Visa, Mastercard y efectivo.',
    faq4_q: '¿Tienen opciones sin gluten o veganas?', faq4_a: 'Pregunta por las opciones del día.',
    faq5_q: '¿Tienen servicio a domicilio?', faq5_a: 'Consulta disponibilidad por WhatsApp.',
    test1_texto: 'El mejor café de Arboledas. Ambiente increíble para trabajar o platicar.',
    test1_nombre: 'Fernanda R.', test1_role: 'Cliente habitual',
    test2_texto: 'Los desayunos son deliciosos y las porciones generosas. Lo recomiendo totalmente.',
    test2_nombre: 'Jorge M.', test2_role: 'Cliente frecuente',
    test3_texto: 'Ordené por WhatsApp y estaba listo cuando llegué. Servicio excelente.',
    test3_nombre: 'Ana P.', test3_role: 'Cliente nueva',
    schema_type: 'CafeOrCoffeeShop',
    horarios_schema: 'Mo-Su 07:00-20:00'
  }
};

function darken(hex, amount = 20) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xFF) - amount);
  const b = Math.max(0, (num & 0xFF) - amount);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function buildVars(negocio) {
  const tipo = tipoConfig[negocio.tipo] || tipoConfig.restaurante;
  const svcs = negocio.servicios || [];
  const tel = negocio.telefono || negocio.whatsapp || '5532652927';
  const waMsg = encodeURIComponent(`Hola ${negocio.nombre}, quiero informes`);

  // Planes: usar servicios del JSON o defaults del tipo
  const planes = svcs.slice(0, 4);
  while (planes.length < 4) planes.push({ nombre: 'Consultar', precio: 0, tipo: 'plan' });

  const planVars = {};
  planes.forEach((p, i) => {
    const n = i + 1;
    planVars[`PLAN${n}_NOMBRE`] = p.nombre;
    planVars[`PLAN${n}_PRECIO`] = p.precio > 0 ? `$${p.precio}` : 'Consultar';
    planVars[`PLAN${n}_PERIODO`] = p.tipo === 'plan' ? (p.precio > 0 ? (p.nombre.toLowerCase().includes('mes') ? '/mes' : '/día') : '') : '';
    planVars[`PLAN${n}_DESC`] = p.descripcion || '';
    planVars[`PLAN${n}_CTA`] = p.precio > 0 ? 'Obtener ahora' : 'Consultar precio';
    planVars[`PLAN${n}_LINK`] = p.stripe_link || `https://wa.me/${tel}?text=${encodeURIComponent(`Hola, me interesa el plan ${p.nombre}`)}`;
    planVars[`PLAN${n}_FEATURED`] = p.destacado ? 'featured' : '';
    planVars[`PLAN${n}_BADGE`] = p.destacado ? '<span class="plan-badge">MÁS POPULAR</span>' : '';
  });

  return {
    NEGOCIO_NOMBRE: negocio.nombre,
    NEGOCIO_TAGLINE: tipo.tagline,
    NEGOCIO_META_DESC: `${negocio.nombre} en ${negocio.direccion}. ${tipo.tagline}. ${negocio.horarios || ''}`,
    NEGOCIO_IMAGEN: `https://via.placeholder.com/1200x630/0a0a0a/${negocio.color_primario?.replace('#','')}?text=${encodeURIComponent(negocio.nombre)}`,
    NEGOCIO_COLOR: negocio.color_primario || '#dc2626',
    NEGOCIO_COLOR_DARK: darken(negocio.color_primario || '#dc2626', 30),
    NEGOCIO_TELEFONO: tel,
    NEGOCIO_WHATSAPP: tel,
    NEGOCIO_WA_MSG: waMsg,
    NEGOCIO_DIRECCION: negocio.direccion || '',
    NEGOCIO_HORARIOS: negocio.horarios || '',
    NEGOCIO_HORARIOS_SCHEMA: tipo.horarios_schema,
    NEGOCIO_INSTAGRAM: negocio.instagram || '',
    NEGOCIO_FACEBOOK: negocio.facebook || '',
    NEGOCIO_MAPS_QUERY: encodeURIComponent(negocio.direccion || negocio.nombre),
    NEGOCIO_MAPS_EMBED: negocio.maps_embed || `https://maps.google.com/maps?q=${encodeURIComponent(negocio.direccion || negocio.nombre)}&output=embed`,
    NEGOCIO_SCHEMA_TYPE: tipo.schema_type,
    NEGOCIO_H1_PARTE1: negocio.headline?.split(',')[0] || negocio.headline || tipo.tagline,
    NEGOCIO_H1_PARTE2: negocio.headline?.split(',').slice(1).join(',').trim() || '',
    NEGOCIO_SUBHEADLINE: negocio.subheadline || tipo.tagline,
    NEGOCIO_BADGE: tipo.badge,
    NEGOCIO_CTA_PRINCIPAL: negocio.cta_principal || 'Contáctanos ahora',
    NEGOCIO_CTA_SECUNDARIO: `Ver horarios y ubicación`,
    STAT1_NUM: tipo.stat1_num,
    STAT1_LABEL: tipo.stat1_label,
    STAT2_NUM: tipo.stat2_num,
    STAT2_LABEL: tipo.stat2_label,
    STAT3_NUM: tipo.stat3_num,
    STAT3_LABEL: tipo.stat3_label,
    BANNER_ITEM1: `⏰ ${negocio.horarios?.split('|')[0]?.trim() || 'Consultar horario'}`,
    BANNER_ITEM2: `📍 ${negocio.direccion?.split(',')[0] || 'Arboledas'}`,
    BANNER_ITEM3: `📱 ${tel}`,
    SVC1_ICON: tipo.svc_icon1, SVC1_NAME: tipo.svc_name1, SVC1_DESC: tipo.svc_desc1,
    SVC2_ICON: tipo.svc_icon2, SVC2_NAME: tipo.svc_name2, SVC2_DESC: tipo.svc_desc2,
    SVC3_ICON: tipo.svc_icon3, SVC3_NAME: tipo.svc_name3, SVC3_DESC: tipo.svc_desc3,
    SVC4_ICON: tipo.svc_icon4, SVC4_NAME: tipo.svc_name4, SVC4_DESC: tipo.svc_desc4,
    TEST1_TEXTO: tipo.test1_texto, TEST1_NOMBRE: tipo.test1_nombre, TEST1_ROLE: tipo.test1_role,
    TEST2_TEXTO: tipo.test2_texto, TEST2_NOMBRE: tipo.test2_nombre, TEST2_ROLE: tipo.test2_role,
    TEST3_TEXTO: tipo.test3_texto, TEST3_NOMBRE: tipo.test3_nombre, TEST3_ROLE: tipo.test3_role,
    FAQ1_Q: tipo.faq1_q, FAQ1_A: tipo.faq1_a,
    FAQ2_Q: tipo.faq2_q, FAQ2_A: tipo.faq2_a,
    FAQ3_Q: tipo.faq3_q, FAQ3_A: tipo.faq3_a,
    FAQ4_Q: tipo.faq4_q, FAQ4_A: tipo.faq4_a,
    FAQ5_Q: tipo.faq5_q, FAQ5_A: tipo.faq5_a,
    CTA_TITULO: tipo.cta_titulo,
    CTA_SUB: tipo.cta_sub,
    FOOTER_DESC: `${negocio.nombre} — ${tipo.tagline}. Ubicados en ${negocio.direccion || 'Arboledas, Tlalnepantla'}.`,
    ANIO: new Date().getFullYear().toString(),
    ...planVars
  };
}

function applyVars(template, vars) {
  let html = template;
  for (const [key, val] of Object.entries(vars)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, val || '');
  }
  return html;
}

// Generar solo los prospectos prioritarios
const prioritarios = db.prospectos_prioritarios || db.negocios.map(n => n.id);
const negocios = db.negocios.filter(n => prioritarios.includes(n.id));

let generados = 0;
negocios.forEach(negocio => {
  const vars = buildVars(negocio);
  const html = applyVars(template, vars);
  const outFile = path.join(outDir, `${negocio.slug}.html`);
  fs.writeFileSync(outFile, html, 'utf-8');
  console.log(`✅ ${negocio.nombre} → generated/${negocio.slug}.html`);
  generados++;
});

console.log(`\n🚀 ${generados} landings generadas en ./generated/`);
console.log('Para generar todos los negocios: Cambiar línea de filtro a: const negocios = db.negocios;');
