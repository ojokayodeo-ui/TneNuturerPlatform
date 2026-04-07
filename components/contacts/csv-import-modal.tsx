'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, ChevronDown, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNurtureStore } from '@/lib/store';
import { Contact, ContactSource, ContactStage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CsvImportModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'upload' | 'map' | 'preview' | 'done';

const CONTACT_FIELDS: { key: keyof Contact | ''; label: string; required?: boolean }[] = [
  { key: 'name',        label: 'Full Name',     required: true },
  { key: 'email',       label: 'Email',         required: true },
  { key: 'company',     label: 'Company',       required: true },
  { key: 'phone',       label: 'Phone' },
  { key: 'website',     label: 'Website' },
  { key: 'jobTitle',    label: 'Job Title' },
  { key: 'industry',    label: 'Industry' },
  { key: 'linkedinUrl', label: 'LinkedIn URL' },
  { key: 'source',      label: 'Source' },
  { key: 'stage',       label: 'Stage' },
  { key: 'notes',       label: 'Notes' },
  { key: '',            label: '— Skip this column —' },
];

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).filter(l => l.trim()).map(parseRow);
  return { headers, rows };
}

function autoMapHeaders(headers: string[]): Record<string, keyof Contact | ''> {
  const mapping: Record<string, keyof Contact | ''> = {};
  const normalize = (s: string) => s.toLowerCase().replace(/[\s_\-\.]/g, '');

  const fieldAliases: Record<string, keyof Contact> = {
    name: 'name', fullname: 'name', firstname: 'name', contact: 'name',
    email: 'email', emailaddress: 'email',
    company: 'company', companyname: 'company', organization: 'company', account: 'company',
    phone: 'phone', phonenumber: 'phone', mobile: 'phone', telephone: 'phone',
    website: 'website', url: 'website', domain: 'website',
    jobtitle: 'jobTitle', title: 'jobTitle', role: 'jobTitle', position: 'jobTitle',
    industry: 'industry', vertical: 'industry', sector: 'industry',
    linkedin: 'linkedinUrl', linkedinurl: 'linkedinUrl', linkedinprofile: 'linkedinUrl',
    source: 'source', leadsource: 'source',
    stage: 'stage', status: 'stage', pipelinestage: 'stage',
    notes: 'notes', note: 'notes', comments: 'notes', description: 'notes',
  };

  headers.forEach(h => {
    const normalized = normalize(h);
    mapping[h] = fieldAliases[normalized] ?? '';
  });
  return mapping;
}

const VALID_SOURCES: ContactSource[] = ['cold', 'warm', 'referral', 'website', 'inbound'];
const VALID_STAGES: ContactStage[] = ['new_lead', 'contacted', 'engaged', 'nurturing', 'sales_qualified', 'client', 'retained'];

function normalizeSource(val: string): ContactSource {
  const v = val.toLowerCase().trim();
  if (VALID_SOURCES.includes(v as ContactSource)) return v as ContactSource;
  if (v.includes('referral') || v.includes('refer')) return 'referral';
  if (v.includes('warm')) return 'warm';
  if (v.includes('web') || v.includes('site') || v.includes('inbound') || v.includes('form')) return 'website';
  return 'cold';
}

function normalizeStage(val: string): ContactStage {
  const v = val.toLowerCase().replace(/[\s_\-]/g, '_').trim();
  if (VALID_STAGES.includes(v as ContactStage)) return v as ContactStage;
  if (v.includes('qualified') || v.includes('sql')) return 'sales_qualified';
  if (v.includes('client') || v.includes('customer') || v.includes('closed')) return 'client';
  if (v.includes('nurtur')) return 'nurturing';
  if (v.includes('engag')) return 'engaged';
  if (v.includes('contact')) return 'contacted';
  if (v.includes('retain') || v.includes('upsell')) return 'retained';
  return 'new_lead';
}

