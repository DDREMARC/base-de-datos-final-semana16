/* ============ ESQUEMA (campos por tabla) ============ */
const fk = (t, label) => ({type:'fk', ref:t, label});
const SCHEMA = {
  menu_platos:{titulo:'Carta', sql:'menu_platos', f:[
    {k:'codigo',l:'Código',req:1},{k:'nombre',l:'Nombre',req:1},
    {k:'categoria',l:'Categoría',type:'sel',op:['Platos Comunes','Platos Mixtos','Sopas','Guarniciones','Dulces'],req:1},
    {k:'precio',l:'Precio (S/)',type:'num',req:1,min:0.01},
    {k:'disponible',l:'Disponible',type:'sel',op:['S','N'],pill:{S:'ok',N:'no'}},
    {k:'descripcion',l:'Descripción',type:'txt',hide:1}]},
  clientes:{titulo:'Clientes', sql:'clientes', f:[
    {k:'codigo',l:'Código',req:1},{k:'nombre',l:'Nombre',req:1},{k:'dni',l:'DNI',req:1,pat:/^\d{8}$/,msg:'DNI: 8 dígitos'},
    {k:'telefono',l:'Teléfono',req:1},{k:'email',l:'Correo'},{k:'direccion',l:'Dirección',req:1,hide:1}]},
  usuarios:{titulo:'Usuarios', sql:'usuarios', f:[
    {k:'usuario',l:'Usuario',req:1},{k:'clave',l:'Contraseña',req:1,type:'pass'},
    {k:'rol',l:'Rol',type:'sel',op:['Cliente','Empleado'],req:1},
    {k:'cliente_id',l:'Cliente',...fk('clientes','nombre')},{k:'empleado_id',l:'Empleado',...fk('empleados','nombre')},
    {k:'activo',l:'Activo',type:'sel',op:['S','N'],pill:{S:'ok',N:'no'}}]},
  empleados:{titulo:'Empleados', sql:'empleados', f:[
    {k:'codigo',l:'Código',req:1},{k:'nombre',l:'Nombre',req:1},{k:'dni',l:'DNI',req:1,pat:/^\d{8}$/,msg:'DNI: 8 dígitos'},
    {k:'telefono',l:'Teléfono',req:1},{k:'cargo',l:'Cargo',type:'sel',op:['Cocinero','Mozo','Cajero','Administrador'],req:1},
    {k:'sueldo',l:'Sueldo (S/)',type:'num',req:1,min:1},{k:'activo',l:'Activo',type:'sel',op:['S','N'],pill:{S:'ok',N:'no'}}]},
  mesas:{titulo:'Mesas', sql:'mesas', f:[
    {k:'numero',l:'Número',type:'num',req:1,min:1},{k:'capacidad',l:'Capacidad',type:'num',req:1,min:1},
    {k:'zona',l:'Zona',type:'sel',op:['Salón','Terraza','Privado'],req:1},
    {k:'estado',l:'Estado',type:'sel',op:['Libre','Ocupada','Reservada'],pill:{Libre:'ok',Ocupada:'no',Reservada:''}}]},
  pedidos:{titulo:'Pedidos', sql:'pedidos', f:[
    {k:'cliente_id',l:'Cliente',...fk('clientes','nombre'),req:1},{k:'empleado_id',l:'Atendió',...fk('empleados','nombre'),req:1},
    {k:'mesa_id',l:'Mesa',...fk('mesas','numero')},{k:'fecha',l:'Fecha',type:'date',req:1},
    {k:'modalidad',l:'Modalidad',type:'sel',op:['Mesa','Para llevar','Delivery'],req:1},
    {k:'estado',l:'Estado',type:'sel',op:['Pendiente','En cocina','Entregado','Cancelado'],pill:{Entregado:'ok',Cancelado:'no'}},
    {k:'_total',l:'Total',calc:r=>'S/ '+total(r.id).toFixed(2)}]},
  detalle_pedido:{titulo:'Detalle', sql:'detalle_pedido', f:[
    {k:'pedido_id',l:'Pedido',...fk('pedidos','id'),req:1},{k:'plato_id',l:'Plato',...fk('menu_platos','nombre'),req:1},
    {k:'cantidad',l:'Cantidad',type:'num',req:1,min:1},{k:'precio_unitario',l:'P. unit.',type:'num',req:1,min:0.01},
    {k:'_sub',l:'Subtotal',calc:r=>'S/ '+(r.cantidad*r.precio_unitario).toFixed(2)}]},
  pagos:{titulo:'Pagos', sql:'pagos', f:[
    {k:'pedido_id',l:'Pedido',...fk('pedidos','id'),req:1},
    {k:'metodo',l:'Método',type:'sel',op:['Efectivo','Tarjeta','Yape/Plin'],req:1},
    {k:'monto',l:'Monto (S/)',type:'num',req:1,min:0.01},{k:'fecha',l:'Fecha',type:'date',req:1},
    {k:'estado',l:'Estado',type:'sel',op:['Pagado','Pendiente','Anulado'],pill:{Pagado:'ok',Anulado:'no'}}]},
  v_resumen_dia:{titulo:'Resumen día', vista:1},
  _sql:{titulo:'SQL Oracle', sqlLog:1},
};
const total = pid => api.list('detalle_pedido').filter(d=>d.pedido_id==pid).reduce((s,d)=>s+d.cantidad*d.precio_unitario,0);
const fkLabel = (f,v) => { if(v==null||v==='') return '—'; const r=api.get(f.ref,v); return r ? (f.ref==='pedidos' ? '#'+r.id : f.ref==='mesas' ? 'Mesa '+r.numero : r[f.label]) : '?'; };

