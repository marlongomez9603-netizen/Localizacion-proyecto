// ============================================================
// Google Apps Script — Code.gs
// Despliega como Web App para recibir respuestas del ejercicio
// ============================================================
//
// INSTRUCCIONES DE DESPLIEGUE:
// 1. Abre script.google.com → Nuevo proyecto
// 2. Pega este código completo
// 3. Rellena SHEET_ID con el ID de tu Google Sheet (ver abajo)
// 4. Crea la hoja con las columnas del encabezado (función setupSheet)
// 5. Ejecuta setupSheet() una sola vez para crear el encabezado
// 6. Despliega: Implementar → Nueva implementación → Web App
//    - Ejecutar como: Yo (tu cuenta)
//    - Quién puede acceder: Cualquiera
// 7. Copia la URL y pégala en ejercicio.js (variable SHEETS_URL)

// ── CONFIGURA AQUÍ ────────────────────────────────────────────
// ID de tu Google Sheet: la parte larga de la URL
// Ejemplo: docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
const SHEET_ID = 'REEMPLAZA_CON_EL_ID_DE_TU_HOJA';
const SHEET_NAME = 'Respuestas Ejercicio 1';

// ── Función principal: recibe POST del formulario ─────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    sheet.appendRow([
      data.timestamp         || new Date().toLocaleString('es-CO'),
      data.estudiante        || '',
      data.proyecto          || '',
      data.ubicacion         || '',
      // Puntos Ponderados
      data.pp_ciudad1        || '',
      data.pp_score1         || '',
      data.pp_ciudad2        || '',
      data.pp_score2         || '',
      data.pp_ciudad3        || '',
      data.pp_score3         || '',
      data.pp_ganador        || '',
      // Brown & Gibson
      data.bg_K              || '',
      data.bg_fo1            || '',
      data.bg_fo2            || '',
      data.bg_fo3            || '',
      data.bg_fs1            || '',
      data.bg_fs2            || '',
      data.bg_fs3            || '',
      data.bg_mpl1           || '',
      data.bg_mpl2           || '',
      data.bg_mpl3           || '',
      data.bg_ganador        || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Ejecuta UNA VEZ para crear la hoja con encabezados ────────
function setupSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Solo agregar encabezados si la hoja está vacía
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Fecha/Hora', 'Estudiante', 'Proyecto', 'Zona',
      // PP
      'PP Ciudad 1', 'PP Score 1',
      'PP Ciudad 2', 'PP Score 2',
      'PP Ciudad 3', 'PP Score 3',
      'PP Ganador',
      // B&G
      'B&G K', 'FO Ciudad 1', 'FO Ciudad 2', 'FO Ciudad 3',
      'FS Ciudad 1', 'FS Ciudad 2', 'FS Ciudad 3',
      'MPL Ciudad 1', 'MPL Ciudad 2', 'MPL Ciudad 3',
      'B&G Ganador'
    ];
    sheet.appendRow(headers);

    // Formato del encabezado
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a2e');
    headerRange.setFontColor('#00d4ff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);

    Logger.log('✅ Hoja configurada correctamente con ' + headers.length + ' columnas.');
  } else {
    Logger.log('⚠️ La hoja ya tiene datos. No se modificó el encabezado.');
  }
}

// ── Prueba manual: simula una respuesta POST ───────────────────
function testDoPost() {
  const fakeData = {
    timestamp: new Date().toLocaleString('es-CO'),
    estudiante: 'Estudiante Prueba',
    proyecto: 'Tienda de Suplementos',
    ubicacion: 'Puerto Wilches',
    pp_ciudad1: 'Puerto Wilches', pp_score1: '7.1500',
    pp_ciudad2: 'Barrancabermeja', pp_score2: '6.8000',
    pp_ciudad3: 'Sabana de Torres', pp_score3: '5.9500',
    pp_ganador: 'Puerto Wilches',
    bg_K: '0.60',
    bg_fo1: '0.3851', bg_fo2: '0.3247', bg_fo3: '0.2902',
    bg_fs1: '0.7200', bg_fs2: '0.6500', bg_fs3: '0.5800',
    bg_mpl1: '0.5191', bg_mpl2: '0.4548', bg_mpl3: '0.4063',
    bg_ganador: 'Puerto Wilches'
  };

  const mockE = { postData: { contents: JSON.stringify(fakeData) } };
  const result = doPost(mockE);
  Logger.log(result.getContent());
}
