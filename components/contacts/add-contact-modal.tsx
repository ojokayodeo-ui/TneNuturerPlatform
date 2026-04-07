'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNurtureStore } from '@/lib/store';
import { Contact, ContactSource, ContactStage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  contact?: Contact;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  website: string;
  phone: string;
  source: ContactSource;
  industry: string;
  jobTitle: string;
  linkedinUrl: string;
  stage: ContactStage;
  tags: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
}

const defaultFormData: FormData = {
  name: '',
  email: '',
  company: '',
  website: '',
  phone: '',
  source: 'cold',
  industry: '',
  jobTitle: '',
  linkedinUrl: '',
  stage: 'new_lead',
  tags: '',
  notes: '',
};

function LabeledField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#94A3B8]">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function AddContactModal({ open, onClose, contact }: AddContactModalProps) {
  const { addContact, updateContact } = useNurtureStore();
  const isEdit = !!contact;

  const [form, setForm] = useState<FormData>(defaultFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (contact) {
        setForm({
          name: contact.name,
          email: contact.email,
          company: contact.company,
          website: contact.website ?? '',
          phone: contact.phone ?? '',
          source: contact.source,
          industry: contact.industry ?? '',
          jobTitle: contact.jobTitle ?? '',
          linkedinUrl: contact.linkedinUrl ?? '',
          stage: contact.stage,
          tags: contact.tags.join(', '),
          notes: contact.notes ?? '',
        });
      } else {
        setForm(defaultFormData);
      }
      setErrors({});
    }
  }, [open, contact]);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.company.trim()) newErrors.company = 'Company is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    setSaving(true);

    const parsedTags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const now = new Date().toISOString();

    if (isEdit && contact) {
      updateContact(contact.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        website: form.website.trim() || undefined,
        phone: form.phone.trim() || undefined,
        source: form.source,
        industry: form.industry.trim() || undefined,
        jobTitle: form.jobTitle.trim() || undefined,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        stage: form.stage,
        tags: parsedTags,
        notes: form.notes.trim() || undefined,
        updatedAt: now,
      });
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        website: form.website.trim() || undefined,
        phone: form.phone.trim() || undefined,
        source: form.source,
        industry: form.industry.trim() || undefined,
        jobTitle: form.jobTitle.trim() || undefined,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        stage: form.stage,
        tags: parsedTags,
        notes: form.notes.trim() || undefined,
        engagementScore: 0,
        healthScore: 0,
        lastContactedAt: now,
        createdAt: now,
        updatedAt: now,
        interactions: [],
        isClient: false,
      };
      addContact(newContact);
    }

    setSaving(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Contact' : 'Add New Contact'}
      description={isEdit ? 'Update contact information.' : 'Fill in the details to create a new contact.'}
      size="lg"
    >
      <div className="space-y-5">
        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-2 gap-4">
          <LabeledField label="Full Name" required error={errors.name}>
            <Input
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={cn(errors.name && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50')}
            />
          </LabeledField>
          <LabeledField label="Email Address" required error={errors.email}>
            <Input
              type="email"
              placeholder="jane@company.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={cn(errors.email && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50')}
            />
          </LabeledField>
        </div>

        {/* Row 2: Company + Website */}
        <div className="grid grid-cols-2 gap-4">
          <LabeledField label="Company" required error={errors.company}>
            <Input
              placeholder="Acme Corp"
              value={form.company}
              onChange={(e) => set('company', e.target.value)}
              className={cn(errors.company && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50')}
            />
          </LabeledField>
          <LabeledField label="Website">
            <Input
              placeholder="https://acme.com"
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
            />
          </LabeledField>
        </div>

        {/* Row 3: Phone + Source */}
        <div className="grid grid-cols-2 gap-4">
          <LabeledField label="Phone">
            <Input
              type="tel"
              placeholder="+1 555 000 0000"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </LabeledField>
          <LabeledField label="Source">
            <Select
              value={form.source}
              onChange={(e) => set('source', e.target.value)}
            >
              <option value="cold">Cold Outreach</option>
              <option value="warm">Warm Lead</option>
              <option value="referral">Referral</option>
              <option value="website">Website</option>
              <option value="inbound">Inbound</option>
            </Select>
          </LabeledField>
        </div>

        {/* Row 4: Industry + Job Title */}
        <div className="grid grid-cols-2 gap-4">
          <LabeledField label="Industry">
            <Input
              placeholder="SaaS, Finance, Healthcare..."
              value={form.industry}
              onChange={(e) => set('industry', e.target.value)}
            />
          </LabeledField>
          <LabeledField label="Job Title">
            <Input
              placeholder="CEO, VP of Sales..."
              value={form.jobTitle}
              onChange={(e) => set('jobTitle', e.target.value)}
            />
          </LabeledField>
        </div>

        {/* Row 5: LinkedIn + Stage */}
        <div className="grid grid-cols-2 gap-4">
          <LabeledField label="LinkedIn URL">
            <Input
              placeholder="https://linkedin.com/in/..."
              value={form.linkedinUrl}
              onChange={(e) => set('linkedinUrl', e.target.value)}
            />
          </LabeledField>
          <LabeledField label="Stage">
            <Select
              value={form.stage}
              onChange={(e) => set('stage', e.target.value)}
            >
              <option value="new_lead">New Lead</option>
              <option value="contacted">Contacted</option>
              <option value="engaged">Engaged</option>
              <option value="nurturing">Nurturing</option>
              <option value="sales_qualified">Sales Qualified</option>
              <option value="client">Client</option>
              <option value="retained">Retained</option>
            </Select>
          </LabeledField>
        </div>

        {/* Tags */}
        <LabeledField label="Tags">
          <Input
            placeholder="enterprise, high-value, decision-maker (comma-separated)"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
          />
        </LabeledField>

        {/* Notes */}
        <LabeledField label="Notes">
          <Textarea
            placeholder="Any relevant notes about this contact..."
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="min-h-[80px]"
          />
        </LabeledField>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2A2D3E]">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Contact'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