/* ============ ESTADO Y RENDER ============ */
const S = { user:null, tab:'menu_platos', edit:null, q:'' };
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('ver'); setTimeout(()=>t.classList.remove('ver'),1800); }

function render(){
  if(!S.user) return renderLogin();
  const tabs = Object.keys(SCHEMA).map(k=>k==='_sql'?`<button class="tab ${S.tab===k?'on':''}" style="margin-left:auto" onclick="go('${k}')">SQL Oracle (${api.log.length})</button>`:`<button class="tab ${S.tab===k?'on':''}" onclick="go('${k}')">${SCHEMA[k].titulo}</button>`).join('');
  const sc = SCHEMA[S.tab];
  $('#app').innerHTML = `
  <header><div class="logo">TS</div><h1>El Tío Sam Chifa<small>Panel de administración</small></h1>
    <div class="der"><span class="pill ${USAR_ORACLE?'ok':''}">${USAR_ORACLE?'Oracle':'Navegador'}</span><span>${esc(S.user.usuario)} · ${S.user.rol}</span>
      <button class="btn g xs" onclick="reiniciar()">${USAR_ORACLE?'Recargar de Oracle':'Reiniciar datos'}</button>
      <button class="btn s xs" style="background:transparent;color:#fff;border-color:#fff" onclick="S.user=null;render()">Salir</button></div></header>
  <div class="tabs">${tabs}</div>
  <main>${sc.vista ? renderVista() : sc.sqlLog ? renderSql() : renderTabla(sc)}</main>`;
}

function renderSql(){
  const txt = api.log.length ? api.log.join('\n\n') : '-- Aún no hay cambios. Agrega, edita o borra algo en otra pestaña.';
  return `<div class="card" style="grid-column:1/-1"><h2>SQL generado para Oracle <code>${api.log.length} sentencias</code></h2>
    <div class="herr"><button class="btn p" onclick="navigator.clipboard.writeText(document.getElementById('sqlbox').value).then(()=>toast('Copiado'))">Copiar todo</button>
      <button class="btn g" onclick="api.log=[];api.save();render()">Limpiar</button>
      <span style="font-size:12px;color:var(--gris)">Pégalo en SQL Developer y ejecuta con COMMIT al final.</span></div>
    <textarea id="sqlbox" readonly style="height:420px;font-family:Consolas,monospace;font-size:13px;border:0;border-radius:0;padding:16px;background:#1F1A17;color:#F5E9C9">${esc(txt)}\n\nCOMMIT;</textarea></div>`;
}

