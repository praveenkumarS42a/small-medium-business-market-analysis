import React from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { Database, Scale, Cpu, Rocket } from 'lucide-react';

export function Recommendations() {
    const { totalScore, pillarScores } = useAssessmentStore();

    if (totalScore === 0) return null;

    const isExplorer = totalScore < 40;
    const isNavigator = totalScore >= 40 && totalScore <= 75;
    const isEvangelist = totalScore > 75;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4">
                NASSCOM 2.0 Strategic Roadmap
            </h3>

            {/* Status Highlight */}
            <div className={`p-4 rounded-xl border ${
                isExplorer ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' :
                isNavigator ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
            }`}>
                <h4 className={`font-semibold mb-2 flex items-center ${
                    isExplorer ? 'text-amber-800 dark:text-amber-300' :
                    isNavigator ? 'text-blue-800 dark:text-blue-300' :
                    'text-emerald-800 dark:text-emerald-300'
                }`}>
                    <Rocket className="mr-2 h-5 w-5" /> 
                    {isExplorer ? 'Phase 1: Foundation Building' : 
                     isNavigator ? 'Phase 2: Scale & Optimization' : 
                     'Phase 3: Industry Leadership'}
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    {isExplorer ? 'Prioritize Data Readiness and Ethical Guidelines before scaling GenAI.' :
                     isNavigator ? 'Focus on Hub-and-Spoke Operating Models and specialized GenAI integration.' :
                     'Leverage IndiaAI Compute Pillar and R&D grants to maintain Evangelist status.'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Specific Dimension Advice */}
                <div className="glass-panel p-4 flex gap-4">
                    <Database className="h-6 w-6 text-consultancy-blue flex-shrink-0" />
                    <div>
                        <h5 className="font-semibold text-slate-900 dark:text-white">Data & Tech Readiness</h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {pillarScores.dataReadiness < 30 
                                ? 'Move from manual processing to a Centralized Data Lake to support model training.'
                                : 'Implement automated ML-Ops pipelines for continuous model deployment.'}
                        </p>
                    </div>
                </div>

                <div className="glass-panel p-4 flex gap-4">
                    <Scale className="h-6 w-6 text-consultancy-blue flex-shrink-0" />
                    <div>
                        <h5 className="font-semibold text-slate-900 dark:text-white">Ethics & Governance</h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {pillarScores.ethicsGovernance < 30
                                ? 'Establish manual review cycles for AI outputs to mitigate bias.'
                                : 'Deploy automated guardrails and real-time compliance monitoring.'}
                        </p>
                    </div>
                </div>

                {isEvangelist && (
                    <div className="space-y-4 pt-4">
                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-consultancy-accent" /> Advanced Opportunities
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="glass-panel p-5 border-l-4 border-l-consultancy-accent">
                                <h5 className="font-semibold text-slate-900 dark:text-white">IndiaAI Compute Pillar</h5>
                                <p className="text-sm text-slate-500 mt-2 mb-4">Qualify for GPU subsidies via NASSCOM's Evangelist track.</p>
                                <button className="text-xs font-bold text-consultancy-blue uppercase tracking-wider">Check Eligibility →</button>
                            </div>
                            <div className="glass-panel p-5 border-l-4 border-l-cyan-500">
                                <h5 className="font-semibold text-slate-900 dark:text-white">GenAI R&D Grants</h5>
                                <p className="text-sm text-slate-500 mt-2 mb-4">Access innovation funds for custom LLM fine-tuning projects.</p>
                                <button className="text-xs font-bold text-consultancy-blue uppercase tracking-wider">Explore Grants →</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
