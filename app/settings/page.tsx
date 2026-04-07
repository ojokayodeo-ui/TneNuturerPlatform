'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  User, Building2, Bell, Shield, Plug, Mail, Linkedin,
  Database, Globe, CheckCircle, AlertCircle, ChevronRight,
  Key, Palette, Users, CreditCard, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'profile' | 'workspace' | 'integrations' | 'notifications' | 'security' | 'billing';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',       label: 'Profile',        icon: <User className="w-4 h-4" /> },
  { id: 'workspace',     label: 'Workspace',      icon: <Building2 className="w-4 h-4" /> },
  { id: 'integrations',  label: 'Integrations',   icon: <Plug className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications',  icon: <Bell className="w-4 h-4" /> },
  { id: 'security',      label: 'Security',       icon: <Shield className="w-4 h-4" /> },
  { id: 'billing',       label: 'Billing',        icon: <CreditCard className="w-4 h-4" /> },
];

const INTEGRATIONS = [
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Send and track emails directly from the platform',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-blue-500/10 text-blue-400',
    status: 'disconnected' as const,
    category: 'Email',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Sync contacts and track LinkedIn touchpoints',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'bg-indigo-500/10 text-indigo-400',
    status: 'disconnected' as const,
    category: 'Social',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Bi-directional contact and deal sync with HubSpot CRM',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-orange-500/10 text-orange-400',
    status: 'disconnected' as const,
    category: 'CRM',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync leads, contacts, and opportunities from Salesforce',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-sky-500/10 text-sky-400',
    status: 'disconnected' as const,
    category: 'CRM',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5,000+ apps via Zapier automation',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-amber-500/10 text-amber-400',
    status: 'disconnected' as const,
    category: 'Automation',
  },
  {
    id: 'webhook',
    name: 'Webhooks',
    description: 'Send real-time events to your own endpoints',
    icon: <Key className="w-5 h-5" />,
    color: 'bg-purple-500/10 text-purple-400',
    status: 'disconnected' as const,
    category: 'Developer',
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#F1F5F9]">Settings</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Manage your account, workspace, and integrations</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-52 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                  activeTab === tab.id
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                    : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl space-y-5">

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your name, email, and profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                      AJ
                    </div>
                    <div>
                      <Button variant="secondary" size="sm">Change Avatar</Button>
                      <p className="text-xs text-[#64748B] mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input defaultValue="Alex" /></div>
                    <div><Label>Last Name</Label><Input defaultValue="Johnson" /></div>
                  </div>
                  <div><Label>Email</Label><Input defaultValue="alex@agency.com" /></div>
                  <div><Label>Job Title</Label><Input defaultValue="Agency Owner" /></div>
                  <div><Label>Phone</Label><Input placeholder="+1 (555) 000-0000" /></div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleSave} variant={saved ? 'success' : 'default'} size="sm">
                  {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> : 'Save Changes'}
                </Button>
              </div>
            </>
          )}

          {/* WORKSPACE */}
          {activeTab === 'workspace' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Workspace Details</CardTitle>
                  <CardDescription>Your agency or company information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div><Label>Workspace Name</Label><Input defaultValue="My Agency" /></div>
                  <div><Label>Website</Label><Input placeholder="https://youragency.com" /></div>
                  <div><Label>Industry</Label><Input defaultValue="Marketing Agency" /></div>
                  <div><Label>Team Size</Label>
                    <select className="flex h-9 w-full rounded-lg border border-[#2A2D3E] bg-[#0F1117] px-3 py-1 text-sm text-[#F1F5F9] mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option>1–5 people</option>
                      <option>6–20 people</option>
                      <option>21–50 people</option>
                      <option>50+ people</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage who has access to your workspace</CardDescription>
                </CardHeader>
                <CardContent>
                  {[
                    { name: 'Alex Johnson', email: 'alex@agency.com', role: 'Admin', initials: 'AJ' },
                  ].map(m => (
                    <div key={m.email} className="flex items-center justify-between py-3 border-b border-[#2A2D3E] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">{m.initials}</div>
                        <div>
                          <p className="text-sm text-[#F1F5F9] font-medium">{m.name}</p>
                          <p className="text-xs text-[#64748B]">{m.email}</p>
                        </div>
                      </div>
                      <Badge variant="default">{m.role}</Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    <Users className="w-3.5 h-3.5" /> Invite Team Member
                  </Button>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleSave} variant={saved ? 'success' : 'default'} size="sm">
                  {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> : 'Save Changes'}
                </Button>
              </div>
            </>
          )}

          {/* INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              {['Email', 'CRM', 'Social', 'Automation', 'Developer'].map(category => {
                const items = INTEGRATIONS.filter(i => i.category === category);
                if (!items.length) return null;
                return (
                  <div key={category}>
                    <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">{category}</p>
                    <Card>
                      <CardContent className="p-0 divide-y divide-[#2A2D3E]">
                        {items.map(integration => (
                          <div key={integration.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', integration.color)}>
                                {integration.icon}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#F1F5F9]">{integration.name}</p>
                                <p className="text-xs text-[#64748B]">{integration.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="flex items-center gap-1 text-xs text-[#64748B]">
                                <AlertCircle className="w-3 h-3" /> Not connected
                              </span>
                              <Button variant="outline" size="sm">Connect</Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-0 divide-y divide-[#2A2D3E]">
                {[
                  { label: 'New lead added',            desc: 'When a contact enters your pipeline',           default: true },
                  { label: 'Email replied',             desc: 'When a contact replies to a sequence email',    default: true },
                  { label: 'Sequence completed',        desc: 'When a contact finishes a nurture sequence',    default: true },
                  { label: 'AI ready-to-buy signal',    desc: 'When AI detects a high-intent lead',            default: true },
                  { label: 'Churn risk detected',       desc: 'When a client shows churn risk signals',        default: true },
                  { label: 'Check-in due',              desc: 'Reminder for scheduled client check-ins',       default: false },
                  { label: 'Weekly pipeline report',    desc: 'Summary of pipeline movement every Monday',     default: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm text-[#F1F5F9] font-medium">{item.label}</p>
                      <p className="text-xs text-[#64748B]">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Use a strong, unique password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
                  <div><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
                  <div><Label>Confirm New Password</Label><Input type="password" placeholder="••••••••" /></div>
                  <Button size="sm">Update Password</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Use API keys to connect external tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-[#0F1117] rounded-lg border border-[#2A2D3E] mb-3">
                    <div>
                      <p className="text-xs font-mono text-[#94A3B8]">sk-nurture-••••••••••••••••••••3f4a</p>
                      <p className="text-xs text-[#64748B] mt-0.5">Created Apr 7, 2026</p>
                    </div>
                    <Button variant="danger" size="sm">Revoke</Button>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Key className="w-3.5 h-3.5" /> Generate New API Key
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-[#F1F5F9]">Starter</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-sm text-[#64748B]">Up to 500 contacts · 3 sequences · 1 user</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#F1F5F9]">$0</p>
                      <p className="text-xs text-[#64748B]">/ month</p>
                    </div>
                  </div>
                  <Button variant="gradient" size="sm">Upgrade to Pro</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pro Plan</CardTitle>
                  <CardDescription>Everything you need to scale client nurturing</CardDescription>
                </CardHeader>
                <CardContent>
                  {['Unlimited contacts', 'Unlimited sequences', 'AI insights & signals', 'A/B testing', 'Team members (5)', 'Priority support', 'Outlook integration'].map(f => (
                    <div key={f} className="flex items-center gap-2 py-1.5 text-sm text-[#94A3B8]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-[#F1F5F9]">$49</span>
                    <span className="text-[#64748B] text-sm">/ month</span>
                  </div>
                  <Button variant="gradient">Upgrade to Pro</Button>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
