# 🤖 CHATBOT UNIVERSAL — WHATSAPP FLOW
> **1 flujo para TODOS los tipos de negocio**  
> Gimnasios · Barberías · Restaurantes · Cafés · Consultorios  
> Integración: N8N + WhatsApp Business API + Stripe + Google Sheets

---

## ⚙️ CONFIGURACIÓN POR NEGOCIO

Cada negocio tiene su propia instancia del chatbot configurada en `negocios-database.json`.  
El **flujo es idéntico** — solo cambian los textos y la lógica de tipo.

```json
VARIABLES POR NEGOCIO:
{
  "negocio_id": 1,
  "negocio_nombre": "Body Trainer Gym",
  "negocio_tipo": "gimnasio",       // gimnasio | barberia | restaurante | cafe | consultorio
  "negocio_telefono": "5532652927",
  "negocio_horarios": "Lun-Vie 5AM-11PM | Sáb-Dom 7AM-7PM",
  "servicios": [...],               // array de planes/servicios con precio y stripe_link
  "wa_bienvenida": "¡Hola! Soy el asistente de Body Trainer Gym 💪",
  "wa_menu_principal": "¿Qué te gustaría hacer hoy?"
}
```

---

## 📋 FLUJO COMPLETO (7 PASOS)

---

### PASO 1 — BIENVENIDA ⚡

**Trigger:** Cualquier mensaje entrante al número del negocio

```
BOT → USUARIO:
"¡Hola! 👋 Soy el asistente de *{NEGOCIO_NOMBRE}*.

[TIPO: gimnasio]
💪 ¿Quieres ver nuestros planes y precios?

[TIPO: barberia]
✂️ ¿Quieres agendar una cita con nosotros?

[TIPO: restaurante | cafe]
🍽️ ¿Quieres hacer un pedido o reservar mesa?

[TIPO: consultorio]
🏥 ¿Necesitas agendar una consulta?

Responde con el número de tu opción:"
```

**Opciones universales:**
```
1️⃣ Ver servicios / Ver menú / Ver planes
2️⃣ Agendar / Reservar / Pedir
3️⃣ Horarios y ubicación
4️⃣ Hablar con alguien del equipo
```

**Lógica N8N:**
```
WEBHOOK recibe mensaje
→ IF mensaje == 'hola' OR primer_contacto
  → Enviar bienvenida + opciones
→ ELSE
  → Router según estado_sesion del usuario
```

---

### PASO 2 — SELECCIONAR ACCIÓN 📌

**Basado en respuesta del PASO 1:**

**[Opción 1] Ver servicios/planes:**
```
[TIPO: gimnasio]
BOT: "Nuestros planes en *{NEGOCIO_NOMBRE}*:

🟡 *Visita del día* — $50
   Acceso completo por 1 día

🟢 *Semana* — $199
   Acceso ilimitado 7 días

🔴 *Mensual* — $699 ⭐ MÁS POPULAR
   Acceso ilimitado 30 días

🔵 *Estudiante* — $599
   Mensual con credencial vigente

¿Cuál te interesa? Responde 1, 2, 3 o 4"

[TIPO: barberia]
BOT: "Nuestros servicios en *{NEGOCIO_NOMBRE}*:

✂️ 1. Corte clásico — $80
🧔 2. Corte + barba — $120
🪒 3. Afeitado profesional — $60
💈 4. Diseño de barba — $80

¿Qué servicio quieres agendar? Responde 1, 2, 3 o 4"

[TIPO: restaurante | cafe]
BOT: "¿Cómo prefieres tu pedido?

🍽️ 1. Comer aquí (reservar mesa)
🛵 2. Para llevar
📍 3. Ver el menú completo

Responde con tu opción:"
```

**[Opción 3] Horarios y ubicación:**
```
BOT: "📍 *{NEGOCIO_NOMBRE}*

🏠 *Dirección:* {NEGOCIO_DIRECCION}

🕐 *Horarios:*
{NEGOCIO_HORARIOS}

📞 *Teléfono:* {NEGOCIO_TELEFONO}

🗺️ *Google Maps:*
https://maps.google.com/?q={NEGOCIO_MAPS_QUERY}

¿Necesitas algo más?"
```

