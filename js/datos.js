/* ============ CAPA DE DATOS ============
   Hoy: localStorage + genera el SQL Oracle equivalente en el panel "SQL".
   Mañana: cambiar insert/update/remove/list por fetch() a un backend que hable con Oracle
   (PHP con oci8, Node con oracledb, o Java JDBC). La vista no cambia.
*/
const api = {
  key: 'tiosam_db', logKey: 'tiosam_sql',
  db: null, log: [],
  load(){ try{ this.db = JSON.parse(localStorage.getItem(this.key)); this.log = JSON.parse(localStorage.getItem(this.logKey))||[]; }catch(e){} if(!this.db) this.reset(); },
  save(){ localStorage.setItem(this.key, JSON.stringify(this.db)); localStorage.setItem(this.logKey, JSON.stringify(this.log)); },
  reset(){ this.db = JSON.parse(JSON.stringify(SEED)); this.log=[]; this.save(); },
  list(t){ return this.db[t]; },
  insert(t,row){ const rows=this.db[t]; row.id = rows.length ? Math.max(...rows.map(r=>r.id))+1 : 1; rows.push(row); this.sql(sqlInsert(t,row)); return row; },
  update(t,id,row){ const i=this.db[t].findIndex(r=>r.id==id); this.db[t][i] = {...this.db[t][i],...row,id}; this.sql(sqlUpdate(t,id,row)); },
  remove(t,id){ this.db[t] = this.db[t].filter(r=>r.id!=id); this.sql(`DELETE FROM ${t} WHERE id = ${id};`); },
  get(t,id){ return this.db[t].find(r=>r.id==id); },
  sql(s){ this.log.push(s); this.save(); },
};
/* SQL Oracle: fechas con TO_DATE, textos con comillas simples dobladas, NULL real */
const lit = (v,f) => v==null||v==='' ? 'NULL' : f?.type==='date' ? `TO_DATE('${v}','YYYY-MM-DD')` : typeof v==='number' ? v : `'${String(v).replace(/'/g,"''")}'`;
const cols = t => SCHEMA[t].f.filter(f=>!f.calc);
const sqlInsert = (t,row) => `INSERT INTO ${t} (${cols(t).map(f=>f.k).join(', ')})\n  VALUES (${cols(t).map(f=>lit(row[f.k],f)).join(', ')});`;
const sqlUpdate = (t,id,row) => `UPDATE ${t}\n  SET ${cols(t).map(f=>`${f.k} = ${lit(row[f.k],f)}`).join(',\n      ')}\n  WHERE id = ${id};`;

