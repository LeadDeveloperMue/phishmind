import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Briefcase, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { RiskMeter } from '../components/ui/RiskMeter';
import { Badge } from '../components/ui/Badge';
import type { Employee, ClickEvent } from '../types';

interface EmployeeDetailData extends Employee {
  click_events: ClickEvent[];
}

function getBadgeVariant(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  if (score <= 80) return 'high';
  return 'critical';
}

/**
 * Employee Detail page.
 * Shows risk score gauge, AI explanation, score trend chart, and event timeline.
 * Wired to the real /api/employees/:id endpoint.
 */
export const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: employee, isLoading, isError } = useQuery<EmployeeDetailData>({
    queryKey: ['employee', id],
    queryFn: async () => {
      const response = await apiClient.get(`/employees/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Build a synthetic score-over-time from click events (most recent 6)
  const scoreHistory = React.useMemo(() => {
    if (!employee?.click_events?.length) return [];
    const events = [...employee.click_events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    let runningScore = 0;
    return events.slice(-6).map((evt) => {
      if (evt.action === 'clicked') runningScore = Math.min(100, runningScore + 15);
      else if (evt.action === 'reported') runningScore = Math.max(0, runningScore - 10);
      else runningScore = Math.min(100, runningScore + 5);
      const date = new Date(evt.timestamp);
      return {
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: runningScore,
      };
    });
  }, [employee]);

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-light-border dark:bg-dark-border rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-light-border dark:bg-dark-border rounded-xl" />
          <div className="lg:col-span-2 h-64 bg-light-border dark:bg-dark-border rounded-xl" />
        </div>
        <div className="h-48 bg-light-border dark:bg-dark-border rounded-xl" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-light-secondary dark:text-dark-secondary">Employee not found.</p>
        <button
          onClick={() => navigate('/employees')}
          className="mt-4 text-sm text-accent hover:underline"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  const badgeVariant = getBadgeVariant(employee.risk_score);

  const riskCardColor = {
    low: 'bg-success-light/10 border-success-light/20 dark:bg-success/10 dark:border-success/20',
    medium: 'bg-warning-light/10 border-warning-light/20 dark:bg-warning/10 dark:border-warning/20',
    high: 'bg-accent/10 border-accent/20',
    critical: 'bg-danger-light/10 border-danger-light/20 dark:bg-danger/10 dark:border-danger/20',
  }[badgeVariant];

  const riskTextColor = {
    low: 'text-success-light dark:text-success',
    medium: 'text-warning-light dark:text-warning',
    high: 'text-accent',
    critical: 'text-danger-light dark:text-danger',
  }[badgeVariant];

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/employees')}
          className="p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded-lg transition-colors"
          aria-label="Back to employees"
        >
          <ArrowLeft className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold truncate">{employee.name}</h1>
            <Badge variant={badgeVariant}>{employee.risk_label}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-light-secondary dark:text-dark-secondary flex-wrap">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {employee.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> {employee.role}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> {employee.industry}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Risk Profile Card ───────────────────────────────────────── */}
        <div className="lg:col-span-1 p-6 flex flex-col items-center rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm gap-6">
          <RiskMeter score={employee.risk_score} label={employee.risk_label} />

          {employee.risk_explanation && (
            <div className={`p-4 rounded-lg border w-full ${riskCardColor}`}>
              <p className={`text-sm font-medium leading-relaxed ${riskTextColor}`}>
                {employee.risk_explanation}
              </p>
            </div>
          )}

          {/* Quick stats */}
          <div className="w-full space-y-3 pt-2 border-t border-light-border dark:border-dark-border">
            <div className="flex justify-between text-sm">
              <span className="text-light-secondary dark:text-dark-secondary">Total Events</span>
              <span className="font-semibold">{employee.click_events.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-light-secondary dark:text-dark-secondary">Clicks</span>
              <span className="font-semibold text-danger-light dark:text-danger">
                {employee.click_events.filter((e) => e.action === 'clicked').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-light-secondary dark:text-dark-secondary">Reports</span>
              <span className="font-semibold text-success-light dark:text-success">
                {employee.click_events.filter((e) => e.action === 'reported').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-light-secondary dark:text-dark-secondary">Member since</span>
              <span className="font-semibold">
                {new Date(employee.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Score Trend Chart ───────────────────────────────────────── */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm">
          <h3 className="text-lg font-medium mb-4">Risk Score Trend</h3>
          {scoreHistory.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,148,158,0.15)" />
                  <XAxis
                    dataKey="label"
                    stroke="#8B949E"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#8B949E"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161B22',
                      borderColor: '#30363D',
                      color: '#E6EDF3',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                    formatter={(val: number) => [`${val}`, 'Risk Score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#F97316"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#F97316', strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: '#F97316' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-light-secondary dark:text-dark-secondary text-sm">
              No interaction data yet. Score trend will appear after the first simulation.
            </div>
          )}
        </div>
      </div>

      {/* ── Event Timeline ──────────────────────────────────────────────── */}
      <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm">
        <h3 className="text-lg font-medium mb-4">Event Timeline</h3>
        {employee.click_events.length === 0 ? (
          <p className="text-sm text-light-secondary dark:text-dark-secondary text-center py-8">
            No events recorded yet for this employee.
          </p>
        ) : (
          <div className="space-y-3">
            {[...employee.click_events]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((evt) => (
                <div
                  key={evt.id}
                  className="flex gap-4 items-start p-4 bg-light-bg dark:bg-dark-bg rounded-lg"
                >
                  <div className="mt-0.5 shrink-0">
                    <Badge
                      variant={
                        evt.action === 'clicked'
                          ? 'critical'
                          : evt.action === 'reported'
                          ? 'low'
                          : 'medium'
                      }
                    >
                      {evt.action}
                    </Badge>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm capitalize">
                      {evt.action === 'clicked'
                        ? 'Clicked on a phishing simulation'
                        : evt.action === 'reported'
                        ? 'Reported a phishing simulation'
                        : 'Ignored a phishing simulation'}
                    </p>
                    <p className="text-xs text-light-secondary dark:text-dark-secondary mt-0.5">
                      {new Date(evt.timestamp).toLocaleString()} &bull; Attack Type:{' '}
                      <span className="font-medium">{evt.attack_type}</span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