**[Opción 4] Hablar con equipo:**
```
BOT: "En un momento te conectamos con alguien del equipo 👤

Mientras tanto, puedes escribirnos directamente o visitar en:
📍 {NEGOCIO_DIRECCION}
📞 {NEGOCIO_TELEFONO}

*Horario de atención:* {NEGOCIO_HORARIOS}"

→ Notificar al operador (Google Sheets + WhatsApp al dueño)
```

---

### PASO 3 — RECOPILAR DATOS DEL USUARIO 📝

**Universal para todos los tipos:**

```
BOT: "¡Perfecto! Para continuar necesito tus datos:

📋 Por favor escríbeme:
1. Tu *nombre completo*
2. Tu *número de teléfono* o email

[TIPO: barberia - adicional]
3. *¿Qué día y hora prefieres?* 
   (Ej: Martes 16:00, Jueves mañana)

[TIPO: restaurante - adicional]  
3. *¿Para cuántas personas?*
4. *¿Fecha y hora?*

[TIPO: consultorio - adicional]
3. *Motivo de consulta (breve)*"
```

**Validación básica en N8N:**
```javascript
// Validar que tenga nombre + teléfono mínimo
if (!nombre || !telefono) {
  bot.send("No encontré tu nombre o teléfono. ¿Puedes repetirlos?")
}
```

---

### PASO 4 — CONFIRMACIÓN ✅

**Resumen antes de proceder:**

```
[TIPO: gimnasio]
BOT: "✅ *Resumen de tu registro:*

👤 Nombre: {USUARIO_NOMBRE}
📱 Teléfono: {USUARIO_TELEFONO}
💪 Plan: {PLAN_NOMBRE} — ${PLAN_PRECIO}

¿Todo correcto? 
1️⃣ Sí, continuar al pago
2️⃣ Cambiar algo"

[TIPO: barberia]
BOT: "✅ *Resumen de tu cita:*

👤 Nombre: {USUARIO_NOMBRE}
✂️ Servicio: {SERVICIO_NOMBRE} — ${SERVICIO_PRECIO}
📅 Fecha/Hora: {CITA_FECHA} {CITA_HORA}

¿Confirmas tu cita?
1️⃣ Confirmar
2️⃣ Cambiar"

[TIPO: restaurante]
BOT: "✅ *Resumen de tu reserva:*

👤 Nombre: {USUARIO_NOMBRE}
🍽️ Tipo: {TIPO_PEDIDO}
👥 Personas: {NUM_PERSONAS}
📅 Fecha: {RESERVA_FECHA}

¿Confirmas?
1️⃣ Sí, confirmar
2️⃣ Cambiar algo"
```

---

### PASO 5 — PAGO (si aplica) 💳

**Lógica condicional:**
```javascript
if (negocio_tipo === 'gimnasio' || servicio.precio > 0) {
  // Enviar link de Stripe
  bot.send(paso5_pago)
} else if (negocio_tipo === 'barberia' || negocio_tipo === 'consultorio') {
  // Solo confirmar cita, pago presencial
  bot.send(paso5_confirmacion_gratis)
} else if (negocio_tipo === 'restaurante' || negocio_tipo === 'cafe') {
  // Reserva sin pago, OR pedido con pago
  if (tipo_pedido === 'delivery') bot.send(paso5_pago)
  else bot.send(paso5_confirmacion_gratis)
}
```

**CON pago (Stripe):**
```
BOT: "💳 *Para completar tu registro:*

Haz clic en el enlace para pagar de forma segura:
🔗 {STRIPE_CHECKOUT_LINK}

Aceptamos: Visa, Mastercard, OXXO, transferencia

⚠️ Tu lugar queda reservado por *15 minutos*

¿Tienes algún problema con el pago? Escríbenos."
```

