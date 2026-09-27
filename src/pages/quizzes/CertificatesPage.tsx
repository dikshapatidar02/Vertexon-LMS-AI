import React, { useState } from 'react';
import { Award, Download, ShieldCheck, CheckCircle2, Eye, X, Sparkles, Printer } from 'lucide-react';
import { INITIAL_CERTIFICATES } from '../../utils/demoData';
import { useAuthStore } from '../../store/authStore';

export const CertificatesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedCert, setSelectedCert] = useState<typeof INITIAL_CERTIFICATES[0] | null>(null);

  const studentName = user?.full_name || 'Ananya Sharma';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="border-b border-slate-200 dark:border-dark-800 pb-4">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Verified Academic Certificates & Credentials
        </h1>
        <p className="text-xs text-slate-500">Official certificates earned upon verified 100% course completion and assessment mastery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_CERTIFICATES.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900/50">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Verified Certificate
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{cert.courseTitle}</h3>
              </div>
            </div>

            {/* Certificate Micro Card */}
            <div className="p-6 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 rounded-xl text-center space-y-2 relative overflow-hidden">
              <ShieldCheck className="w-24 h-24 text-slate-200/60 dark:text-dark-800/60 absolute -top-4 -right-4 pointer-events-none" />
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Vertexon LMS Academic Platform</p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Certificate of Completion</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Awarded to <span className="font-bold text-slate-900 dark:text-slate-100">{studentName}</span></p>
              <div className="text-[10px] text-slate-500 pt-1 flex justify-center gap-4">
                <span>Issued: {cert.issueDate}</span>
                <span>ID: {cert.certificateId}</span>
              </div>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                onClick={() => setSelectedCert(cert)}
                className="btn-primary flex-1 h-9 text-xs font-semibold"
              >
                <Eye className="w-3.5 h-3.5" /> View Formal Certificate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formal Certificate View Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-2xl max-w-3xl w-full p-8 space-y-6 relative overflow-hidden">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header Controls */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-dark-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Certificate Preview</span>
              </div>
              <button
                onClick={() => window.print()}
                className="btn-secondary h-8 px-3 text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
              </button>
            </div>

            {/* Decorative Certificate Board */}
            <div className="p-10 bg-gradient-to-b from-slate-50 to-white dark:from-dark-950 dark:to-dark-900 border-8 border-double border-amber-500/30 rounded-xl text-center space-y-6 relative shadow-inner">
              <ShieldCheck className="w-32 h-32 text-amber-500/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              <div className="space-y-1">
                <p className="text-xs uppercase font-extrabold tracking-widest text-amber-600 dark:text-amber-400">Vertexon LMS Academic Accreditation</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-serif">Certificate of Mastery</h2>
              </div>

              <p className="text-xs text-slate-500">This is to certify that</p>

              <h3 className="text-xl sm:text-2xl font-bold text-brand-600 dark:text-brand-400 underline decoration-amber-500 decoration-2 underline-offset-8">
                {studentName}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                has successfully fulfilled all curriculum requirements, practical benchmarks, and final assessments for
              </p>

              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                {selectedCert.courseTitle}
              </h4>

              <div className="pt-6 grid grid-cols-2 gap-8 max-w-lg mx-auto border-t border-slate-200 dark:border-dark-800 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{selectedCert.instructor}</p>
                  <p className="text-[11px] text-slate-500">Course Faculty Instructor</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{selectedCert.issueDate}</p>
                  <p className="text-[11px] text-slate-500">Credential ID: {selectedCert.certificateId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