/* ============ DATOS INICIALES (mismos del repo) ============ */
const SEED = {
  menu_platos: [
    {id:1,codigo:'CHI-001',nombre:'Arroz Chaufa',categoria:'Platos Comunes',precio:22,disponible:'S',descripcion:'Arroz salteado al wok con cerdo, huevo, cebolla china y sillao.'},
    {id:2,codigo:'CHI-002',nombre:'Lomo Saltado',categoria:'Platos Comunes',precio:26,disponible:'S',descripcion:'Lomo fino salteado con cebolla, tomate y papas fritas.'},
    {id:3,codigo:'CHI-003',nombre:'Tallarín Saltado',categoria:'Platos Comunes',precio:23,disponible:'S',descripcion:'Fideo saltado con verduras crocantes.'},
    {id:4,codigo:'CHI-004',nombre:'Chaufa Mixto',categoria:'Platos Mixtos',precio:29,disponible:'S',descripcion:'Chaufa con pollo, carne y camarones.'},
    {id:5,codigo:'CHI-005',nombre:'Aeropuerto',categoria:'Platos Mixtos',precio:27,disponible:'S',descripcion:'Fusión de chaufa y tallarín saltado.'},
    {id:6,codigo:'CHI-006',nombre:'Kam Lu Wantán',categoria:'Platos Mixtos',precio:32,disponible:'S',descripcion:'Wantanes crocantes en salsa agridulce.'},
    {id:7,codigo:'CHI-007',nombre:'Wantán Frito',categoria:'Guarniciones',precio:12,disponible:'S',descripcion:'Seis unidades con salsa de tamarindo.'},
    {id:8,codigo:'CHI-008',nombre:'Papas Fritas',categoria:'Guarniciones',precio:9,disponible:'S',descripcion:'Corte clásico, doradas y crocantes.'},
    {id:9,codigo:'CHI-009',nombre:'Arroz Blanco',categoria:'Guarniciones',precio:6,disponible:'S',descripcion:'Porción adicional de arroz al vapor.'},
    {id:10,codigo:'CHI-010',nombre:'Duraznos en Almíbar',categoria:'Dulces',precio:8,disponible:'S',descripcion:'El cierre dulce de todo chifa limeño.'},
    {id:11,codigo:'CHI-011',nombre:'Helado de Lúcuma',categoria:'Dulces',precio:10,disponible:'S',descripcion:'Dos bolas de lúcuma con barquillo.'},
    {id:12,codigo:'CHI-012',nombre:'Alfajor Chino',categoria:'Dulces',precio:6,disponible:'S',descripcion:'Galleta rellena de manjar blanco.'},
  ],
  clientes: [
    {id:1,codigo:'C-001',nombre:'María Quispe Flores',dni:'45781236',telefono:'987 654 321',email:'maria.quispe@gmail.com',direccion:'Av. Javier Prado 1234, San Borja'},
    {id:2,codigo:'C-002',nombre:'Jorge Huamán Ríos',dni:'41230987',telefono:'945 231 876',email:'jorge.huaman@hotmail.com',direccion:'Jr. de la Unión 456, Cercado de Lima'},
    {id:3,codigo:'C-003',nombre:'Rosa Delgado Paredes',dni:'09873421',telefono:'923 445 190',email:'rosa.delgado@yahoo.es',direccion:'Av. Arequipa 2150, Lince'},
    {id:4,codigo:'C-004',nombre:'Carlos Mendoza Vera',dni:'47651209',telefono:'976 118 342',email:'carlos.mendoza@gmail.com',direccion:'Av. Benavides 789, Miraflores'},
    {id:5,codigo:'C-005',nombre:'Lucía Torres Campos',dni:'43329875',telefono:'954 667 210',email:'lucia.torres@outlook.com',direccion:'Calle Los Nardos 145, Surco'},
  ],
  empleados: [
    {id:1,codigo:'E-001',nombre:'Wilmer Chang Lau',dni:'40123456',telefono:'987 111 222',cargo:'Administrador',sueldo:2500,activo:'S'},
    {id:2,codigo:'E-002',nombre:'Daniela Pérez Rojas',dni:'45678123',telefono:'945 333 444',cargo:'Mozo',sueldo:1300,activo:'S'},
    {id:3,codigo:'E-003',nombre:'Kevin Huaman Soto',dni:'47890321',telefono:'923 555 666',cargo:'Cajero',sueldo:1400,activo:'S'},
    {id:4,codigo:'E-004',nombre:'Li Wong Tang',dni:'09871234',telefono:'976 777 888',cargo:'Cocinero',sueldo:2000,activo:'S'},
  ],
  usuarios: [
    {id:1,usuario:'admin',clave:'admin123',rol:'Empleado',empleado_id:1,cliente_id:null,activo:'S'},
    {id:2,usuario:'maria.quispe',clave:'maria123',rol:'Cliente',empleado_id:null,cliente_id:1,activo:'S'},
    {id:3,usuario:'kevin.h',clave:'caja2026',rol:'Empleado',empleado_id:3,cliente_id:null,activo:'S'},
  ],
  mesas: [
    {id:1,numero:1,capacidad:2,zona:'Salón',estado:'Libre'},
    {id:2,numero:2,capacidad:4,zona:'Salón',estado:'Ocupada'},
    {id:3,numero:3,capacidad:4,zona:'Salón',estado:'Libre'},
    {id:4,numero:4,capacidad:6,zona:'Terraza',estado:'Reservada'},
    {id:5,numero:5,capacidad:8,zona:'Privado',estado:'Libre'},
  ],
  pedidos: [
    {id:1,cliente_id:1,empleado_id:2,mesa_id:3,fecha:'2026-11-11',modalidad:'Mesa',estado:'Entregado'},
    {id:2,cliente_id:2,empleado_id:3,mesa_id:null,fecha:'2026-11-11',modalidad:'Para llevar',estado:'Entregado'},
    {id:3,cliente_id:4,empleado_id:2,mesa_id:4,fecha:'2026-11-11',modalidad:'Mesa',estado:'En cocina'},
    {id:4,cliente_id:5,empleado_id:3,mesa_id:null,fecha:'2026-11-11',modalidad:'Para llevar',estado:'Pendiente'},
  ],
  detalle_pedido: [
    {id:1,pedido_id:1,plato_id:1,cantidad:2,precio_unitario:22},
    {id:2,pedido_id:1,plato_id:7,cantidad:1,precio_unitario:12},
    {id:3,pedido_id:2,plato_id:5,cantidad:1,precio_unitario:27},
    {id:4,pedido_id:3,plato_id:4,cantidad:3,precio_unitario:29},
    {id:5,pedido_id:3,plato_id:9,cantidad:1,precio_unitario:6},
    {id:6,pedido_id:3,plato_id:8,cantidad:1,precio_unitario:9},
    {id:7,pedido_id:3,plato_id:11,cantidad:1,precio_unitario:10},
    {id:8,pedido_id:4,plato_id:3,cantidad:1,precio_unitario:23},
  ],
  pagos: [
    {id:1,pedido_id:1,metodo:'Efectivo',monto:56,fecha:'2026-11-11',estado:'Pagado'},
    {id:2,pedido_id:2,metodo:'Yape/Plin',monto:27,fecha:'2026-11-11',estado:'Pagado'},
    {id:3,pedido_id:3,metodo:'Tarjeta',monto:108,fecha:'2026-11-11',estado:'Pendiente'},
  ],
};