export function CsvImportModal({ open, onClose }: CsvImportModalProps) {
  const { addContact } = useNurtureStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('upload');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, keyof Contact | ''>>({});
  const [importedCount, setImportedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const reset = () => {
    setStep('upload');
    setFileName('');
    setHeaders([]);
    setRows([]);
    setMapping({});
    setImportedCount(0);
    setErrors([]);
  };

  const handleClose = () => { reset(); onClose(); };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a .csv file');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCsv(text);
      if (!headers.length) { alert('Could not parse CSV — make sure it has a header row.'); return; }
      setHeaders(headers);
      setRows(rows);
      setMapping(autoMapHeaders(headers));
      setStep('map');
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleImport = () => {
    const errs: string[] = [];
    let count = 0;

    rows.forEach((row, i) => {
      const getValue = (field: keyof Contact | '') => {
        if (!field) return '';
        const header = Object.keys(mapping).find(h => mapping[h] === field);
        if (!header) return '';
        const idx = headers.indexOf(header);
        return idx >= 0 ? (row[idx] ?? '').trim() : '';
      };

      const name = getValue('name');
      const email = getValue('email');
      const company = getValue('company');

      if (!name || !email || !company) {
        errs.push(`Row ${i + 2}: missing ${!name ? 'name' : !email ? 'email' : 'company'}`);
        return;
      }

      const sourceRaw = getValue('source');
      const stageRaw = getValue('stage');

      const contact: Contact = {
        id: `import_${Date.now()}_${i}`,
        name,
        email,
        company,
        phone: getValue('phone') || undefined,
        website: getValue('website') || undefined,
        jobTitle: getValue('jobTitle') || undefined,
        industry: getValue('industry') || undefined,
        linkedinUrl: getValue('linkedinUrl') || undefined,
        notes: getValue('notes') || undefined,
        source: sourceRaw ? normalizeSource(sourceRaw) : 'cold',
        stage: stageRaw ? normalizeStage(stageRaw) : 'new_lead',
        tags: [],
        engagementScore: 0,
        healthScore: 20,
        isClient: false,
        interactions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastContactedAt: new Date().toISOString(),
      };

      addContact(contact);
      count++;
    });

    setImportedCount(count);
    setErrors(errs);
    setStep('done');
  };

  const previewRows = rows.slice(0, 5);
  const mappedFields = Object.values(mapping).filter(Boolean);
  const hasRequired = mappedFields.includes('name') && mappedFields.includes('email') && mappedFields.includes('company');

  return (
    <Dialog open={open} onClose={handleClose} title="Import Contacts from CSV" size="lg">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {(['upload', 'map', 'preview', 'done'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
              step === s ? 'bg-indigo-500 text-white' :
              (['upload', 'map', 'preview', 'done'].indexOf(step) > i) ? 'bg-emerald-500 text-white' :
              'bg-[#2A2D3E] text-[#64748B]'
            )}>
              {(['upload', 'map', 'preview', 'done'].indexOf(step) > i) ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={cn('text-xs capitalize', step === s ? 'text-[#F1F5F9]' : 'text-[#64748B]')}>
              {s === 'map' ? 'Map Columns' : s === 'done' ? 'Complete' : s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 3 && <ArrowRight className="w-3 h-3 text-[#2A2D3E]" />}
          </div>
        ))}
      </div>

      {/* STEP 1: Upload */}
      {step === 'upload' && (
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
              dragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-[#2A2D3E] hover:border-indigo-500/50 hover:bg-white/[0.02]'
            )}
          >
            <Upload className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
            <p className="text-[#F1F5F9] font-medium mb-1">Drop your CSV file here</p>
            <p className="text-xs text-[#64748B]">or click to browse — .csv files only</p>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="mt-5 p-4 bg-[#0F1117] rounded-xl border border-[#2A2D3E]">
            <p className="text-xs font-semibold text-[#94A3B8] mb-2">Expected CSV columns (any order):</p>
            <div className="flex flex-wrap gap-1.5">
              {['Name *', 'Email *', 'Company *', 'Phone', 'Website', 'Job Title', 'Industry', 'LinkedIn URL', 'Source', 'Stage', 'Notes'].map(f => (
                <span key={f} className={cn(
                  'text-xs px-2 py-0.5 rounded-full border',
                  f.includes('*') ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' : 'bg-[#1A1D27] text-[#64748B] border-[#2A2D3E]'
                )}>{f}</span>
              ))}
            </div>
            <p className="text-xs text-[#64748B] mt-3">
              Exported from HubSpot, Salesforce, Apollo, Instantly, or any CRM. Column names are auto-detected.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Column Mapping */}
      {step === 'map' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#F1F5F9] font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                {fileName}
              </p>
              <p className="text-xs text-[#64748B] mt-0.5">{rows.length} rows detected · Map your columns below</p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>Change file</Button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {headers.map(header => (
              <div key={header} className="flex items-center gap-3 bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2.5">
                <span className="text-xs text-[#94A3B8] w-40 shrink-0 font-mono truncate">{header}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2A2D3E] shrink-0" />
                <select
                  value={mapping[header] ?? ''}
                  onChange={e => setMapping(prev => ({ ...prev, [header]: e.target.value as keyof Contact | '' }))}
                  className="flex-1 bg-[#1A1D27] border border-[#2A2D3E] rounded-md px-2 py-1 text-xs text-[#F1F5F9] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {CONTACT_FIELDS.map(f => (
                    <option key={f.key} value={f.key}>{f.label}{f.required ? ' *' : ''}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {!hasRequired && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Map Name, Email, and Company to continue
            </div>
          )}

          <div className="flex justify-between mt-5">
            <Button variant="ghost" size="sm" onClick={reset}>Back</Button>
            <Button size="sm" disabled={!hasRequired} onClick={() => setStep('preview')}>
              Preview Import
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview */}
      {step === 'preview' && (
        <div>
          <p className="text-sm text-[#94A3B8] mb-3">
            Previewing first {Math.min(5, rows.length)} of <span className="text-[#F1F5F9] font-medium">{rows.length}</span> contacts
          </p>
          <div className="overflow-x-auto rounded-xl border border-[#2A2D3E]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#0F1117] border-b border-[#2A2D3E]">
                  {Object.entries(mapping).filter(([,v]) => v).map(([h]) => (
                    <th key={h} className="px-3 py-2 text-left text-[#64748B] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i} className="border-b border-[#2A2D3E] last:border-0 hover:bg-white/[0.02]">
                    {headers.filter(h => mapping[h]).map(h => (
                      <td key={h} className="px-3 py-2 text-[#94A3B8] max-w-[150px] truncate">{row[headers.indexOf(h)] || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 5 && (
            <p className="text-xs text-[#64748B] mt-2">+ {rows.length - 5} more rows not shown</p>
          )}
          <div className="flex justify-between mt-5">
            <Button variant="ghost" size="sm" onClick={() => setStep('map')}>Back</Button>
            <Button size="sm" variant="gradient" onClick={handleImport}>
              Import {rows.length} Contacts
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Done */}
      {step === 'done' && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-[#F1F5F9] mb-1">Import Complete</h3>
          <p className="text-[#64748B] text-sm mb-5">
            <span className="text-emerald-400 font-semibold">{importedCount} contacts</span> imported successfully
            {errors.length > 0 && <> · <span className="text-amber-400">{errors.length} skipped</span></>}
          </p>

          {errors.length > 0 && (
            <div className="text-left bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-5 max-h-32 overflow-y-auto">
              <p className="text-xs font-semibold text-amber-400 mb-2">Skipped rows (missing required fields):</p>
              {errors.map((e, i) => <p key={i} className="text-xs text-[#64748B]">{e}</p>)}
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <Button variant="secondary" size="sm" onClick={reset}>
              <RefreshCw className="w-3.5 h-3.5" />
              Import Another
            </Button>
            <Button size="sm" onClick={handleClose}>View Contacts</Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
