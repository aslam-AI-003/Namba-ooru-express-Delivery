'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Mock data for the AI Call Center dashboard
const MOCK_STATS = {
  totalCalls: 156,
  successfulOrders: 98,
  escalatedCalls: 23,
  abandonedCalls: 12,
  avgHandleTime: '2:45',
  avgConfidence: 84,
  successRate: 62.8,
  escalationRate: 14.7,
  activeCalls: 3,
};

const MOCK_CALLS = [
  {
    id: 'vc_001',
    callerPhone: '+91 98765 43210',
    customerName: 'Murugan K',
    startTime: '12:15 PM',
    duration: '3:22',
    outcome: 'order_created',
    confidence: 92,
    language: 'ta',
    shopName: 'Fresh Mart',
    orderId: 'NOE-156',
    orderTotal: 450,
  },
  {
    id: 'vc_002',
    callerPhone: '+91 87654 32109',
    customerName: null,
    startTime: '12:08 PM',
    duration: '1:45',
    outcome: 'escalated_to_human',
    confidence: 45,
    language: 'tanglish',
    shopName: null,
    orderId: null,
    orderTotal: null,
  },
  {
    id: 'vc_003',
    callerPhone: '+91 76543 21098',
    customerName: 'Lakshmi V',
    startTime: '11:52 AM',
    duration: '4:10',
    outcome: 'order_created',
    confidence: 88,
    language: 'ta',
    shopName: 'Murugan Stores',
    orderId: 'NOE-155',
    orderTotal: 680,
  },
  {
    id: 'vc_004',
    callerPhone: '+91 65432 10987',
    customerName: null,
    startTime: '11:40 AM',
    duration: '0:35',
    outcome: 'abandoned',
    confidence: 0,
    language: 'ta',
    shopName: null,
    orderId: null,
    orderTotal: null,
  },
  {
    id: 'vc_005',
    callerPhone: '+91 98765 11111',
    customerName: 'Rajesh S',
    startTime: '11:30 AM',
    duration: '2:58',
    outcome: 'order_created',
    confidence: 95,
    language: 'en',
    shopName: 'MedPlus Pharmacy',
    orderId: 'NOE-154',
    orderTotal: 320,
  },
  {
    id: 'vc_006',
    callerPhone: '+91 87654 22222',
    customerName: 'Priya M',
    startTime: '11:15 AM',
    duration: '3:45',
    outcome: 'order_created',
    confidence: 78,
    language: 'tanglish',
    shopName: 'Sri Krishna Sweets',
    orderId: 'NOE-153',
    orderTotal: 550,
  },
];

const MOCK_LIVE_CALLS = [
  { id: 'live_1', phone: '+91 99887 76655', duration: '1:23', status: 'AI processing', language: 'ta' },
  { id: 'live_2', phone: '+91 88776 65544', duration: '0:45', status: 'Clarifying item', language: 'tanglish' },
  { id: 'live_3', phone: '+91 77665 54433', duration: '2:10', status: 'Confirming order', language: 'ta' },
];

const MOCK_ESCALATIONS = [
  { id: 'esc_1', phone: '+91 87654 32109', reason: 'Low confidence - unclear speech', time: '12:08 PM', status: 'queued', agentName: null },
  { id: 'esc_2', phone: '+91 55443 32211', reason: 'Customer requested human', time: '10:30 AM', status: 'resolved', agentName: 'Admin' },
  { id: 'esc_3', phone: '+91 44332 21100', reason: 'Complaint - not an order', time: '09:45 AM', status: 'resolved', agentName: 'Admin' },
];

const PEAK_HOURS = [
  { hour: '6AM', calls: 5 }, { hour: '7AM', calls: 12 }, { hour: '8AM', calls: 18 },
  { hour: '9AM', calls: 22 }, { hour: '10AM', calls: 28 }, { hour: '11AM', calls: 25 },
  { hour: '12PM', calls: 20 }, { hour: '1PM', calls: 15 }, { hour: '2PM', calls: 10 },
  { hour: '3PM', calls: 8 }, { hour: '4PM', calls: 12 }, { hour: '5PM', calls: 18 },
  { hour: '6PM', calls: 30 }, { hour: '7PM', calls: 35 }, { hour: '8PM', calls: 28 },
  { hour: '9PM', calls: 15 },
];

