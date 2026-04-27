import React from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ThemeProvider } from '../context/ThemeContext';
import '../index.css';

/**
 * Public-facing training page.
 * Shown to employees after they click a phishing simulation.
 */
export const Training: React.FC = () => {
  const { attackType } = useParams<{ attackType: string }>();

  // Decode URI component just in case
  const decodedAttackType = decodeURIComponent(attackType || 'Phishing');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-danger-light/10 dark:bg-danger/10 rounded-full mb-4">
            <ShieldAlert className="w-12 h-12 text-danger-light dark:text-danger" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Oops! That was a simulated phishing attack.</h1>
          <p className="text-lg text-light-secondary dark:text-dark-secondary">
            Don't worry, your credentials and data are safe. This was a security awareness exercise from your IT team.
          </p>
        </div>

        <div className="w-full max-w-2xl bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-xl overflow-hidden text-left">
          <div className="bg-accent/10 border-b border-accent/20 p-6">
            <h2 className="text-xl font-semibold text-accent">Attack Type: {decodedAttackType}</h2>
            <p className="text-sm mt-2 opacity-90">
              You clicked a link in an email that was designed to look like a legitimate request. 
              Attackers use these tactics to steal passwords, financial information, or deploy malware.
            </p>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-medium">How to spot this next time:</h3>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success-light dark:text-success mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-light-primary dark:text-dark-primary">Check the sender address carefully.</strong>
                  <span className="text-light-secondary dark:text-dark-secondary">Often, attackers use domains that look similar to the real one (e.g., support@paypaI.com instead of paypal.com).</span>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success-light dark:text-success mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-light-primary dark:text-dark-primary">Watch for manufactured urgency.</strong>
                  <span className="text-light-secondary dark:text-dark-secondary">If the email threatens negative consequences (account deletion, missed payment) if you don't act immediately, it's likely a scam.</span>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success-light dark:text-success mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-light-primary dark:text-dark-primary">Hover over links before clicking.</strong>
                  <span className="text-light-secondary dark:text-dark-secondary">Check if the URL destination matches what you expect. If it looks strange or suspicious, don't click it.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-light-secondary dark:text-dark-secondary font-medium">
            Powered by PhishMind AI Security Awareness
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};
