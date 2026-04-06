# 📋 Instrucciones: Conectar con Google Sheets

## ¿Qué lograrás?
Cada vez que un estudiante haga clic en **"Enviar Respuestas al Profesor"**, sus resultados (nombre, proyecto, puntajes PP, FO, FS, MPL y ganadores) se guardarán automáticamente en una hoja de Google Sheets tuya.

---

## Paso 1 — Crear la hoja de Google Sheets

1. Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja nueva.
2. Nómbrala como quieras, por ejemplo: `Localización - Ejercicio 1`.
3. Copia el **ID** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```
   El ID es la parte larga entre `/d/` y `/edit`.

---

## Paso 2 — Crear el Apps Script

1. Con la hoja abierta, ve a **Extensiones → Apps Script**.
2. Borra el código que aparece por defecto.
3. Abre el archivo `setup/apps-script.gs` y **copia todo su contenido**.
4. Pégalo en el editor de Apps Script.
5. En la línea que dice:
   ```javascript
   const SHEET_ID = 'REEMPLAZA_CON_EL_ID_DE_TU_HOJA';
   ```
   Reemplaza `REEMPLAZA_CON_EL_ID_DE_TU_HOJA` con el ID que copiaste en el Paso 1.
6. Guarda el proyecto (Ctrl+S). Ponle un nombre como `Localizacion-Recibidor`.

---

## Paso 3 — Crear los encabezados de la hoja

1. En el editor de Apps Script, selecciona la función **`setupSheet`** en el selector de funciones (arriba).
2. Haz clic en **▶ Ejecutar**.
3. Si te pide permisos → **Revisar permisos → Permitir**.
4. Ve a tu Google Sheet y verás la fila de encabezados creada automáticamente.

---

## Paso 4 — Desplegar como Web App

1. En el editor, haz clic en **Implementar → Nueva implementación**.
2. Configura:
   - **Tipo**: Web App
   - **Descripción**: `v1.0 - Localizacion Ejercicio`
   - **Ejecutar como**: `Yo (tu-correo@gmail.com)`
   - **Quién puede acceder**: `Cualquiera`
3. Haz clic en **Implementar**.
4. Si pide permisos nuevamente → Permite.
5. Copia la **URL de la Web App** que aparece. Se verá así:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```

---

## Paso 5 — Pegarlo en el código

1. Abre el archivo `js/ejercicio.js`.
2. En la línea 11:
   ```javascript
   const SHEETS_URL = 'https://script.google.com/macros/s/REEMPLAZA_CON_TU_URL/exec';
   ```
3. Reemplaza `REEMPLAZA_CON_TU_URL` con el número/código de tu URL (la parte entre `/s/` y `/exec`).
4. Guarda el archivo.

---

## Paso 6 — Probar

1. Abre `index.html` en el navegador.
2. Baja hasta el botón **✏️ Ejercicio 1**.
3. Escribe un nombre de prueba, selecciona un proyecto y completa ambos métodos.
4. Haz clic en **📤 Enviar Respuestas al Profesor**.
5. Verifica que el mensaje diga ✅ y abre tu Google Sheet para confirmar la fila nueva.

---

## Estructura de columnas en la hoja

| Columna | Contenido |
|---------|-----------|
| A | Fecha y hora |
| B | Nombre del estudiante |
| C | Proyecto (Suplementos / Logística) |
| D | Zona de estudio |
| E–G | PP: ciudades |
| F–H | PP: puntajes |
| I | PP: ciudad ganadora |
| J | Valor de K usado |
| K–M | FO de cada ciudad |
| N–P | FS de cada ciudad |
| Q–S | MPL de cada ciudad |
| T | B&G: ciudad ganadora |

---

## ⚠️ Notas importantes

- Después de **cualquier cambio** en el código del Apps Script, debes hacer una **nueva implementación** (`Implementar → Administrar implementaciones → Nueva versión`) para que los cambios surtan efecto.
- La URL de la Web App **no cambia** entre versiones, solo actualiza el código interno.
- Si los estudiantes usan el archivo desde una carpeta local (sin servidor), la función de envío funciona igual gracias al `Content-Type: text/plain`.
