#!/bin/bash
# ============================================================
# IMPORTAR WORKFLOW A N8N — Negocios Universales Arboledas
# ============================================================
# USO: bash import-n8n.sh TU_API_KEY
# ============================================================

N8N_URL="https://n8n-bkto.srv1511719.hstgr.cloud"
API_KEY="${1:-}"
WORKFLOW_FILE="../workflow-universal.json"

if [ -z "$API_KEY" ]; then
  echo "❌ ERROR: Falta el API Key"
  echo "Uso: bash import-n8n.sh TU_API_KEY"
  echo ""
  echo "Cómo obtener tu API Key:"
  echo "1. Ve a $N8N_URL"
  echo "2. Clic en tu usuario (esquina inferior izquierda)"
  echo "3. Settings → API → Create API Key"
  echo "4. Copia la key y úsala aquí"
  exit 1
fi

echo "🔗 Conectando a N8N: $N8N_URL"

# Verificar conexión
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "X-N8N-API-KEY: $API_KEY" \
  "$N8N_URL/api/v1/workflows")

if [ "$STATUS" != "200" ]; then
  echo "❌ Error de autenticación (HTTP $STATUS). Verifica tu API Key."
  exit 1
fi

echo "✅ Conexión exitosa"
echo "📤 Importando workflow..."

# Importar workflow
RESPONSE=$(curl -s -X POST \
  -H "X-N8N-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d @"$WORKFLOW_FILE" \
  "$N8N_URL/api/v1/workflows")

WORKFLOW_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$WORKFLOW_ID" ]; then
  echo "❌ Error al importar:"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Workflow creado con ID: $WORKFLOW_ID"
echo "🔗 URL: $N8N_URL/workflow/$WORKFLOW_ID"
echo ""
echo "⚠️  PRÓXIMOS PASOS en N8N:"
echo "1. Configurar credencial Google Sheets (Service Account)"
echo "2. Configurar credencial HTTP Header Auth (WhatsApp Token)"
echo "3. Instalar Redis en N8N (para sesiones)"
echo "4. Activar el workflow"
echo ""
echo "Recuerda configurar estas variables en los nodos Code:"
echo "  - GOOGLE_SHEETS_ID → ID de tu hoja de Sheets"
echo "  - WA_PHONE_NUMBER_ID → ID del número WhatsApp Business"
echo "  - WA_TOKEN → Token de Meta API"