function renderTabla(sc){
  const t=S.tab, rows=api.list(t).filter(r=>!S.q || JSON.stringify(r).toLowerCase().includes(S.q.toLowerCase()));
  const cols = sc.f.filter(f=>!f.hide);
  const celda=(f,r)=>{ if(f.calc) return f.calc(r); let v=r[f.k]; if(f.type==='fk') return fkLabel(f,v); if(f.type==='pass') return '••••••';
    if(f.type==='num'&&(f.k==='precio'||f.k==='sueldo'||f.k==='monto'||f.k==='precio_unitario')) return 'S/ '+Number(v).toFixed(2);
    if(f.pill) return `<span class="pill ${f.pill[v]||''}">${esc(v)}</span>`; return esc(v); };
  const tabla = rows.length ? `<table><thead><tr><th>ID</th>${cols.map(f=>`<th>${f.l}</th>`).join('')}<th></th></tr></thead><tbody>
    ${rows.map(r=>`<tr class="${S.edit==r.id?'sel':''}"><td>${r.id}</td>${cols.map(f=>`<td>${celda(f,r)}</td>`).join('')}
      <td><div class="acc"><button class="btn s xs" onclick="editar(${r.id})">Editar</button><button class="btn d xs" onclick="borrar(${r.id})">Borrar</button></div></td></tr>`).join('')}
    </tbody></table>` : `<div class="vacio">Sin registros</div>`;
  const edit = S.edit ? api.get(t,S.edit) : {};
  const campo=f=>{ if(f.calc) return ''; const v=edit[f.k]??''; let inp;
    if(f.type==='sel') inp=`<select name="${f.k}">${f.op.map(o=>`<option ${o===v?'selected':''}>${o}</option>`).join('')}</select>`;
    else if(f.type==='fk') inp=`<select name="${f.k}"><option value="">—</option>${api.list(f.ref).map(r=>`<option value="${r.id}" ${r.id==v?'selected':''}>${esc(fkLabel(f,r.id))}</option>`).join('')}</select>`;
    else if(f.type==='txt') inp=`<textarea name="${f.k}">${esc(v)}</textarea>`;
    else inp=`<input name="${f.k}" type="${f.type==='num'?'number':f.type==='date'?'date':f.type==='pass'?'password':'text'}" ${f.type==='num'?'step="0.01"':''} value="${esc(v)}" ${f.req?'required':''}>`;
    return `<div><label>${f.l}${f.req?' *':''}</label>${inp}</div>`; };
  return `
  <div class="card"><h2>${sc.titulo} <code>${sc.sql} · ${rows.length} filas</code></h2>
    <div class="herr"><input placeholder="Buscar…" value="${esc(S.q)}" oninput="S.q=this.value;render();this.focus();this.setSelectionRange(99,99)">
      <button class="btn p" onclick="S.edit=null;render()">+ Nuevo</button></div><div class="scroll">${tabla}</div></div>
  <div class="card"><h2>${S.edit?'Editar #'+S.edit:'Nuevo registro'}</h2>
    <form onsubmit="guardar(event)">${sc.f.map(campo).join('')}
      <div class="fila-btn"><button class="btn p" type="submit">${S.edit?'Guardar cambios':'Agregar'}</button>
      ${S.edit?`<button class="btn g" type="button" onclick="S.edit=null;render()">Cancelar</button>`:''}</div>
      <div class="nota">Guarda en el navegador y genera el <b>INSERT / UPDATE / DELETE</b> de Oracle en la pestaña <b>SQL Oracle</b>.</div>
    </form></div>`;
}

function renderVista(){
  const ped=api.list('pedidos'), pag=api.list('pagos');
  const grupo=(arr,k,fn)=>{ const m={}; arr.forEach(r=>{ const g=r[k]; m[g]=m[g]||{n:0,s:0}; m[g].n++; m[g].s+=fn(r); }); return m; };
  const porMod = grupo(ped,'modalidad',r=>total(r.id)), porPago = grupo(pag.filter(p=>p.estado==='Pagado'),'metodo',r=>r.monto);
  const fila=(cat,m)=>Object.entries(m).map(([k,v])=>`<tr><td>${cat}</td><td>${k}</td><td>${v.n}</td><td>S/ ${v.s.toFixed(2)}</td></tr>`).join('');
  const rec = ped.reduce((s,r)=>s+total(r.id),0);
  return `<div class="card" style="grid-column:1/-1"><h2>Resumen del día <code>vista v_resumen_dia (calculada)</code></h2>
    <div class="kpis"><div class="kpi"><b>${ped.length}</b><span>pedidos</span></div><div class="kpi"><b>S/ ${rec.toFixed(2)}</b><span>vendido</span></div>
      <div class="kpi"><b>${api.list('mesas').filter(m=>m.estado==='Ocupada').length}/${api.list('mesas').length}</b><span>mesas ocupadas</span></div></div>
    <table><thead><tr><th>Categoría</th><th>Concepto</th><th>Cantidad</th><th>Recaudado</th></tr></thead><tbody>
      ${fila('MODALIDAD',porMod)}${fila('METODO_PAGO',porPago)}</tbody></table>
    <div style="padding:16px"><div class="nota">En Oracle esta vista sale de <b>pedidos + detalle_pedido + pagos</b> con GROUP BY. Aquí se calcula en JS.</div></div></div>`;
}

