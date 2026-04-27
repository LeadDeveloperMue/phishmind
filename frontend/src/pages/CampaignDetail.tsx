import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Users, Mail, MousePointerClick, ShieldCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../api/client';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import type { Employee } from '../types';

interface CampaignTarget {
  id: string;
  campaign_id: string;
  employee_id: string;
  email_sent: boolean;
  email_sent_at: string | null;
}

interface ClickEvent {
  id: string;
  campaign_id: string;
  employee_id: string;
  action: 'clicked' | 'reported' | 'ignored';
  timestamp: string;
  attack_type: string;
}

interface CampaignDetailData {
  id: string;
  name: string;
  attack_type: string;
  channel: string;
  status: 'draft' | 'active' | 'completed';
  created_at: string;
  targets: CampaignTarget[];
  click_events: ClickEvent[];
}

/**
 * Campaign Detail page.
 * Shows stats, target audience with employee names, click events, and launch/complete actions.
 */
export const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch campaign detail
  const { data: campaign, isLoading } = useQuery<CampaignDetailData>({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const response = await apiClient.get(`/campaigns/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Fetch all employees to resolve names from IDs
  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await apiClient.get('/employees/');
      return response.data;
    },
  });

  const employeeMap = React.useMemo(() => {
    const map: Record<string, Employee> = {};
    for (const emp of employees) map[emp.id] = emp;
    return map;
  }, [employees]);

  // Launch campaign mutation
  const launchMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/campaigns/${id}/launch`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? 'Campaign launched successfully!');
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['recentCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['scoreSummary'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail ?? 'Failed to launch campaign.');
    },
  });

  // Mark complete mutation
  const completeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/campaigns/${id}/status`, { status: 'completed' });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Campaign marked as completed.');
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['recentCampaigns'] });
    },
    onError: () => toast.error('Failed to update campaign status.'),
  });

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-light-border dark:bg-dark-border rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-light-border dark:bg-dark-border rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-light-border dark:bg-dark-border rounded-xl" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-light-secondary dark:text-dark-secondary">Campaign not found.</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="mt-4 text-sm text-accent hover:underline"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  const emailsSent = campaign.targets.filter((t) => t.email_sent).length;
  const clicks = campaign.click_events.filter((e) => e.action === 'clicked').length;
  const reports = campaign.click_events.filter((e) => e.action === 'reported').length;
  const clickRate = emailsSent > 0 ? Math.round((clicks / emailsSent) * 100) : 0;

  const statusVariant =
    campaign.status === 'active' ? 'active' : campaign.status === 'completed' ? 'completed' : 'draft';

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start gap-4">
        <button
          onClick={() => navigate('/campaigns')}
          className="p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded-lg transition-colors mt-0.5"
          aria-label="Back to campaigns"
        >
          <ArrowLeft className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold truncate">{campaign.name}</h1>
            <Badge variant={statusVariant}>{campaign.status}</Badge>
          </div>
          <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">
            {campaign.attack_type} &bull; {campaign.channel} &bull; Created{' '}
            {new Date(campaign.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {campaign.status === 'draft' && (
            <Button
              className="gap-2"
              onClick={() => launchMutation.mutate()}
              isLoading={launchMutation.isPending}
            >
              <Play className="w-4 h-4" /> Launch Campaign
            </Button>
          )}
          {campaign.status === 'active' && (
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => completeMutation.mutate()}
              isLoading={completeMutation.isPending}
            >
              <CheckCircle className="w-4 h-4" /> Mark Complete
            </Button>
          )}
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Targets" value={campaign.targets.length} icon={Users} />
        <StatCard title="Emails Sent" value={emailsSent} icon={Mail} />
        <StatCard
          title="Clicks"
          value={clicks}
          icon={MousePointerClick}
          trend={emailsSent > 0 ? { value: `${clickRate}% rate`, isPositive: false } : undefined}
        />
        <StatCard
          title="Reported"
          value={reports}
          icon={ShieldCheck}
          trend={emailsSent > 0 ? { value: `${Math.round((reports / emailsSent) * 100)}% rate`, isPositive: true } : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Click Events ────────────────────────────────────────────── */}
        <div className="lg:col-span-1 p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm">
          <h3 className="text-base font-semibold mb-4">Interaction Events</h3>
          {campaign.click_events.length === 0 ? (
            <div className="py-8 text-center text-sm text-light-secondary dark:text-dark-secondary">
              No interactions recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {[...campaign.click_events]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 8)
                .map((evt) => {
                  const emp = employeeMap[evt.employee_id];
                  return (
                    <div
                      key={evt.id}
                      className="flex items-center justify-between gap-3 py-2 border-b border-light-border dark:border-dark-border last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {emp?.name ?? 'Unknown Employee'}
                        </p>
                        <p className="text-xs text-light-secondary dark:text-dark-secondary">
                          {new Date(evt.timestamp).toLocaleString()}
                        </p>
                      </div>
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
                  );
                })}
            </div>
          )}
        </div>

        {/* ── Targets Table ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm">
          <h3 className="text-base font-semibold mb-4">
            Target Audience
            <span className="ml-2 text-xs font-normal text-light-secondary dark:text-dark-secondary">
              ({campaign.targets.length} employees)
            </span>
          </h3>
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-light-surface dark:bg-dark-surface text-light-secondary dark:text-dark-secondary border-b border-light-border dark:border-dark-border sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Email Status</th>
                    <th className="px-4 py-3">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.targets.map((target) => {
                    const emp = employeeMap[target.employee_id];
                    const empEvent = campaign.click_events.find(
                      (e) => e.employee_id === target.employee_id,
                    );
                    return (
                      <tr
                        key={target.id}
                        className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-surface/60 dark:hover:bg-dark-surface/60 cursor-pointer transition-colors"
                        onClick={() => emp && navigate(`/employees/${emp.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium">{emp?.name ?? '—'}</div>
                          <div className="text-xs text-light-secondary dark:text-dark-secondary">
                            {emp?.email ?? target.employee_id.slice(0, 8) + '…'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-light-secondary dark:text-dark-secondary">
                          {emp?.role ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                          {target.email_sent ? (
                            <Badge variant={empEvent ? (empEvent.action === 'clicked' ? 'critical' : empEvent.action === 'reported' ? 'low' : 'medium') : 'success'}>
                              {empEvent ? empEvent.action : 'sent'}
                            </Badge>
                          ) : (
                            <Badge variant="draft">Pending</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-light-secondary dark:text-dark-secondary text-xs">
                          {target.email_sent_at
                            ? new Date(target.email_sent_at).toLocaleString()
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  {campaign.targets.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center text-light-secondary dark:text-dark-secondary text-sm"
                      >
                        No targets. Add employees first, then create a new campaign.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
