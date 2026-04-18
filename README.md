# 🚀 NEGOCIOS UNIVERSALES — Arboledas, Jinetes

Solución digital para 40-50 negocios locales en Calzada de los Jinetes, Las Arboledas, Tlalnepantla de Baz.

**Stack:** HTML/CSS/JS · N8N · WhatsApp Business · Stripe · Google Sheets

---

## 📁 ESTRUCTURA

```
GYMS/
├── landing-universal.html          ← Template base con {{VARIABLES}}
├── chatbot-universal.md            ← Flujo WhatsApp para todos los tipos
├── workflow-universal.json         ← Workflow N8N importable
├── generate-landings.js            ← Script generador automático
│
├── market-analysis/
│   ├── negocios-database.json      ← Base de datos: 8 negocios confirmados
│   └── JINETES-MERCADO-ANALISIS.md ← Análisis de mercado
│
└── generated/
    ├── body-trainer-arboledas.html ← Landing Body Trainer ✅
    ├── bufalo-barberia.html        ← Landing Búfalo Barbería ✅
    ├── monte-cafe-arboledas.html   ← Landing Monte Café ✅
    └── el-anafre-arboledas.html    ← Landing El Anafre ✅
```

---

## ⚡ AGREGAR UN NEGOCIO NUEVO

### 1. Agregar al JSON
```json
// market-analysis/negocios-database.json
{
  "id": 9,
  "nombre": "Nuevo Negocio",
  "tipo": "barberia",           // gimnasio | barberia | restaurante | cafe
  "slug": "nuevo-negocio",
  "telefono": "55XXXXXXXX",
  "direccion": "Jinetes XXX, Arboledas",
  "horarios": "Lun-Sáb 10AM-8PM",
  "color_primario": "#78350f",
  "tiene_web": false,
  "oportunidad": "alta",
  "servicios": [
    { "nombre": "Servicio 1", "precio": 100, "tipo": "servicio" }
  ],
  "headline": "Tu headline aquí",
  "cta_principal": "Agendar ahora"
}
```

### 2. Agregar a prospectos prioritarios
```json
"prospectos_prioritarios": [1, 4, 6, 7, 9]
```

### 3. Generar landing
```bash
node generate-landings.js
# → genera generated/nuevo-negocio.html automáticamente
```

---

## 🤖 N8N WORKFLOW

**URL:** https://n8n-bkto.srv1511719.hstgr.cloud/

### Importar workflow
1. Ir a N8N → Workflows → Import
2. Subir `workflow-universal.json`
3. Configurar variables:
   - `GOOGLE_SHEETS_ID` → ID de tu hoja de Sheets
   - `WA_PHONE_NUMBER_ID` → ID del número WhatsApp Business
   - `WA_TOKEN` → Token de Meta API

### Agregar negocio al workflow
En el nodo **"Resolver Negocio + Sesión"**, agregar al objeto `negociosDB`:
```javascript
'55XXXXXXXX': {
  id: 9,
  nombre: 'Nuevo Negocio',
  tipo: 'barberia',
  // ...resto de datos del JSON
}
```

---

## 💬 CHATBOT WHATSAPP

Ver `chatbot-universal.md` para el flujo completo de 7 pasos.

**Lógica:** 1 flujo → se adapta según `negocio_tipo`
- `gimnasio` → muestra planes + genera link de pago Stripe
- `barberia` → agenda cita + confirma por WhatsApp
- `restaurante` → reserva mesa / pedido para llevar
- `cafe` → pedido anticipado para recoger

---

## 💳 STRIPE

Para activar pagos reales:
1. Crear productos en [Stripe Dashboard](https://dashboard.stripe.com)
2. Copiar Payment Link de cada producto
3. Actualizar `stripe_link` en `negocios-database.json`
4. El workflow de N8N los usa automáticamente

---

## 📊 GOOGLE SHEETS

Estructura de la tabla única (`transacciones`):

| Columna | Descripción |
|---------|-------------|
| negocio_id / negocio_nombre | Identificar el negocio |
| usuario_nombre / telefono | Datos del cliente |
| accion | inscripcion / cita / reserva / pedido |
| servicio / monto | Qué compró y cuánto pagó |
| estado | confirmado / pendiente / cancelado |
| fecha / fecha_visita | Cuándo |
| calificacion | Rating del follow-up (1-5) |
| follow_up_enviado | Boolean para evitar duplicados |

---

## 🎯 PROSPECTOS PRIORITARIOS

| # | Negocio | Tipo | Tel | Oportunidad |
|---|---------|------|-----|-------------|
| 1 | Body Trainer Gym | gimnasio | 55 3265 2927 | 🔥 ALTA — Cliente activo |
| 4 | Búfalo Barbería | barbería | — | 🔥 ALTA |
| 6 | Monte Café | café | — | 🔥 ALTA |
| 7 | El Anafre | restaurante | — | 🔥 ALTA (mismo edificio que Body Trainer) |

---

## 📞 CONTACTO

- **WhatsApp agencia:** wa.me/5532652927
- **N8N:** https://n8n-bkto.srv1511719.hstgr.cloud/
- **Repo:** github.com/garallen2389-create/GYMS
