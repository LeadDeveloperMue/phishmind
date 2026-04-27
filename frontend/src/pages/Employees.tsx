import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../api/client';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import type { Employee } from '../types';

/**
 * Employees directory page.
 * Lists all employees with their current risk levels and scores.
 */
export const Employees: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    industry: 'Technology'
  });

  const { data: employees = [], isLoading: loading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await apiClient.get('/employees/');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newEmployee: any) => {
      const response = await apiClient.post('/employees/', newEmployee);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee added successfully');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', role: '', industry: 'Technology' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to add employee');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Please fill in all fields');
      return;
    }
    createMutation.mutate(formData);
  };

  const filteredEmployees = employees.filter((emp: Employee) => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'bg-success-light dark:bg-success';
    if (score <= 60) return 'bg-warning-light dark:bg-warning';
    if (score <= 80) return 'bg-accent';
    return 'bg-danger-light dark:bg-danger';
  };

  const getBadgeVariant = (score: number) => {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    if (score <= 80) return 'high';
    return 'critical';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">Monitor individual risk levels across the organization.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <UserPlus className="w-4 h-4" /> Add Employee
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} isLoading={createMutation.isPending}>Add Employee</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="e.g., Jane Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoFocus
          />
          <Input 
            label="Email Address" 
            type="email"
            placeholder="jane.doe@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input 
            label="Job Role" 
            placeholder="e.g., Accountant"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-light-secondary dark:text-dark-secondary">
              Industry Segment
            </label>
            <select
              className="flex h-10 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-sm"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            >
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Government">Government</option>
              <option value="Education">Education</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
        </form>
      </Modal>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-secondary dark:text-dark-secondary" />
          <input 
            type="text" 
            placeholder="Search by name, email or role..."
            className="w-full pl-10 pr-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary" className="gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title={searchTerm ? "No matches found" : "No employees found"}
          description={searchTerm ? `We couldn't find any employees matching "${searchTerm}".` : "Add employees to start tracking their security awareness and risk scores."}
          actionLabel={searchTerm ? "Clear Search" : "Add Employee"}
          onAction={() => searchTerm ? setSearchTerm('') : setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-light-bg dark:bg-dark-bg text-light-secondary dark:text-dark-secondary">
                <tr>
                  <th className="px-6 py-4">Name & Email</th>
                  <th className="px-6 py-4">Role & Industry</th>
                  <th className="px-6 py-4 w-48">Risk Score</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp: Employee) => (
                  <tr 
                    key={emp.id} 
                    className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-bg/50 dark:hover:bg-dark-bg/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-light-primary dark:text-dark-primary">{emp.name}</div>
                      <div className="text-xs text-light-secondary dark:text-dark-secondary">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-light-primary dark:text-dark-primary">{emp.role}</div>
                      <div className="text-xs text-light-secondary dark:text-dark-secondary">{emp.industry}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreColor(emp.risk_score)}`}
                            style={{ width: `${emp.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="font-medium w-6 text-right">{emp.risk_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getBadgeVariant(emp.risk_score)}>
                        {emp.risk_label}
                      </Badge>
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
