'use client';
import { useState } from 'react';
import AnalysisReport from '../../components/AnalysisReport';
import { ArrowLeft, Printer, X } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/ainabi-api/admin/sessions', {
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setSessions(data.sessions || []);
        setConsultations(data.consultations || []);
      } else {
        setError('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/ainabi-api/admin/sessions', {
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
        setConsultations(data.consultations || []);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono">
        <form onSubmit={handleLogin} className="p-10 border border-ainabi-blue/30 rounded-xl bg-black/50 text-center shadow-2xl shadow-ainabi-blue/10">
          <h2 className="text-2xl text-ainabi-blue mb-8 font-bold tracking-widest uppercase">System Override</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-b border-white/20 text-white text-center w-full p-3 outline-none focus:border-ainabi-pink mb-6 tracking-[0.5em] text-lg transition-colors"
            placeholder="****"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-4 bg-ainabi-blue text-black font-black uppercase tracking-widest hover:bg-ainabi-pink hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all rounded">
            {loading ? 'Verifying...' : 'Access Database'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-ainabi-silver font-sans p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 border-b border-ainabi-blue/30 pb-4">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ainabi-blue to-ainabi-green tracking-tighter">AI상담소 NABI : DATABASE</h1>
          <p className="text-xs text-white/50 font-mono mt-1">SESSION ARCHIVES & RAW SNAPSHOTS</p>
        </div>
        <button 
          onClick={refreshData}
          disabled={loading}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded text-xs hover:bg-white/10 transition-colors font-mono"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-bold text-ainabi-blue mb-4">🏆 Finalized AI Reports (Consultations)</h2>
        <div className="overflow-x-auto rounded-lg border border-ainabi-blue/30 bg-black/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-ainabi-blue/10 text-ainabi-blue border-b border-ainabi-blue/30">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap">ID / Status</th>
                <th className="px-4 py-4 whitespace-nowrap">User Info (IP/Name)</th>
                <th className="px-4 py-4">User Input (Survey)</th>
                <th className="px-4 py-4">AI Generated Result</th>
                <th className="px-4 py-4 whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {consultations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-white/50 font-mono text-xs">No AI generated reports found.</td>
                </tr>
              ) : (
                consultations.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-4 align-top">
                      <div className="font-mono text-xs text-ainabi-blue">#{c.id}</div>
                      <span className="mt-2 inline-block px-2 py-1 rounded text-[9px] font-bold tracking-wider uppercase bg-ainabi-pink/20 text-ainabi-pink border border-ainabi-pink/30">
                        {c.status}
                      </span>
                      <button 
                        onClick={() => setSelectedConsultation(c)}
                        className="mt-4 block w-full py-2 bg-ainabi-blue/20 hover:bg-ainabi-blue text-ainabi-blue hover:text-black transition-all rounded text-[10px] font-bold uppercase border border-ainabi-blue/30"
                      >
                        리포트 PDF
                      </button>
                    </td>
                    <td className="px-4 py-4 align-top text-xs text-white/70 whitespace-nowrap">
                      <div>Name: <span className="text-ainabi-blue font-bold">{c.username || 'Anonymous'}</span></div>
                      <div className="text-[10px] opacity-70 mt-1">IP: {c.client_ip || '-'}</div>
                      <div className="text-[10px] opacity-70">Session: {c.session_id ? `${c.session_id.substring(0,8)}...` : '-'}</div>
                    </td>
                    <td className="px-4 py-4 w-[30%]">
                      <div className="max-h-40 overflow-y-auto text-[10px] bg-black/80 p-2 rounded border border-white/10 font-mono text-white/70 scrollbar-thin scrollbar-thumb-white/10">
                        <pre className="m-0 whitespace-pre-wrap word-break">
                          {c.survey_data ? JSON.stringify(c.survey_data, null, 2) : '-'}
                        </pre>
                      </div>
                    </td>
                    <td className="px-4 py-4 w-[40%]">
                      <div className="max-h-40 overflow-y-auto text-[10px] bg-black/80 p-2 rounded border border-ainabi-blue/20 font-mono text-ainabi-blue/90 scrollbar-thin scrollbar-thumb-ainabi-blue/50">
                        <pre className="m-0 whitespace-pre-wrap word-break">
                          {c.analysis_result ? JSON.stringify(c.analysis_result, null, 2) : '-'}
                        </pre>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-white/70 align-top whitespace-nowrap">
                      {new Date(c.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white/80 mb-4 font-mono">📡 In-Progress Raw Sessions (Snapshots)</h2>
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 shadow-xl">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-white/5 text-ainabi-blue border-b border-white/10">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap">Session ID</th>
                <th className="px-4 py-4 whitespace-nowrap">Status</th>
                <th className="px-4 py-4 whitespace-nowrap">Created At</th>
                <th className="px-4 py-4">Snapshot Metadata (Merged Data)</th>
                <th className="px-4 py-4 whitespace-nowrap">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-white/50 font-mono text-xs">No session records found.</td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-4 font-mono text-[10px] text-white/40 group-hover:text-white/80 transition-colors align-top">{s.id}</td>
                    <td className="px-4 py-4 align-top">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${s.status === 'completed' ? 'bg-ainabi-green/10 text-ainabi-green border border-ainabi-green/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-white/70 align-top whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</td>
                    <td className="px-4 py-4 w-full">
                      <div className="max-h-40 overflow-y-auto w-full text-[11px] bg-black/60 p-3 rounded border border-white/5 font-mono text-ainabi-blue/80 scrollbar-thin scrollbar-thumb-white/10">
                        <pre className="m-0 whitespace-pre-wrap word-break">
                          {s.merged ? JSON.stringify(s.merged, null, 2) : 'No data recorded yet'}
                        </pre>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-white/70 align-top whitespace-nowrap">{s.snapshot_updated_at ? new Date(s.snapshot_updated_at).toLocaleString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REPORT PREVIEW MODAL */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-20 relative">
            <div className="flex justify-between items-center mb-10 no-print">
               <button 
                onClick={() => setSelectedConsultation(null)}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
               >
                 <ArrowLeft className="w-4 h-4" />
                 <span>Back to Table</span>
               </button>
               
               <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 bg-ainabi-blue text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all"
               >
                 <Printer className="w-4 h-4" />
                 <span>Export / Print PDF</span>
               </button>
            </div>
            
            <div className="space-y-4 mb-10 border-b border-white/10 pb-10">
              <h1 className="text-3xl font-black text-ainabi-blue tracking-tighter uppercase">Neural Path Analysis Report</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono uppercase text-white/40">
                <div>Client: <span className="text-white/80">{selectedConsultation.username || 'Anonymous'}</span></div>
                <div>IP: <span className="text-white/80">{selectedConsultation.client_ip}</span></div>
                <div>Analyzed At: <span className="text-white/80">{new Date(selectedConsultation.created_at).toLocaleString()}</span></div>
                <div>Hash: <span className="text-white/80">#{selectedConsultation.id}</span></div>
              </div>
            </div>

            <AnalysisReport analysisResult={selectedConsultation.analysis_result} />
          </div>
        </div>
      )}
    </div>
  );
}
