/**
 * GOOGLE SHEETS SETUP — Negocios Universales
 *
 * INSTRUCCIONES:
 * 1. Ve a sheets.google.com → crear nueva hoja
 * 2. Extensiones → Apps Script
 * 3. Pega este código completo
 * 4. Ejecutar → setupTransacciones()
 * 5. Copia el ID de la hoja (URL: /d/ESTE_ID/edit)
 * 6. Ponlo en workflow-universal.json como GOOGLE_SHEETS_ID
 */

function setupTransacciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── HOJA 1: TRANSACCIONES ─────────────────────────────────
  let sheet = ss.getSheetByName('transacciones');
  if (!sheet) sheet = ss.insertSheet('transacciones');

  sheet.clearContents();

  const headers = [
    'id', 'negocio_id', 'negocio_nombre', 'negocio_tipo',
    'usuario_nombre', 'usuario_telefono', 'usuario_email',
    'accion', 'servicio', 'monto', 'stripe_id',
    'estado', 'fecha', 'fecha_visita',
    'calificacion', 'notas', 'follow_up_enviado'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1a1a1a');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);

  // Anchos de columna
  sheet.setColumnWidth(1, 120);   // id
  sheet.setColumnWidth(2, 80);    // negocio_id
  sheet.setColumnWidth(3, 180);   // negocio_nombre
  sheet.setColumnWidth(4, 100);   // negocio_tipo
  sheet.setColumnWidth(5, 160);   // usuario_nombre
  sheet.setColumnWidth(6, 120);   // usuario_telefono
  sheet.setColumnWidth(7, 160);   // usuario_email
  sheet.setColumnWidth(8, 120);   // accion
  sheet.setColumnWidth(9, 160);   // servicio
  sheet.setColumnWidth(10, 80);   // monto
  sheet.setColumnWidth(11, 200);  // stripe_id
  sheet.setColumnWidth(12, 100);  // estado
  sheet.setColumnWidth(13, 100);  // fecha
  sheet.setColumnWidth(14, 110);  // fecha_visita
  sheet.setColumnWidth(15, 100);  // calificacion
  sheet.setColumnWidth(16, 200);  // notas
  sheet.setColumnWidth(17, 130);  // follow_up_enviado

  // Congelar encabezados
  sheet.setFrozenRows(1);

  // ── HOJA 2: MÉTRICAS ──────────────────────────────────────
  let metricas = ss.getSheetByName('metricas');
  if (!metricas) metricas = ss.insertSheet('metricas');

  metricas.clearContents();

  // Títulos
  metricas.getRange('A1').setValue('MÉTRICAS — NEGOCIOS UNIVERSALES');
  metricas.getRange('A1').setFontSize(14).setFontWeight('bold');

  metricas.getRange('A3').setValue('Negocio');
  metricas.getRange('B3').setValue('Total Leads');
  metricas.getRange('C3').setValue('Confirmados');
  metricas.getRange('D3').setValue('Ingresos');
  metricas.getRange('E3').setValue('Conversión %');
  metricas.getRange('F3').setValue('Rating Promedio');

  const metHeaders = metricas.getRange('A3:F3');
  metHeaders.setBackground('#dc2626');
  metHeaders.setFontColor('#ffffff');
  metHeaders.setFontWeight('bold');

  // Fórmulas automáticas por negocio
  const negocios = [
    [1, 'Body Trainer Gym'],
    [4, 'Búfalo Barbería'],
    [6, 'Monte Café'],
    [7, 'El Anafre']
  ];

  negocios.forEach(([id, nombre], i) => {
    const row = i + 4;
    metricas.getRange(row, 1).setValue(nombre);
    // COUNTIF para leads totales
    metricas.getRange(row, 2).setFormula(
      `=COUNTIF(transacciones!B:B,${id})`
    );
    // COUNTIFS para confirmados
    metricas.getRange(row, 3).setFormula(
      `=COUNTIFS(transacciones!B:B,${id},transacciones!L:L,"confirmado")`
    );
    // SUMIF para ingresos
    metricas.getRange(row, 4).setFormula(
      `=SUMIF(transacciones!B:B,${id},transacciones!J:J)`
    );
    // Conversión %
    metricas.getRange(row, 5).setFormula(
      `=IF(B${row}=0,"0%",TEXT(C${row}/B${row},"0%"))`
    );
    // Rating promedio
    metricas.getRange(row, 6).setFormula(
      `=IFERROR(AVERAGEIFS(transacciones!O:O,transacciones!B:B,${id},transacciones!O:O,"<>"),"—")`
    );
  });

  // Totales
  const totalRow = negocios.length + 4;
  metricas.getRange(totalRow, 1).setValue('TOTAL').setFontWeight('bold');
  metricas.getRange(totalRow, 2).setFormula(`=SUM(B4:B${totalRow-1})`).setFontWeight('bold');
  metricas.getRange(totalRow, 3).setFormula(`=SUM(C4:C${totalRow-1})`).setFontWeight('bold');
  metricas.getRange(totalRow, 4).setFormula(`=SUM(D4:D${totalRow-1})`).setFontWeight('bold');

  metricas.setColumnWidth(1, 180);
  metricas.setColumnWidth(2, 100);
  metricas.setColumnWidth(3, 110);
  metricas.setColumnWidth(4, 100);
  metricas.setColumnWidth(5, 100);
  metricas.setColumnWidth(6, 130);

  // ── HOJA 3: NEGOCIOS ──────────────────────────────────────
  let negSheet = ss.getSheetByName('negocios');
  if (!negSheet) negSheet = ss.insertSheet('negocios');

  negSheet.clearContents();

  const negHeaders = ['id', 'nombre', 'tipo', 'telefono', 'direccion', 'activo'];
  negSheet.getRange(1, 1, 1, negHeaders.length).setValues([negHeaders]);
  negSheet.getRange(1, 1, 1, negHeaders.length)
    .setBackground('#1a1a1a').setFontColor('#fff').setFontWeight('bold');

  // Datos iniciales
  const negData = [
    [1, 'Body Trainer Gym Arboledas', 'gimnasio', '5532652927', 'Jinetes 35, Arboledas', true],
    [4, 'Búfalo Barbería Arboledas', 'barberia', '', 'Jinetes 141 L5, Arboledas', true],
    [6, 'Monte Café Arboledas', 'cafe', '', 'Jinetes 77, Arboledas', true],
    [7, 'El Anafre Arboledas', 'restaurante', '', 'Jinetes 35, Arboledas', true]
  ];
  negSheet.getRange(2, 1, negData.length, 6).setValues(negData);

  // ── RESULTADO ─────────────────────────────────────────────
  const sheetId = ss.getId();

  SpreadsheetApp.getUi().alert(
    '✅ Setup completado!\n\n' +
    'Tu GOOGLE_SHEETS_ID es:\n' + sheetId + '\n\n' +
    'Cópialo y ponlo en:\n' +
    '• workflow-universal.json → nodo "Guardar en Google Sheets"\n' +
    '• N8N → credenciales de Google Sheets'
  );

  Logger.log('GOOGLE_SHEETS_ID: ' + sheetId);
}
