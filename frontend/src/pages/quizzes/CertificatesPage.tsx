import React, { useState, useEffect } from 'react';
import { Award, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../../utils/api';

interface Certificate {
  id: string;
  course_title: string;
  certificate_url: string;
  issued_at: string;
}

export const CertificatesPage: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates/me');
      setCerts(res.data.certificates || []);
    } catch (e) {
      setCerts([
        {
          id: 'cert-001',
          course_title: 'Advanced Data Structures & Algorithms',
          certificate_url: '#',
          issued_at: new Date('2026-03-15').toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Certificates & Credentials</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verified achievements and completion certificates issued upon course mastery</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900/50">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Verified Completion
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{cert.course_title}</h3>
              </div>
            </div>

            {/* Certificate Frame */}
            <div className="p-6 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 rounded-lg text-center space-y-2 relative overflow-hidden">
              <ShieldCheck className="w-20 h-20 text-slate-200 dark:text-dark-800 absolute -top-3 -right-3 pointer-events-none" />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">Vertexon LMS Enterprise Platform</p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Certificate of Completion</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Awarded to <span className="font-semibold text-slate-900 dark:text-slate-100">Ananya Sharma</span></p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Issued on {new Date(cert.issued_at).toLocaleDateString()}</span>
            </div>

            <div className="pt-1 flex gap-3">
              <button
                onClick={() => alert(`Downloading certificate PDF for ${cert.course_title}...`)}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF Certificate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

