export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  industry: string;
  risk_score: number;
  risk_label: string;
  risk_explanation: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  attack_type: string;
  channel: string;
  status: 'draft' | 'active' | 'completed';
  created_at: string;
}

export interface CampaignTarget {
  id: string;
  campaign_id: string;
  employee_id: string;
  email_sent: boolean;
  email_sent_at: string | null;
}

export interface ClickEvent {
  id: string;
  campaign_id: string;
  employee_id: string;
  action: 'clicked' | 'reported' | 'ignored';
  timestamp: string;
  attack_type: string;
}
