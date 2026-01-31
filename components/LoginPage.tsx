import React, { useState } from 'react';
import { LogIn, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Cognitive Load Profiler</h1>
          <p className="text-slate-500 font-medium">Access for Educational Specialists</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors font-medium"
              placeholder="specialist@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
          >
            Secure Login <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;