function renderLogin(){
  $('#app').innerHTML = `<div class="login"><form class="caja" onsubmit="login(event)">
    <div class="logo">TS</div><h2>El Tío Sam Chifa</h2><p>Panel de administración · tabla <b>usuarios</b></p>
    <div><label>Usuario</label><input name="u" value="admin" required></div>
    <div><label>Contraseña</label><input name="c" type="password" value="admin123" required></div>
    <div class="err" id="err"></div>
    <button class="btn p" style="height:44px">Iniciar sesión</button>
    <div class="nota">Prueba: admin / admin123 · kevin.h / caja2026</div></form></div>`;
}

/* ============ ACCIONES ============ */
function go(t){ S.tab=t; S.edit=null; S.q=''; render(); }
function editar(id){ S.edit=id; render(); }
async function reiniciar(){
  if(!USAR_ORACLE && !confirm('¿Volver a los datos iniciales?')) return;
  try{ await api.reset(); render(); toast(USAR_ORACLE?'Datos recargados':'Datos reiniciados'); }catch(err){ toast(err.message); }
}
async function borrar(id){
  const t=S.tab, deps={clientes:['pedidos','cliente_id'],empleados:['pedidos','empleado_id'],mesas:['pedidos','mesa_id'],
    menu_platos:['detalle_pedido','plato_id'],pedidos:['detalle_pedido','pedido_id']}[t];
  if(deps && api.list(deps[0]).some(r=>r[deps[1]]==id)) return toast(`No se puede: ${deps[0]} usa este registro (FK)`);
  if(!confirm('¿Borrar registro #'+id+'?')) return;
  try{ await api.remove(t,id); }catch(err){ return toast(err.message); }
  if(S.edit==id) S.edit=null; render(); toast('Borrado');
}
async function guardar(e){
  e.preventDefault(); const t=S.tab, sc=SCHEMA[t], fd=new FormData(e.target), row={};
  for(const f of sc.f){ if(f.calc) continue; let v=fd.get(f.k);
    if(f.type==='num') v = v===''?null:Number(v); else if(f.type==='fk') v = v===''?null:Number(v);
    if(f.req && (v===null||v==='')) return toast(f.l+' es obligatorio');
    if(f.min!=null && v!==null && v<f.min) return toast(f.l+' debe ser mayor a '+(f.min-0.01).toFixed(2));
    if(f.pat && !f.pat.test(v)) return toast(f.msg);
    row[f.k]=v; }
  const uniq={menu_platos:'codigo',clientes:'dni',empleados:'dni',usuarios:'usuario',mesas:'numero'}[t];
  if(uniq && api.list(t).some(r=>r[uniq]==row[uniq] && r.id!=S.edit)) return toast(uniq+' ya existe (UNIQUE)');
  if(t==='detalle_pedido' && !S.edit){ const p=api.get('menu_platos',row.plato_id); if(p && !fd.get('precio_unitario')) row.precio_unitario=p.precio; }
  try{
    if(S.edit){ await api.update(t,S.edit,row); toast('Actualizado #'+S.edit); S.edit=null; }
    else { const r=await api.insert(t,row); toast('Agregado #'+r.id); }
  }catch(err){ return toast(err.message); }
  render();
}
async function login(e){
  e.preventDefault(); const fd=new FormData(e.target);
  try{ S.user = await api.login(fd.get('u'), fd.get('c')); }
  catch(err){ $('#err').textContent = err.message; return; }
  render(); toast('Bienvenido, '+S.user.usuario);
}

api.load().then(render).catch(err=>{
  $('#app').innerHTML = `<div class="login"><div class="caja"><h2>Sin conexión</h2><p>${esc(err.message)}</p>
    <div class="nota">Revisa que Apache esté prendido, que oci8 esté habilitado y los datos de <b>api/conexion.php</b>.</div></div></div>`;
});
