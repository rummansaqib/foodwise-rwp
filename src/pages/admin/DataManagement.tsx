import { useRef, ChangeEvent } from 'react';
import { RotateCcw, Download, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DataManagement() {
  const { resetDemoData, exportData, importData, showToast, refreshCatalog } = useApp();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodwise-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported.');
  };

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importData(String(reader.result));
      if (result.success) {
        refreshCatalog();
        showToast('Data imported successfully.');
      } else {
        showToast(result.error || 'Import failed.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto pb-20 md:pb-8">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-1">Data Management</h1>
      <p className="text-charcoal/50 text-sm mb-6">Manage the demo dataset stored in this browser's local storage.</p>

      <div className="grid sm:grid-cols-3 gap-4">
        <button onClick={resetDemoData} className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-5 flex flex-col items-center gap-2 hover:shadow-lift transition-shadow">
          <RotateCcw className="w-5 h-5 text-emerald-700" />
          <span className="text-sm font-medium text-charcoal">Reset Demo Data</span>
        </button>
        <button onClick={handleExport} className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-5 flex flex-col items-center gap-2 hover:shadow-lift transition-shadow">
          <Download className="w-5 h-5 text-emerald-700" />
          <span className="text-sm font-medium text-charcoal">Export Data</span>
        </button>
        <button onClick={() => fileInput.current?.click()} className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-5 flex flex-col items-center gap-2 hover:shadow-lift transition-shadow">
          <Upload className="w-5 h-5 text-emerald-700" />
          <span className="text-sm font-medium text-charcoal">Import Data</span>
        </button>
        <input ref={fileInput} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
      </div>

      <p className="text-xs text-charcoal/40 mt-6">
        This prototype uses demonstration restaurant and menu data. A production version would populate the
        platform through permitted data sources, restaurant submissions, licensed APIs/datasets, and administrator
        verification.
      </p>
    </div>
  );
}
