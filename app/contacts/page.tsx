'use client';

import { useState } from 'react';
import { Search, Plus, Upload } from 'lucide-react';
import AppShell from '@/components/layout/app-shell';
import { ContactsTable } from '@/components/contacts/contacts-table';
import { ContactFilters } from '@/components/contacts/contact-filters';
import { AddContactModal } from '@/components/contacts/add-contact-modal';
import { CsvImportModal } from '@/components/contacts/csv-import-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNurtureStore } from '@/lib/store';

export default function ContactsPage() {
  const { contacts, searchQuery, setSearchQuery } = useNurtureStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex flex-col gap-5 h-full">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#F1F5F9]">Contacts</h1>
            <span className="inline-flex items-center rounded-full bg-[#2A2D3E] px-2.5 py-0.5 text-xs font-semibold text-[#94A3B8]">
              {contacts.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCsvModalOpen(true)}
              className="gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Import CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <Input
            placeholder="Search by name, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Main layout: sidebar + table */}
        <div className="flex flex-1 gap-5 min-h-0">
          {/* Filter sidebar */}
          <div className="w-64 shrink-0">
            <ContactFilters />
          </div>

          {/* Table area */}
          <div className="flex-1 min-w-0">
            <ContactsTable />
          </div>
        </div>
      </div>

      <AddContactModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <CsvImportModal open={csvModalOpen} onClose={() => setCsvModalOpen(false)} />
    </AppShell>
  );
}