export default function VoiceCallsAdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'calls' | 'escalations' | 'config'>('overview');
  const [selectedCall, setSelectedCall] = useState<string | null>(null);

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'order_created': return <Badge variant="success">✅ Order Created</Badge>;
      case 'escalated_to_human': return <Badge variant="warning">🙋 Escalated</Badge>;
      case 'abandoned': return <Badge variant="danger">❌ Abandoned</Badge>;
      case 'no_order': return <Badge variant="default">— No Order</Badge>;
      case 'call_dropped': return <Badge variant="danger">📵 Dropped</Badge>;
      case 'in_progress': return <Badge variant="info">🔄 In Progress</Badge>;
      default: return <Badge variant="default">{outcome}</Badge>;
    }
  };

  const getLanguageBadge = (lang: string) => {
    switch (lang) {
      case 'ta': return <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/15 text-orange-400 rounded font-bold">தமிழ்</span>;
      case 'en': return <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/15 text-blue-400 rounded font-bold">ENG</span>;
      case 'tanglish': return <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/15 text-purple-400 rounded font-bold">Mix</span>;
      default: return null;
    }
  };

  const maxCalls = Math.max(...PEAK_HOURS.map(h => h.calls));

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-50/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-dark-400 rounded-xl hover:bg-dark-300 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">AI Call Center</h1>
                <p className="text-xs text-gray-500">Voice Order Intelligence Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {MOCK_STATS.activeCalls > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-400">{MOCK_STATS.activeCalls} Live Calls</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="flex gap-1 p-1 bg-dark-400/50 rounded-xl w-fit">
          {[
            { id: 'overview', label: '📊 Overview', },
            { id: 'calls', label: '📞 Call Log' },
            { id: 'escalations', label: '🙋 Escalations' },
            { id: 'config', label: '⚙️ Config' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ━━━━ OVERVIEW TAB ━━━━ */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                <p className="text-xs text-gray-400">Total Calls</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">{MOCK_STATS.totalCalls}</p>
                <p className="text-[10px] text-gray-500 mt-1">Last 7 days</p>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
                <p className="text-xs text-gray-400">Orders Created</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{MOCK_STATS.successfulOrders}</p>
                <p className="text-[10px] text-emerald-400 mt-1">✓ {MOCK_STATS.successRate}% success</p>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
                <p className="text-xs text-gray-400">Escalated</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">{MOCK_STATS.escalatedCalls}</p>
                <p className="text-[10px] text-orange-400 mt-1">↑ {MOCK_STATS.escalationRate}%</p>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                <p className="text-xs text-gray-400">Avg Handle Time</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{MOCK_STATS.avgHandleTime}</p>
                <p className="text-[10px] text-gray-500 mt-1">minutes</p>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
                <p className="text-xs text-gray-400">Avg AI Confidence</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{MOCK_STATS.avgConfidence}%</p>
                <p className="text-[10px] text-gray-500 mt-1">Score</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Calls */}
              <Card padding="none" className="border-emerald-500/20">
                <div className="p-4 border-b border-dark-50/20 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Live Calls ({MOCK_LIVE_CALLS.length})
                  </h3>
                </div>
                <div className="divide-y divide-dark-50/10">
                  {MOCK_LIVE_CALLS.map(call => (
                    <div key={call.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{call.phone}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{call.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-emerald-400">{call.duration}</p>
                        {getLanguageBadge(call.language)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Peak Hours Chart */}
              <Card padding="none" className="lg:col-span-2">
                <div className="p-4 border-b border-dark-50/20">
                  <h3 className="text-sm font-bold text-white">📈 Call Volume by Hour (Today)</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-end gap-1 h-32">
                    {PEAK_HOURS.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-sm transition-all hover:opacity-80"
                          style={{
                            height: `${(h.calls / maxCalls) * 100}%`,
                            background: h.calls > 25 ? 'rgba(168,85,247,0.6)' : h.calls > 15 ? 'rgba(168,85,247,0.4)' : 'rgba(168,85,247,0.2)',
                          }}
                        />
                        <span className="text-[8px] text-gray-500 -rotate-45">{h.hour}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Calls */}
            <Card padding="none">
              <div className="p-4 border-b border-dark-50/20 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">📞 Recent Calls</h3>
                <button onClick={() => setActiveTab('calls')} className="text-xs text-purple-400 font-bold hover:text-purple-300">View All →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-dark-50/10">
                      <th className="text-left px-4 py-3 font-medium">Caller</th>
                      <th className="text-left px-4 py-3 font-medium">Time</th>
                      <th className="text-left px-4 py-3 font-medium">Duration</th>
                      <th className="text-left px-4 py-3 font-medium">Language</th>
                      <th className="text-left px-4 py-3 font-medium">Confidence</th>
                      <th className="text-left px-4 py-3 font-medium">Outcome</th>
                      <th className="text-left px-4 py-3 font-medium">Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-50/10">
                    {MOCK_CALLS.slice(0, 5).map(call => (
                      <tr key={call.id} className="hover:bg-dark-400/20 transition-colors cursor-pointer" onClick={() => setSelectedCall(call.id)}>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-white">{call.customerName || call.callerPhone}</p>
                          {call.customerName && <p className="text-xs text-gray-500">{call.callerPhone}</p>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">{call.startTime}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-300">{call.duration}</td>
                        <td className="px-4 py-3">{getLanguageBadge(call.language)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-dark-400 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{
                                width: `${call.confidence}%`,
                                background: call.confidence > 80 ? '#10B981' : call.confidence > 60 ? '#F59E0B' : '#EF4444',
                              }} />
                            </div>
                            <span className="text-xs text-gray-400">{call.confidence}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{getOutcomeBadge(call.outcome)}</td>
                        <td className="px-4 py-3">
                          {call.orderId ? (
                            <span className="text-sm font-medium text-emerald-400">{call.orderId} (₹{call.orderTotal})</span>
                          ) : (
                            <span className="text-xs text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Language Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <h3 className="text-sm font-bold text-white mb-3">🗣️ Language Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Tamil (தமிழ்)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-dark-400 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: '68%' }} />
                      </div>
                      <span className="text-xs text-gray-400">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Tanglish (Mix)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-dark-400 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: '24%' }} />
                      </div>
                      <span className="text-xs text-gray-400">24%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">English</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-dark-400 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: '8%' }} />
                      </div>
                      <span className="text-xs text-gray-400">8%</span>
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 className="text-sm font-bold text-white mb-3">📦 Top Ordered Items (Voice)</h3>
                <div className="space-y-2">
                  {['Aavin Milk 1L', 'Rice 5kg', 'Cooking Oil', 'Sugar 1kg', 'Eggs (12)'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item}</span>
                      <span className="text-xs text-purple-400 font-bold">{35 - i * 5} orders</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-sm font-bold text-white mb-3">🏪 Top Shops (Voice Orders)</h3>
                <div className="space-y-2">
                  {['Murugan Stores', 'Fresh Mart', 'MedPlus', 'Sri Krishna', 'Annapoorna'].map((shop, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{shop}</span>
                      <span className="text-xs text-emerald-400 font-bold">{28 - i * 4} orders</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ━━━━ CALLS TAB ━━━━ */}
        {activeTab === 'calls' && (
          <Card padding="none">
            <div className="p-4 border-b border-dark-50/20 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">All Voice Calls</h3>
              <div className="flex gap-2">
                <select className="bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-1.5 text-xs text-gray-300">
                  <option>All Outcomes</option>
                  <option>Order Created</option>
                  <option>Escalated</option>
                  <option>Abandoned</option>
                </select>
                <select className="bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-1.5 text-xs text-gray-300">
                  <option>Today</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-dark-50/10">
                    <th className="text-left px-4 py-3 font-medium">ID</th>
                    <th className="text-left px-4 py-3 font-medium">Caller</th>
                    <th className="text-left px-4 py-3 font-medium">Time</th>
                    <th className="text-left px-4 py-3 font-medium">Duration</th>
                    <th className="text-left px-4 py-3 font-medium">Lang</th>
                    <th className="text-left px-4 py-3 font-medium">Confidence</th>
                    <th className="text-left px-4 py-3 font-medium">Outcome</th>
                    <th className="text-left px-4 py-3 font-medium">Shop</th>
                    <th className="text-left px-4 py-3 font-medium">Order</th>
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50/10">
                  {MOCK_CALLS.map(call => (
                    <tr key={call.id} className="hover:bg-dark-400/20 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">{call.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white">{call.customerName || '—'}</p>
                        <p className="text-xs text-gray-500">{call.callerPhone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{call.startTime}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-300">{call.duration}</td>
                      <td className="px-4 py-3">{getLanguageBadge(call.language)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${call.confidence > 80 ? 'text-emerald-400' : call.confidence > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {call.confidence}%
                        </span>
                      </td>
                      <td className="px-4 py-3">{getOutcomeBadge(call.outcome)}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{call.shopName || '—'}</td>
                      <td className="px-4 py-3">
                        {call.orderId ? <span className="text-sm text-emerald-400">{call.orderId}</span> : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 bg-dark-400 rounded-lg hover:bg-dark-300 text-xs" title="View Transcript">📜</button>
                          <button className="p-1.5 bg-dark-400 rounded-lg hover:bg-dark-300 text-xs" title="Play Recording">🎵</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ━━━━ ESCALATIONS TAB ━━━━ */}
        {activeTab === 'escalations' && (
          <Card padding="none">
            <div className="p-4 border-b border-dark-50/20 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">🙋 Human Escalations</h3>
              <Badge variant="warning">{MOCK_ESCALATIONS.filter(e => e.status === 'queued').length} Pending</Badge>
            </div>
            <div className="divide-y divide-dark-50/10">
              {MOCK_ESCALATIONS.map(esc => (
                <div key={esc.id} className="p-4 flex items-center justify-between hover:bg-dark-400/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      esc.status === 'queued' ? 'bg-orange-500/15 border border-orange-500/25' : 'bg-emerald-500/15 border border-emerald-500/25'
                    }`}>
                      <span className="text-lg">{esc.status === 'queued' ? '⏳' : '✅'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{esc.phone}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{esc.reason}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{esc.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {esc.agentName && <span className="text-xs text-gray-400">Handled by: {esc.agentName}</span>}
                    <Badge variant={esc.status === 'queued' ? 'warning' : 'success'}>{esc.status}</Badge>
                    {esc.status === 'queued' && (
                      <Button size="sm">Take Over</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ━━━━ CONFIG TAB ━━━━ */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-sm font-bold text-white mb-4">🤖 AI Voice Agent Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Confidence Threshold (%)</label>
                  <input type="number" defaultValue={70} className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                  <p className="text-[10px] text-gray-600 mt-1">Below this, AI asks clarifying question or escalates</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Max Clarification Attempts</label>
                  <input type="number" defaultValue={2} className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                  <p className="text-[10px] text-gray-600 mt-1">After this many, escalate to human</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Max Call Duration (seconds)</label>
                  <input type="number" defaultValue={300} className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">High Value Order Threshold (₹)</label>
                  <input type="number" defaultValue={2000} className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                  <p className="text-[10px] text-gray-600 mt-1">Above this, SMS confirmation required before dispatch</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Concurrent Call Limit</label>
                  <input type="number" defaultValue={10} className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Recording Retention (days)</label>
                  <input type="number" defaultValue={90} className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-dark-50/10">
                <Button>Save Configuration</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-white mb-4">📱 Telephony Provider</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Provider</label>
                  <select className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white">
                    <option>Exotel</option>
                    <option>Knowlarity</option>
                    <option>Airtel IQ</option>
                    <option>Twilio</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Support Number</label>
                  <input type="text" defaultValue="+91 9566700534" className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Human Agent Queue Number</label>
                  <input type="text" defaultValue="+91 9566700534" className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Webhook Secret</label>
                  <input type="password" defaultValue="••••••••••" className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-white mb-4">🗣️ Greeting Messages</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tamil Greeting</label>
                  <textarea defaultValue="வணக்கம்! நம்ம ஊரு Express-க்கு வரவேற்கிறேன். என்ன order வேணும்?"
                    className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white resize-none" rows={2} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">English Greeting</label>
                  <textarea defaultValue="Hello! Welcome to Namma Ooru Express. What would you like to order?"
                    className="w-full bg-dark-400 border border-dark-50/20 rounded-lg px-3 py-2 text-sm text-white resize-none" rows={2} />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
