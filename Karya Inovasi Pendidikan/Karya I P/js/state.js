/* ============================================================================
   STATE - status global, undo/redo, penyimpanan otomatis (localStorage)
   ============================================================================ */
'use strict';
window.DTS_STATE = (function () {
  const KEY = 'dts_sim_v2';
  let st = null;
  const listeners = {};
  let undoStack = [], redoStack = [];
  let idc = 1;

  function defaults() {
    return {
      doc: {
        elements: [], instruments: [],
        grid: true, snap: true, showInst: true,
        info: { nama: '', kelas: '', sekolah: '', judul: 'Latihan Menggambar', no: '01', skala: '1 : 1', satuan: 'mm', tanggal: '', diperiksa: '', disetujui: '', keterangan: '' }
      },
      view: { scale: 2, ox: 0, oy: 0 },
      tool: 'select',
      props: { lineWidth: 'thick', lineType: 'solid', pencil: 'HB', angleStep: 15, eraserMode: 'partial', eraserSize: 3, centerLines: true, textSize: 5 },
      selection: null,      // id elemen
      activeInst: null,     // id instrumen
      task: null            // id latihan aktif
    };
  }

  function load() {
    st = defaults();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.doc) {
          Object.assign(st.doc, d.doc);
          st.doc.info = Object.assign(defaults().doc.info, d.doc.info || {});
          if (!Array.isArray(st.doc.elements)) st.doc.elements = [];
          if (!Array.isArray(st.doc.instruments)) st.doc.instruments = [];
        }
        if (d && d.props) Object.assign(st.props, d.props);
        if (d && typeof d.task === 'string') st.task = d.task;
      }
    } catch (e) { /* data rusak: mulai baru */ }
    // id lanjutan
    for (const x of st.doc.elements.concat(st.doc.instruments)) {
      const n = parseInt(String(x.id).slice(1), 10);
      if (n >= idc) idc = n + 1;
    }
  }
  function s() { if (!st) load(); return st; }

  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify({ doc: st.doc, props: st.props, task: st.task })); } catch (e) { /* abaikan */ }
    }, 250);
  }

  function on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); }
  function emit(evt, arg) {
    (listeners[evt] || []).forEach(fn => { try { fn(arg); } catch (e) { console.error(e); } });
  }
  /** beri tahu perubahan dokumen (render ulang + simpan) */
  function changed() { save(); emit('change'); }

  /* ---------- riwayat ---------- */
  function snapshot() { return JSON.stringify({ e: s().doc.elements, i: s().doc.instruments }); }
  function pushHistory() {
    undoStack.push(snapshot());
    if (undoStack.length > 100) undoStack.shift();
    redoStack = [];
    emit('history');
  }
  function dropHistory() { undoStack.pop(); emit('history'); }
  function restore(snap) {
    const d = JSON.parse(snap);
    s().doc.elements = d.e; s().doc.instruments = d.i;
    if (!getElement(s().selection)) s().selection = null;
    if (!getInstrument(s().activeInst)) s().activeInst = null;
  }
  function undo() {
    if (!undoStack.length) return false;
    redoStack.push(snapshot()); restore(undoStack.pop());
    emit('history'); emit('selection'); changed(); return true;
  }
  function redo() {
    if (!redoStack.length) return false;
    undoStack.push(snapshot()); restore(redoStack.pop());
    emit('history'); emit('selection'); changed(); return true;
  }
  const canUndo = () => undoStack.length > 0;
  const canRedo = () => redoStack.length > 0;

  /* ---------- elemen ---------- */
  function addElement(el) { el.id = 'e' + (idc++); s().doc.elements.push(el); return el; }
  function removeElement(id) { const a = s().doc.elements, i = a.findIndex(e => e.id === id); if (i >= 0) a.splice(i, 1); }
  function getElement(id) { return id ? s().doc.elements.find(e => e.id === id) || null : null; }
  function setSelection(id) { s().selection = id; emit('selection'); emit('change'); }

  /* ---------- instrumen ---------- */
  function addInstrument(inst) { inst.id = 'i' + (idc++); s().doc.instruments.push(inst); return inst; }
  function getInstrument(id) { return id ? s().doc.instruments.find(i => i.id === id) || null : null; }
  function instrumentOf(kind) { return s().doc.instruments.find(i => i.kind === kind) || null; }
  function removeInstrument(id) { const a = s().doc.instruments, i = a.findIndex(x => x.id === id); if (i >= 0) a.splice(i, 1); if (s().activeInst === id) s().activeInst = null; }

  return {
    s, load, save, on, emit, changed,
    pushHistory, dropHistory, undo, redo, canUndo, canRedo,
    addElement, removeElement, getElement, setSelection,
    addInstrument, getInstrument, instrumentOf, removeInstrument
  };
})();
