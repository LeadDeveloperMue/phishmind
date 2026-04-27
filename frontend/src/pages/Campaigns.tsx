import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Send as SendIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../api/client';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import type { Campaign } from '../types';

const ATTACK_TYPES = [
  'Invoice Fraud',
  'Credential Theft',
  'Urgent Policy Update',
  'System Maintenance',
  'HR Impersonation',
  'IT Support Scam',
];

/**
 * Campaigns list page.
 * Displays a table of all campaigns with status badges and create/view actions.
 */
export const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', attack_type: ATTACK_TYPES[0] });

  const { data: campaigns = [], isLoading: loading } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await apiClient.get('/campaigns/');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCampaign: { name: string; attack_type: string }) => {
      const response = await apiClient.post('/campaigns/', newCampaign);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['recentCampaigns'] });
      toast.success('Campaign created successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', attack_type: ATTACK_TYPES[0] });
      navigate(`/campaigns/${data.id}`);
    },
    onError: () => {
      toast.error('Failed to create campaign. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Campaign name is required.');
      return;
    }
    createMutation.mutate(formData);
  };

  const statusVariant = (status: string): 'active' | 'completed' | 'draft' => {
    if (status === 'active') return 'active';
    if (status === 'completed') return 'completed';
    return 'draft';
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">
            Create and manage phishing simulations across your organization.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
      </div>

      {/* ── Create Campaign Modal ──────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Campaign"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={createMutation.isPending}>
              Create Campaign
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Campaign Name"
            placeholder="e.g., Q3 Security Drill"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoFocus
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-light-secondary dark:text-dark-secondary">
              Attack Type
            </label>
            <select
              className="flex h-10 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-sm"
              value={formData.attack_type}
              onChange={(e) => setFormData({ ...formData, attack_type: e.target.value })}
            >
              {ATTACK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-light-secondary dark:text-dark-secondary">
            All current employees will be added as targets automatically.
          </p>
        </form>
      </Modal>

      {/* ── Table / Empty State ────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-light-border dark:bg-dark-border animate-pulse rounded-xl" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={SendIcon}
          title="No campaigns yet"
          description="Create your first phishing simulation campaign to start testing your employees."
          actionLabel="Create Campaign"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-light-bg dark:bg-dark-bg text-light-secondary dark:text-dark-secondary">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Attack Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp: Campaign) => (
                  <tr
                    key={camp.id}
                    className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-bg/50 dark:hover:bg-dark-bg/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                  >
                    <td className="px-6 py-4 font-medium">{camp.name}</td>
                    <td className="px-6 py-4 text-light-secondary dark:text-dark-secondary">
                      {camp.attack_type}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(camp.status)}>{camp.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-light-secondary dark:text-dark-secondary">
                      {new Date(camp.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/campaigns/${camp.id}`);
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
