/* ============================================================
   data.js — Datos de proyectos: Suplementos y Logística
   ============================================================ */

const PROYECTOS = {

  /* ────────────────────────────────────────────────────────
     PROYECTO 1: Tienda de Suplementos Deportivos
  ──────────────────────────────────────────────────────── */
  suplementos: {
    id: 'suplementos',
    nombre: 'Tienda de Suplementos Deportivos',
    emoji: '💊',
    ubicacion: 'Puerto Wilches, Santander',
    color: '#7c3aed',

    /* ── Proceso Productivo ── */
    proceso: [
      { id:'p1', tipo:'operacion',    icon:'📦', label:'Recepción de Inventario',
        desc:'Llegada de mercancía de proveedores (proteínas, vitaminas, accesorios). Se verifica el pedido contra la orden de compra y se inspeccionan empaques.' },
      { id:'p2', tipo:'decision',     icon:'🔍', label:'Control de Calidad',
        desc:'¿Los productos están en buen estado, dentro de la fecha de vencimiento y completos? — Sí → continúa. No → devolución al proveedor.' },
      { id:'p3', tipo:'transporte',   icon:'🔄', label:'Traslado a Bodega',
        desc:'Los productos aprobados se mueven manualmente al área de almacenamiento, clasificados por categoría (proteínas, vitaminas, snacks, accesorios).' },
      { id:'p4', tipo:'almacenamiento',icon:'🏪',label:'Almacenamiento',
        desc:'Productos organizados en estantes metálicos. Rotación FIFO (primero en entrar, primero en salir). Se actualiza el inventario en el sistema.' },
      { id:'p5', tipo:'operacion',    icon:'🛒', label:'Exhibición en Sala de Ventas',
        desc:'Surtido de estantes del salón según demanda y temporada. Estrategia de merchandising: productos de mayor margen a la altura de los ojos.' },
      { id:'p6', tipo:'operacion',    icon:'👥', label:'Atención al Cliente',
        desc:'Asesoramiento personalizado según objetivos del cliente (masa muscular, pérdida de peso, rendimiento). Recomendación de productos y planes.' },
      { id:'p7', tipo:'operacion',    icon:'🧾', label:'Venta y Facturación',
        desc:'Registro en punto de venta (POS). Métodos de pago: efectivo, transferencia, datáfono. Emisión de factura electrónica.' },
      { id:'p8', tipo:'operacion',    icon:'✅', label:'Despacho / Entrega',
        desc:'Entrega del producto al cliente. Empaque y bolsa con marca de la tienda. Verificación del artículo antes de entregar.' },
      { id:'p9', tipo:'operacion',    icon:'⭐', label:'Servicio Posventa',
        desc:'Atención de garantías, cambios y retroalimentación. Programa de fidelización: descuentos por compras frecuentes. Seguimiento por WhatsApp/redes.' }
    ],

    /* ── Distribución de Planta ── */
    layoutAreas: [
      { id:'ventas',   label:'Sala de Ventas',        color:'#7c3aed', m2: 36, icon:'🛒' },
      { id:'bodega',   label:'Bodega / Almacén',       color:'#0891b2', m2: 14, icon:'📦' },
      { id:'caja',     label:'Caja / Mostrador',       color:'#059669', m2:  8, icon:'🧾' },
      { id:'oficina',  label:'Oficina Administración', color:'#d97706', m2:  6, icon:'💼' },
      { id:'banos',    label:'Baños',                  color:'#475569', m2:  4, icon:'🚻' }
    ],
    layoutTotal: 68, // m²

    /* ── Maquinaria y Equipo ── */
    maquinaria: [
      { item:'Estantes metálicos',          cant:8, costoU: 350000, vida:10, proveedor:'Ferreterías nacionales' },
      { item:'Mostrador / Caja exhibidora', cant:1, costoU:1200000, vida: 8, proveedor:'Muebles Wilches' },
      { item:'Computador + Software POS',   cant:1, costoU:2500000, vida: 5, proveedor:'Tecnología regional' },
      { item:'Frigorífico exhibidor',       cant:1, costoU:1800000, vida:10, proveedor:'Indusel S.A.' },
      { item:'Aire acondicionado split',    cant:2, costoU:1500000, vida:12, proveedor:'Haceb' },
      { item:'Cámara de seguridad',         cant:4, costoU: 280000, vida: 5, proveedor:'Hikvision' },
      { item:'Báscula digital',             cant:1, costoU: 180000, vida: 7, proveedor:'Local' },
      { item:'Datáfono',                    cant:1, costoU: 650000, vida: 4, proveedor:'Banco de Bogotá' },
      { item:'Letrero luminoso / fachada',  cant:1, costoU: 900000, vida: 8, proveedor:'Publicidad Bucaramanga' }
    ],

    /* ── Organigrama ── */
    organigrama: {
      id:'root', titulo:'Propietario / Gerente', color:'#7c3aed',
      descripcion:'Dirección estratégica general. Decisiones de compra y relación con proveedores. Representación legal del negocio.',
      perfil:'Emprendedor con conocimiento en nutrición deportiva. Experiencia en ventas y atención al cliente. Preferiblemente profesional o tecnólogo.',
      children:[
        { id:'admin', titulo:'Administrador / Contador', color:'#0891b2',
          descripcion:'Manejo de caja, nómina, contabilidad y reportes financieros. Declaraciones de renta e IVA.',
          perfil:'Técnico o tecnólogo en contabilidad o administración. Conocimiento de facturación electrónica.',
          children:[] },
        { id:'asesor', titulo:'Asesor Comercial', color:'#059669',
          descripcion:'Atención al cliente, asesoramiento en productos, ventas, recomendación de rutinas y surtido de estantes.',
          perfil:'Bachiller con formación o interés en nutrición. Actitud de servicio, comunicación efectiva y pasión por el deporte.',
          children:[
            { id:'aux', titulo:'Auxiliar de Ventas', color:'#059669',
              descripcion:'Apoyo en atención al cliente, caja, organización de estantes y recepción de inventario. Refuerzo fines de semana.',
              perfil:'Bachiller. Disponibilidad fines de semana y festivos. Actitud proactiva.',
              children:[] }
          ]},
        { id:'mkt', titulo:'Community Manager', color:'#d97706',
          descripcion:'Gestión de redes sociales (Instagram, TikTok, Facebook), publicidad digital, contenido de nutrición y fidelización online.',
          perfil:'Tecnólogo en mercadeo digital o comunicaciones. Puede ser contrato freelance o medio tiempo.',
          children:[] }
      ]
    }
  },

  /* ────────────────────────────────────────────────────────
     PROYECTO 2: Empresa de Logística E-commerce
  ──────────────────────────────────────────────────────── */
  logistica: {
    id: 'logistica',
    nombre: 'Empresa de Logística E-commerce',
    emoji: '📦',
    ubicacion: 'Puente Sogamoso, Santander — Magdalena Medio',
    color: '#0891b2',

    /* ── Proceso Productivo ── */
    proceso: [
      { id:'l1', tipo:'operacion',     icon:'🚛', label:'Recepción de Paquetes',
        desc:'Llegada de mercancía desde centros de consolidación en Bogotá, Medellín o Bucaramanga. Se recibe el vehículo y se descarga manualmente.' },
      { id:'l2', tipo:'operacion',     icon:'📱', label:'Registro en Sistema (WMS)',
        desc:'Escaneo de códigos QR/barras de cada paquete con lector handheld. Registro automático en el sistema de gestión de almacén (WMS). Se verifica guía vs. paquete.' },
      { id:'l3', tipo:'decision',      icon:'🔍', label:'Verificación de Estado',
        desc:'¿El paquete está en buen estado físico y los datos coinciden con la guía de envío? — Sí → continúa al sorting. No → proceso de devolución o novedad.' },
      { id:'l4', tipo:'operacion',     icon:'📊', label:'Clasificación / Sorting',
        desc:'Sorting de paquetes por zona de entrega: urbana (Barrancabermeja), semirural (Puerto Wilches) y rural (Puente Sogamoso y veredas). Agrupación por rutas.' },
      { id:'l5', tipo:'transporte',    icon:'🔄', label:'Traslado a Almacenamiento',
        desc:'Movimiento interno de paquetes clasificados a los estantes correspondientes por zona. Uso de montacargas manual (paquetes pesados).' },
      { id:'l6', tipo:'almacenamiento',icon:'📦', label:'Almacenamiento Temporal',
        desc:'Paquetes ubicados en estantería metálica por zona y ruta. Tiempo máximo de permanencia: 24–48 horas. Control FIFO para evitar retrasos.' },
      { id:'l7', tipo:'operacion',     icon:'🗺️', label:'Asignación de Ruta',
        desc:'El WMS asigna paquetes a mensajeros/conductores según zona, capacidad del vehículo y urgencia del envío. Optimización de rutas por algoritmo.' },
      { id:'l8', tipo:'transporte',    icon:'🚗', label:'Despacho a Entrega',
        desc:'Cargue de motos y camionetas. Verificación de guías con escáner antes de salir. El sistema registra hora de despacho y vehículo asignado.' },
      { id:'l9', tipo:'operacion',     icon:'🤝', label:'Entrega al Destinatario',
        desc:'El mensajero entrega el paquete al destinatario. Confirmación con firma en app móvil o código SMS. Se toma foto como evidencia de entrega.' },
      { id:'l10',tipo:'operacion',     icon:'✅', label:'Confirmación Digital',
        desc:'El sistema actualiza el estado a "entregado". Se notifica automáticamente al marketplace (Shein, Linio, etc.) y al comprador final vía e-mail/SMS.' },
      { id:'l11',tipo:'decision',      icon:'❓', label:'¿Entrega Exitosa?',
        desc:'¿El destinatario recibió el paquete? — Sí → proceso terminado. No → se reagenda o se inicia proceso de devolución al remitente.' }
    ],

    /* ── Distribución de Planta ── */
    layoutAreas: [
      { id:'recepcion', label:'Recepción / Cargue',     color:'#7c3aed', m2: 40, icon:'🚛' },
      { id:'sorting',   label:'Clasificación / Sorting', color:'#0891b2', m2: 60, icon:'📊' },
      { id:'almacen',   label:'Almacenamiento',          color:'#059669', m2: 80, icon:'📦' },
      { id:'despacho',  label:'Despacho',                color:'#dc2626', m2: 40, icon:'🚗' },
      { id:'oficinas',  label:'Oficinas / Sistemas',     color:'#d97706', m2: 20, icon:'💼' },
      { id:'banos',     label:'Baños / Vestieres',       color:'#475569', m2: 10, icon:'🚻' }
    ],
    layoutTotal: 250, // m²

    /* ── Maquinaria y Equipo ── */
    maquinaria: [
      { item:'Escáner de códigos handheld',        cant: 4, costoU:  850000, vida: 5, proveedor:'Zebra Technologies' },
      { item:'Computador de escritorio',           cant: 3, costoU: 2200000, vida: 5, proveedor:'Lenovo / Dell' },
      { item:'Impresora de guías de envío',        cant: 2, costoU:  450000, vida: 5, proveedor:'Brother' },
      { item:'Estantería metálica pesada',         cant:20, costoU:  480000, vida:15, proveedor:'Ferreterías SICO' },
      { item:'Banda transportadora manual',        cant: 2, costoU: 3200000, vida:10, proveedor:'Indusel S.A.' },
      { item:'Montacargas hidráulico manual',      cant: 3, costoU: 1100000, vida: 8, proveedor:'Hiab Colombia' },
      { item:'Motos de reparto 125 cc',            cant: 6, costoU: 8500000, vida: 5, proveedor:'Honda / Yamaha' },
      { item:'Camioneta Pick-up 1 ton',            cant: 2, costoU:65000000, vida: 8, proveedor:'Chevrolet Colombia' },
      { item:'Cámara de seguridad IP',             cant: 8, costoU:  280000, vida: 5, proveedor:'Hikvision' },
      { item:'UPS / Reguladores de voltaje',       cant: 3, costoU:  350000, vida: 6, proveedor:'APC' },
      { item:'Software WMS (licencia anual)',       cant: 1, costoU: 4800000, vida: 1, proveedor:'SaaS logístico' }
    ],

    /* ── Organigrama ── */
    organigrama: {
      id:'root', titulo:'Gerente General', color:'#0891b2',
      descripcion:'Dirección estratégica, relación con plataformas e-commerce (Shein, Linio, etc.), decisiones de inversión y representación legal.',
      perfil:'Profesional en logística, administración o ingeniería industrial. Mínimo 3 años de experiencia en centros de distribución.',
      children:[
        { id:'ops', titulo:'Jefe de Operaciones', color:'#7c3aed',
          descripcion:'Supervisión de recepción, sorting, almacenamiento y despacho. Control de KPIs operativos (tiempo de entrega, tasa de éxito, inventario).',
          perfil:'Tecnólogo en logística o administración. Experiencia en centro de distribución. Manejo de WMS.',
          children:[
            { id:'recep', titulo:'Operarios de Recepción (×3)', color:'#475569',
              descripcion:'Descargue de vehículos, escaneo de paquetes y registro en WMS. Verificación física de estado y guías.',
              perfil:'Bachiller. Habilidad para uso de escáner y sistemas básicos. Capacidad de trabajo físico.',
              children:[] },
            { id:'sort', titulo:'Clasificadores / Sorters (×4)', color:'#475569',
              descripcion:'Sorting de paquetes por zona, organización en estantería y control de inventario físico.',
              perfil:'Bachiller. Atención al detalle, ritmo rápido de trabajo. Capacidad de aprendizaje.',
              children:[] },
            { id:'mens', titulo:'Mensajeros / Conductores (×8)', color:'#475569',
              descripcion:'Entrega de paquetes en ruta asignada. Uso de app móvil para confirmación. Manejo de vehículo asignado.',
              perfil:'Licencia de conducción moto A2 o vehículo C. Conocimiento de la zona regional. Actitud de servicio.',
              children:[] }
          ]},
        { id:'ti', titulo:'Coordinador TI / Sistemas', color:'#059669',
          descripcion:'Administración del WMS, integración de APIs con marketplaces, soporte técnico de equipos y mantenimiento de red.',
          perfil:'Tecnólogo o ingeniero de sistemas. Experiencia en WMS/ERP. Conocimiento de APIs REST.',
          children:[] },
        { id:'admin3', titulo:'Administrador / Contabilidad', color:'#d97706',
          descripcion:'Nómina, cuentas por pagar/cobrar, reportes financieros, obligaciones tributarias y control presupuestal.',
          perfil:'Tecnólogo en contabilidad o administración. Manejo de software contable. Responsabilidad y confidencialidad.',
          children:[] },
        { id:'svc', titulo:'Atención al Cliente (PQR)', color:'#dc2626',
          descripcion:'Gestión de peticiones, quejas y reclamos. Rastreo de paquetes problemáticos. Comunicación con compradores y marketplaces.',
          perfil:'Bachiller o técnico. Excelentes habilidades comunicativas. Manejo de herramientas digitales y CRM básico.',
          children:[] }
      ]
    }
  }
};
