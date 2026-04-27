import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Send, AlertTriangle, MousePointerClick } from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell,
  CartesianGrid,
} from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Employee, Campaign } from '../types';

/**
 * Main dashboard overview page.
 * Displays aggregate metrics, risk distribution (live), highest-risk employees, and recent campaigns.
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch employees ranked by risk score desc (from /scores/)
  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ['topEmployees'],
    queryFn: async () => {
      const response = await apiClient.get('/scores/');
      return response.data;
    },
  });

  // Fetch aggregate dashboard stats
  const { data: scoreSummary, isLoading: statsLoading } = useQuery({
    queryKey: ['scoreSummary'],
    queryFn: async () => {
      const response = await apiClient.get('/scores/summary');
      return response.data;
    },
  });

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ['recentCampaigns'],
    queryFn: async () => {
      const response = await apiClient.get('/campaigns/');
      return response.data;
    },
  });

  const loading = statsLoading || employeesLoading || campaignsLoading;

  // Build risk distribution from live employee data
  const riskDistributionData = React.useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    for (const emp of employees) {
      if (emp.risk_score <= 30) counts.Low++;
      else if (emp.risk_score <= 60) counts.Medium++;
      else if (emp.risk_score <= 80) counts.High++;
      else counts.Critical++;
    }
    return [
      { name: 'Low',      count: counts.Low,      color: '#3FB950' },
      { name: 'Medium',   count: counts.Medium,   color: '#D29922' },
      { name: 'High',     count: counts.High,     color: '#F97316' },
      { name: 'Critical', count: counts.Critical, color: '#F85149' },
    ];
  }, [employees]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">
            Organization-wide phishing risk at a glance.
          </p>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={employees.length.toString()}
          icon={Users}
        />
        <StatCard
          title="Active Campaigns"
          value={scoreSummary?.total_campaigns?.toString() ?? '0'}
          icon={Send}
        />
        <StatCard
          title="Avg Risk Score"
          value={Math.round(scoreSummary?.average_score ?? 0).toString()}
          icon={AlertTriangle}
          trend={{ value: 'org-wide', isPositive: (scoreSummary?.average_score ?? 0) < 50 }}
        />
        <StatCard
          title="Total Clicks"
          value={scoreSummary?.total_clicks?.toString() ?? '0'}
          icon={MousePointerClick}
          trend={{ value: `${scoreSummary?.total_reports ?? 0} reported`, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Risk Distribution Chart ─────────────────────────────────── */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm">
          <h3 className="text-lg font-medium mb-1">Risk Distribution</h3>
          <p className="text-xs text-light-secondary dark:text-dark-secondary mb-4">
            Employees by risk tier
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,148,158,0.15)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#8B949E"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    backgroundColor: '#161B22',
                    borderColor: '#30363D',
                    color: '#E6EDF3',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                  formatter={(val: number) => [val, 'Employees']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Highest Risk Employees ──────────────────────────────────── */}
        <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm">
          <h3 className="text-lg font-medium mb-1">Highest Risk Employees</h3>
          <p className="text-xs text-light-secondary dark:text-dark-secondary mb-4">
            Top 5 by risk score
          </p>
          {employees.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-light-secondary dark:text-dark-secondary">
              No employees found. Add employees to see risk data.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-light-bg dark:bg-dark-bg text-light-secondary dark:text-dark-secondary">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Employee</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Score</th>
                    <th className="px-4 py-3 rounded-tr-lg">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 5).map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-bg/50 dark:hover:bg-dark-bg/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/employees/${emp.id}`)}
                    >
                      <td className="px-4 py-3 font-medium">{emp.name}</td>
                      <td className="px-4 py-3 text-light-secondary dark:text-dark-secondary">{emp.role}</td>
                      <td className="px-4 py-3 text-right font-bold">{emp.risk_score}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            emp.risk_score > 80
                              ? 'critical'
                              : emp.risk_score > 60
                              ? 'high'
                              : emp.risk_score > 30
                              ? 'medium'
                              : 'low'
                          }
                        >
                          {emp.risk_label}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Campaigns ────────────────────────────────────────────── */}
      <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Recent Campaigns</h3>
            <p className="text-xs text-light-secondary dark:text-dark-secondary mt-0.5">
              Latest 5 campaigns
            </p>
          </div>
          <button
            onClick={() => navigate('/campaigns')}
            className="text-xs text-accent hover:underline font-medium"
          >
            View all →
          </button>
        </div>
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-sm text-light-secondary dark:text-dark-secondary">
            No campaigns yet. Create one from the Campaigns page.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-light-bg dark:bg-dark-bg text-light-secondary dark:text-dark-secondary">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Name</th>
                  <th className="px-4 py-3">Attack Type</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 5).map((camp) => (
                  <tr
                    key={camp.id}
                    className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-bg/50 dark:hover:bg-dark-bg/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                  >
                    <td className="px-4 py-3 font-medium">{camp.name}</td>
                    <td className="px-4 py-3 text-light-secondary dark:text-dark-secondary">{camp.attack_type}</td>
                    <td className="px-4 py-3 text-light-secondary dark:text-dark-secondary">
                      {new Date(camp.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          camp.status === 'active'
                            ? 'active'
                            : camp.status === 'completed'
                            ? 'completed'
                            : 'draft'
                        }
                      >
                        {camp.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
