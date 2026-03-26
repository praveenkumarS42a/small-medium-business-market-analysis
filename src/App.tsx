import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAssessmentStore } from './store/assessmentStore';
import { ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const resetForm = useAssessmentStore((state) => state.resetForm);

  const startAssessment = () => {
    resetForm();
    navigate('/assessment');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Adoption Index & <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-consultancy-blue to-consultancy-accent dark:from-consultancy-accent dark:to-cyan-400">
            Strategic Roadmap
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Assess your business's AI maturity, benchmark your score, and get a personalized roadmap to access government resources and accelerate growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12 mb-12">
        {[
          { icon: Zap, title: 'Quick Assessment', desc: '4-pillar evaluation taking under 5 minutes' },
          { icon: BarChart3, title: 'Benchmarked Score', desc: 'See where you stand globally' },
          { icon: ShieldCheck, title: 'Actionable Roadmap', desc: 'Personalized steps & government grants' }
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-consultancy-blue dark:text-consultancy-accent">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>

      <button onClick={startAssessment} className="btn-primary group text-lg px-8 py-4">
        Start Free Assessment
        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

// Removed placeholders

import { AssessmentForm } from './components/AssessmentForm';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment" element={<AssessmentForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
