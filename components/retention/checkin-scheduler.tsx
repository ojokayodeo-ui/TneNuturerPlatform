'use client';

import { useState } from 'react';
import { useNurtureStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn, generateInitials, getAvatarColor, formatFullDate } from '@/lib/utils';

type CheckinStatus = 'upcoming' | 'overdue' | 'completed';

interface ScheduledCheckin {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  scheduledDate: string;
  status: CheckinStatus;
}

const MOCK_CHECKINS: ScheduledCheckin[] = [
  {
    id: 'chk1',
    contactId: 'c5',
    contactName: 'Elena Torres',
    company: 'CloudVault AI',
    scheduledDate: '2026-04-10T10:00:00Z',
    status: 'upcoming',
  },
  {
    id: 'chk2',
    contactId: 'c7',
    contactName: 'Nadia Kovalev',
    company: 'RetentionPro',
    scheduledDate: '2026-04-08T14:00:00Z',
    status: 'upcoming',
  },
  {
    id: 'chk3',
    contactId: 'c2',
    contactName: 'James Okafor',
    company: 'BrightLabs',
    scheduledDate: '2026-03-30T09:00:00Z',
    status: 'overdue',
  },
  {
    id: 'chk4',
    contactId: 'c8',
    contactName: 'Tobias Renn',
    company: 'BlueRidge Manufacturing',
    scheduledDate: '2026-04-01T11:00:00Z',
    status: 'overdue',
  },
  {
    id: 'chk5',
    contactId: 'c1',
    contactName: 'Sarah Mitchell',
    company: 'GrowthCo',
    scheduledDate: '2026-04-05T10:00:00Z',
    status: 'completed',
  },
];

const statusConfig: Record<
  CheckinStatus,
  { label: string; borderClass: string; badgeVariant: 'success' | 'danger' | 'secondary'; icon: React.ReactNode }
> = {
  upcoming: {
    label: 'Upcoming',
    borderClass: 'border-l-2 border-l-emerald-500',
    badgeVariant: 'success',
    icon: <Clock className="w-3.5 h-3.5 text-emerald-400" />,
  },
  overdue: {
    label: 'Overdue',
    borderClass: 'border-l-2 border-l-red-500',
    badgeVariant: 'danger',
    icon: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
  },
  completed: {
    label: 'Completed',
    borderClass: 'border-l-2 border-l-slate-600',
    badgeVariant: 'secondary',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#64748B]" />,
  },
};

function CheckinRow({ checkin }: { checkin: ScheduledCheckin }) {
  const cfg = statusConfig[checkin.status];
  const initials = generateInitials(checkin.contactName);
  const avatarBg = getAvatarColor(checkin.contactName);

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 bg-[#1A1D27] hover:bg-white/[0.02] transition-colors',
        cfg.borderClass
      )}
    >
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0',
          avatarBg
        )}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[#F1F5F9] truncate">{checkin.contactName}</span>
          <span className="text-xs text-[#64748B] truncate">{checkin.company}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Calendar className="w-3 h-3 text-[#475569]" />
          <span className="text-xs text-[#64748B]">{formatFullDate(checkin.scheduledDate)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={cfg.badgeVariant} className="flex items-center gap-1">
          {cfg.icon}
          {cfg.label}
        </Badge>
        {checkin.status === 'overdue' && (
          <Button variant="danger" size="sm" className="text-xs h-7 px-3">
            Schedule Now
          </Button>
        )}
        {checkin.status === 'upcoming' && (
          <Button variant="outline" size="sm" className="text-xs h-7 px-3">
            Prepare Notes
          </Button>
        )}
      </div>
    </div>
  );
}

export default function CheckinScheduler() {
  const contacts = useNurtureStore((s) => s.contacts);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-[#2A2D3E]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Check-in Schedule</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {MOCK_CHECKINS.filter((c) => c.status === 'overdue').length} overdue ·{' '}
              {MOCK_CHECKINS.filter((c) => c.status === 'upcoming').length} upcoming
            </p>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          className="text-xs h-8"
          onClick={() => setModalOpen(true)}
        >
          Schedule Check-in
        </Button>
      </div>

      <div className="divide-y divide-[#2A2D3E]">
        {MOCK_CHECKINS.map((checkin) => (
          <CheckinRow key={checkin.id} checkin={checkin} />
        ))}
      </div>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule a Check-in"
        description="Pick a contact and a date to schedule your next check-in."
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Contact</label>
            <Select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
            >
              <option value="">Select a contact…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Confirm
            </Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
