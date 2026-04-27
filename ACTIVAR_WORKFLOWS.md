# 🚀 CÓMO ACTIVAR LOS WORKFLOWS N8N

## Paso 1: Generar Nuevo API Key en N8N Cloud

1. **Login en N8N:**
   ```
   https://n8n-bkto.srv1511719.hstgr.cloud/
   ```

2. **Ir a Settings → API Keys:**
   ```
   https://n8n-bkto.srv1511719.hstgr.cloud/user/api-keys
   ```

3. **Crear nuevo API Key:**
   - Click en "Create API Key"
   - Copia el token completo
   - **Importante:** Este es el único lugar donde lo verás - guárdalo

4. **Pegar en `.env.local`:**
   - Abre: `C:\Users\YO\GYMS\.env.local`
   - Reemplaza `N8N_API_KEY` con tu nuevo token
   - Guarda el archivo (No lo commitees)

---

## Paso 2: Subir los 5 Workflows

Ejecuta este comando desde `C:\Users\YO\GYMS`:

```bash
# Script para subir todos los workflows
for workflow in setup/wf_*.json; do
  echo "📤 Uploading $workflow..."
  curl -k -X POST "https://n8n-bkto.srv1511719.hstgr.cloud/api/v1/workflows" \
    -H "X-N8N-API-KEY: $(grep N8N_API_KEY .env.local | cut -d= -f2)" \
    -H "Content-Type: application/json" \
    -d "$(cat $workflow)"
  echo ""
done
```

**O manualmente desde la UI N8N:**
1. N8N Dashboard → Workflows
2. "Create" → "From file"
3. Selecciona cada archivo JSON en `setup/`
4. Importa los 5 workflows

---

## Paso 3: Configurar Variables de Entorno en N8N

**Settings → Environment Variables**

Agrega estas variables (si las tienes):

```
WA_TOKEN=<tu_whatsapp_token>
WA_PHONE_NUMBER_ID=<tu_phone_number_id>
GOOGLE_SHEETS_ID=<después_de_ejecutar_setup.js>
```

---

## Paso 4: Activar los Workflows

En N8N Dashboard:
1. Selecciona cada workflow
2. Click en el switch "Active" (esquina superior derecha)
3. Confirma

Alternativamente, vía API:
```bash
# Para cada workflow ID
curl -k -X POST "https://n8n-bkto.srv1511719.hstgr.cloud/api/v1/workflows/{id}/activate" \
  -H "X-N8N-API-KEY: $N8N_API_KEY"
```

---

## Paso 5: Google Sheets Setup

1. Abre Google Sheets → Nueva hoja
2. Extensiones → Apps Script
3. Pega el contenido de: `setup/google-sheets-setup.js`
4. Ejecuta la función: `setupTransacciones()`
5. Copia el `GOOGLE_SHEETS_ID` del alert
6. Pásalo en `.env.local` y en N8N env vars

---

## Paso 6: Testear los Webhooks

Prueba cada webhook:

```bash
# Body Trainer
curl -X POST "https://n8n-bkto.srv1511719.hstgr.cloud/webhook/body-trainer" \
  -H "Content-Type: application/json" \
  -d '{
    "entry":[{"changes":[{"value":{"messages":[{
      "from":"5532652927",
      "text":{"body":"hola"}
    }]}}]}]
  }'

# Similar para otros: bufalo-barberia, monte-cafe, el-anafre, whatsapp-universal
```

---

## 📋 Checklist de Activación

- [ ] Generar nuevo API key en N8N
- [ ] Guardar API key en `.env.local`
- [ ] Subir 5 workflows N8N
- [ ] Verificar que los webhooks se registraron (sin 404)
- [ ] Configurar env vars (WA_TOKEN, GOOGLE_SHEETS_ID, etc)
- [ ] Activar los 5 workflows
- [ ] Ejecutar Google Sheets setup
- [ ] Testear webhooks con curl
- [ ] Verificar mensajes de prueba en WhatsApp

---

## 🔗 Links Importantes

- **N8N Cloud:** https://n8n-bkto.srv1511719.hstgr.cloud/
- **API Keys:** https://n8n-bkto.srv1511719.hstgr.cloud/user/api-keys
- **Workflows:** https://n8n-bkto.srv1511719.hstgr.cloud/workflows
- **GitHub Repo:** https://github.com/garallen2389-create/GYMS

---

## 📞 Soporte

**Si algo no funciona:**

1. ✅ Verifica que el API key sea válido
2. ✅ Verifica que los webhooks tengan `webhookId` correcto (están en el JSON)
3. ✅ Verifica que WA_TOKEN y WA_PHONE_NUMBER_ID estén configurados
4. ✅ Chequea la consola de N8N para errores
5. ✅ Testea con curl directamente (sin N8N)

---

**Todo está listo. Solo necesitas el API key válido.** 🚀