**SIN pago (cita/reserva):**
```
BOT: "✅ *¡Reserva confirmada!*

Te esperamos en:
📍 {NEGOCIO_DIRECCION}
📅 {FECHA_HORA_CITA}

*Recuerda traer:*
[TIPO: barberia] Solo llegarte, ya tienes tu lugar asegurado ✂️
[TIPO: consultorio] Identificación y datos de seguro (si aplica)
[TIPO: restaurante] Solo preguntar por tu reserva a nombre de {USUARIO_NOMBRE}

📞 Si necesitas cancelar o cambiar: {NEGOCIO_TELEFONO}"
```

---

### PASO 6 — CONFIRMACIÓN FINAL + ACCESO 🎉

**Después de pago exitoso (Stripe webhook → N8N):**

```
[TIPO: gimnasio]
BOT: "🎉 *¡Pago confirmado!*

✅ Tu plan *{PLAN_NOMBRE}* está activo

📋 *Detalles:*
• Nombre: {USUARIO_NOMBRE}
• Plan: {PLAN_NOMBRE}
• Válido: {FECHA_INICIO} → {FECHA_FIN}
• Folio: #{FOLIO_ID}

🏋️ *Para entrar al gym:*
Muestra este mensaje en recepción o di tu nombre.

¡Te esperamos! 💪
{NEGOCIO_NOMBRE} — {NEGOCIO_DIRECCION}"

[TIPO: barberia]
BOT: "✅ *¡Cita confirmada!*

✂️ {SERVICIO_NOMBRE}
📅 {CITA_FECHA} a las {CITA_HORA}
📍 {NEGOCIO_DIRECCION}
Folio: #{FOLIO_ID}

Te mandamos recordatorio 2 horas antes 📱"

[TIPO: restaurante]
BOT: "✅ *¡Reserva confirmada!*

🍽️ Mesa para {NUM_PERSONAS} personas
📅 {RESERVA_FECHA} a las {RESERVA_HORA}
📍 {NEGOCIO_DIRECCION}
A nombre de: {USUARIO_NOMBRE}

¡Nos vemos pronto! 🙌"
```

---

### PASO 7 — FOLLOW-UP (48h después) 📊

**Cron job en N8N — diario 10 AM:**

```
N8N Query: Google Sheets WHERE fecha_visita = ayer AND follow_up_enviado = false

BOT (48h después):
"¡Hola {USUARIO_NOMBRE}! 👋

¿Cómo estuvo tu experiencia en *{NEGOCIO_NOMBRE}*?

Califica del 1 al 5:
1️⃣ Muy malo
2️⃣ Malo  
3️⃣ Regular
4️⃣ Bueno
5️⃣ Excelente ⭐

Tu opinión nos ayuda mucho 🙏"
```

**Respuesta guardada → Google Sheets:**
```
Columna: calificacion | fecha_followup | comentario
```

---

## 🗂️ GOOGLE SHEETS — ESTRUCTURA UNIVERSAL

**1 sola tabla para todos los negocios:**

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `id` | Auto-increment | 001 |
| `negocio_id` | ID del negocio | 1 |
| `negocio_nombre` | Nombre del negocio | Body Trainer |
| `negocio_tipo` | Tipo de negocio | gimnasio |
| `usuario_nombre` | Nombre del cliente | Juan García |
| `usuario_telefono` | WhatsApp del cliente | 5512345678 |
| `accion` | Qué hizo | inscripcion / cita / reserva / pedido |
| `servicio` | Servicio/plan elegido | Mensual ilimitado |
| `monto` | Precio pagado | 699 |
| `stripe_id` | ID de pago Stripe | pi_xxx |
| `estado` | Estado actual | confirmado / pendiente / cancelado |
| `fecha` | Fecha de la transacción | 2026-04-17 |
| `fecha_visita` | Fecha de la cita/visita | 2026-04-18 |
| `calificacion` | Rating del follow-up | 5 |
| `notas` | Observaciones | — |
| `follow_up_enviado` | ¿Ya se envió follow-up? | true / false |

---

## ⚡ MANEJO DE ERRORES

