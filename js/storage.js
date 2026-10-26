/**
 * EL PASTILLERO - Módulo de Almacenamiento Local (IndexedDB + localStorage)
 */
const Storage = (() => {
  const LS_KEY = 'pastillero_data';

  function getAll() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : getDefault();
    } catch (e) {
      console.error('Storage read error', e);
      return getDefault();
    }
  }

  function getDefault() {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      patients: [],
      specialDates: [],
      settings: {
        theme: 'verde',
        mode: 'dark'
      }
    };
  }

  function save(data) {
    try {
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(LS_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error', e);
      return false;
    }
  }

  function exportJSON() {
    const data = getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pastillero_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.patients) throw new Error('Formato inválido: falta el campo "patients"');
      // Merge: si viene por correo, merge de datos
      const current = getAll();
      // Mantener specialDates locales si no vienen en el import
      if (!data.specialDates) data.specialDates = current.specialDates || [];
      if (!data.settings) data.settings = current.settings || getDefault().settings;
      save(data);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  return { getAll, save, exportJSON, importJSON };
})();
