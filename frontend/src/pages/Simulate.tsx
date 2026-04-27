import React, { useState } from 'react';
import { ArrowLeft, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../api/client';
import { Button } from '../components/ui/Button';

const ROLES = ['Accountant', 'HR Manager', 'IT Support', 'Finance Director', 'CEO', 'Sales Rep', 'Legal Counsel'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Government', 'Education', 'Legal'];
const ATTACK_TYPES = [
  'Invoice Fraud',
  'Credential Theft',
  'Urgent Policy Update',
  'System Maintenance',
  'HR Impersonation',
  'IT Support Scam',
];

interface PreviewData {
  subject: string;
  body: string;
  sender_name: string;
  sender_email: string;
  cta_text: string;
  red_flags: string[];
}

const selectClass =
  'flex h-10 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-sm';

/**
 * Simulate page — generates a live AI phishing email preview via Gemini.
 */
export const Simulate: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: ROLES[0],
    industry: INDUSTRIES[0],
    attack_type: ATTACK_TYPES[0],
  });
  const [preview, setPreview] = useState<PreviewData | null>(null);

  const previewMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const response = await apiClient.post('/simulate/preview', data);
      return response.data as PreviewData;
    },
    onSuccess: (data) => {
      setPreview(data);
    },
    onError: () => {
      toast.error('Failed to generate preview. Check your Gemini API key.');
    },
  });

  const handleGenerate = () => previewMutation.mutate(form);

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Email Simulator</h1>
          <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">
            Generate a live AI-powered phishing preview — no emails are sent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Controls ────────────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-5">
          <div className="p-6 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-sm space-y-5">
            <h3 className="text-base font-semibold">Simulation Parameters</h3>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-light-secondary dark:text-dark-secondary">
                Employee Role
              </label>
              <select
                className={selectClass}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-light-secondary dark:text-dark-secondary">
                Industry
              </label>
              <select
                className={selectClass}
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              >
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-light-secondary dark:text-dark-secondary">
                Attack Type
              </label>
              <select
                className={selectClass}
                value={form.attack_type}
                onChange={(e) => setForm({ ...form, attack_type: e.target.value })}
              >
                {ATTACK_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleGenerate}
              isLoading={previewMutation.isPending}
            >
              {previewMutation.isPending ? (
                'Generating with Gemini…'
              ) : preview ? (
                <><RefreshCw className="w-4 h-4" /> Regenerate</>
              ) : (
                <><Zap className="w-4 h-4" /> Generate Preview</>
              )}
            </Button>
          </div>

          {/* ── Red Flags ─────────────────────────────────────────────── */}
          {preview && (
            <div className="p-6 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-danger-light dark:text-danger shrink-0" />
                <h4 className="text-sm font-semibold text-danger-light dark:text-danger">
                  Detected Red Flags
                </h4>
              </div>
              <ul className="space-y-2">
                {preview.red_flags.map((flag, idx) => (
                  <li key={idx} className="flex items-start text-sm gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger-light dark:bg-danger mt-1.5 shrink-0" />
                    <span className="text-light-secondary dark:text-dark-secondary">{flag}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border space-y-1 text-xs text-light-secondary dark:text-dark-secondary">
                <div><span className="font-medium">Model:</span> Gemini 1.5 Flash</div>
                <div><span className="font-medium">Type:</span> {form.attack_type}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Email Preview ────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
            {/* Mock browser chrome */}
            <div className="bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger-light dark:bg-danger" />
                <div className="w-3 h-3 rounded-full bg-warning-light dark:bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success-light dark:bg-success" />
              </div>
              <div className="ml-3 flex-1 bg-light-surface dark:bg-dark-surface rounded-md px-3 py-1 text-xs text-light-secondary dark:text-dark-secondary font-mono truncate">
                Inbox — Email Client
              </div>
            </div>

            {preview ? (
              <>
                {/* Email header */}
                <div className="p-6 border-b border-light-border dark:border-dark-border">
                  <h2 className="text-lg font-medium mb-3">{preview.subject}</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-light-bg dark:bg-dark-bg flex items-center justify-center text-sm font-semibold text-light-secondary dark:text-dark-secondary shrink-0">
                      {preview.sender_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{preview.sender_name}</div>
                      <div className="text-xs text-light-secondary dark:text-dark-secondary">
                        &lt;{preview.sender_email}&gt;
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email body */}
                <div className="flex-1 p-6 bg-white text-gray-800 text-sm leading-relaxed overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: preview.body }} />
                  {preview.cta_text && (
                    <div className="mt-6">
                      <span className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded text-sm font-semibold cursor-default opacity-80">
                        {preview.cta_text}
                      </span>
                      <p className="text-xs text-gray-400 mt-2 italic">
                        ↑ This button would contain the phishing tracking link.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-light-bg dark:bg-dark-bg flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-light-secondary dark:text-dark-secondary" />
                </div>
                <h3 className="text-base font-medium mb-2">No preview generated yet</h3>
                <p className="text-sm text-light-secondary dark:text-dark-secondary max-w-xs">
                  Select your parameters and click <strong>Generate Preview</strong> to see an AI-crafted phishing email.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