```
TIMEOUT (sin respuesta en 30 min):
BOT: "¿Sigues ahí? 👀 Si quieres continuar tu registro escríbeme 'hola' 😊"

OPCIÓN INVÁLIDA:
BOT: "No entendí tu respuesta. Por favor escribe el número de la opción:
1️⃣ Ver planes
2️⃣ Agendar
3️⃣ Horarios
4️⃣ Hablar con alguien"

PAGO FALLIDO (Stripe webhook evento payment_failed):
BOT: "❌ Hubo un problema con tu pago.

Puedes intentar con:
• Otra tarjeta
• Pago en OXXO
• Transferencia SPEI

O escríbenos para ayudarte: {NEGOCIO_TELEFONO}"

FUERA DE HORARIO:
BOT: "¡Hola! Por el momento estamos fuera de horario 🌙

Nuestro horario: {NEGOCIO_HORARIOS}

Te responderemos en cuanto abramos. 
¡Gracias por contactarnos! 🙌"
```

---

## 🔗 INTEGRACIONES

### WhatsApp Business API (vía N8N)
```
WEBHOOK URL: https://n8n-bkto.srv1511719.hstgr.cloud/webhook/{negocio_slug}
MÉTODO: POST
BODY: { "from": "521XXXXXXXXXX", "text": "hola", "timestamp": 1234567890 }
```

### Stripe Webhooks
```
EVENTOS:
- payment_intent.succeeded → Confirmar acceso/cita
- payment_intent.payment_failed → Notificar al usuario
- checkout.session.completed → Guardar en Sheets

WEBHOOK: https://n8n-bkto.srv1511719.hstgr.cloud/webhook/stripe-{negocio_slug}
```

### Google Sheets
```
SHEET ID: {GOOGLE_SHEETS_ID}  ← Configurar 1 sola hoja para todos
TAB: "transacciones"           ← Tabla universal
OPERACIONES:
- Append row: Nuevo lead/transacción
- Update row: Actualizar estado
- Query: Para follow-ups y recordatorios
```

---

## 📱 MENSAJES PRE-FILLED (WhatsApp Links)

**Landing page → WhatsApp:**
```html
<!-- Botón WhatsApp en landing -->
<a href="https://wa.me/{NEGOCIO_TELEFONO}?text=Hola%20{NEGOCIO_NOMBRE}%2C%20quiero%20informes%20de%20sus%20planes">
  WhatsApp
</a>

<!-- Por plan específico (botones de precio) -->
<a href="https://wa.me/{NEGOCIO_TELEFONO}?text=Hola%2C%20me%20interesa%20el%20plan%20{PLAN_NOMBRE}%20(%24{PLAN_PRECIO})">
  Comprar {PLAN_NOMBRE}
</a>
```

**Trigger automático del chatbot:**
```
Si el mensaje contiene "plan" o "precio" → ir directo al PASO 2 (selección)
Si contiene "cita" o "agendar" → ir directo al PASO 3 (datos)
Si contiene "hola" o texto genérico → PASO 1 (bienvenida)
```

---

## 🚀 ACTIVAR PARA NUEVO NEGOCIO

**Solo 3 pasos para agregar un negocio:**

1. **Agregar a negocios-database.json:**
```json
{
  "id": 9,
  "nombre": "Nuevo Negocio",
  "tipo": "barberia",
  "telefono": "55XXXXXXXX",
  "slug": "nuevo-negocio",
  "servicios": [...]
}
```

2. **Crear webhook en N8N:** 
   - Duplicar workflow-universal
   - Cambiar variable `NEGOCIO_ID = 9`
   - Activar

3. **Listo** — El chatbot ya funciona con los datos del JSON.

---

## 📊 MÉTRICAS A TRACKEAR

| KPI | Objetivo | Dónde ver |
|-----|----------|-----------|
| Mensajes entrantes/día | — | N8N logs |
| Conversión mensaje → pago | >20% | Sheets: leads vs pagos |
| Ticket promedio | Por negocio | Sheets: SUM(monto)/COUNT |
| Calificación promedio | >4.0 | Sheets: AVG(calificacion) |
| Tiempo de respuesta | <30 seg | N8N execution time |
| Tasa de abandono | <40% | Sheets: pendiente vs confirmado |
