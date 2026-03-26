import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/assessmentStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Recommendations } from './Recommendations';
import { Download, RefreshCw } from 'lucide-react';
import generatePDF from 'react-to-pdf';

export function Dashboard() {
    const { totalScore, category, pillarScores, resetForm } = useAssessmentStore();
    const navigate = useNavigate();
    const targetRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (totalScore === 0) {
            navigate('/assessment'); // Redirect if no score
        }
    }, [totalScore, navigate]);

    if (totalScore === 0) return null;

    // NASSCOM Evangelist Benchmarks (Average scores for industry leaders)
    const benchmarkData: Record<string, number> = {
        strategyImpact: 85,
        investments: 80,
        talentTech: 90,
        useCases: 75,
        genAiStrategy: 70,
        operatingModel: 80,
        dataReadiness: 85,
        innovation: 75,
        ethicsGovernance: 90
    };

    const dimensionLabels: Record<string, string> = {
        strategyImpact: 'Strategy',
        investments: 'Investment',
        talentTech: 'Talent & Tech',
        useCases: 'Use Cases',
        genAiStrategy: 'GenAI',
        operatingModel: 'Ops Model',
        dataReadiness: 'Data Readiness',
        innovation: 'Innovation',
        ethicsGovernance: 'Ethics & Gov'
    };

    const chartData = Object.keys(dimensionLabels).map(key => ({
        subject: dimensionLabels[key],
        user: pillarScores[key] ? (pillarScores[key] / 30) * 100 : 0,
        benchmark: benchmarkData[key]
    }));

    const handleDownloadPdf = () => {
        generatePDF(targetRef, { filename: 'nasscom_ai_readiness_report.pdf' });
    };

    const handleRetake = () => {
        resetForm();
        navigate('/assessment');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">NASSCOM Benchmark Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Your AI Maturity vs. Industry 'Evangelists'</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleRetake} className="btn-secondary">
                        <RefreshCw className="h-4 w-4 mr-2" /> Retake
                    </button>
                    <button onClick={handleDownloadPdf} className="btn-primary">
                        <Download className="h-4 w-4 mr-2" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Report Container (for PDF export) */}
            <div ref={targetRef} className="space-y-8 bg-transparent md:bg-white md:dark:bg-slate-900/50 md:p-8 md:rounded-3xl md:border border-slate-200 dark:border-slate-800">

                {/* Score Card */}
                <div className="glass-panel p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-consultancy-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <h2 className="text-lg font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Overall Maturity Score</h2>
                    <div className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white my-4">
                        {totalScore}<span className="text-3xl text-slate-400">/100</span>
                    </div>

                    <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold 
            bg-consultancy-blue/10 text-consultancy-blue dark:bg-consultancy-accent/20 dark:text-cyan-300 ring-1 ring-inset ring-consultancy-blue/20">
                        {category} Status
                    </div>

                    <p className="mt-6 max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
                        {totalScore < 40
                            ? "Your organization is currently an 'Explorer'. Industry leaders are significantly more advanced in Governance and Data Readiness."
                            : totalScore < 75
                                ? "You are a 'Navigator'. You are closing the gap with Evangelists, particularly in Strategy, but need more GenAI focus."
                                : "You are an 'Evangelist'! You are operating at industry-leading levels of AI maturity and governance."}
                    </p>
                </div>

                {/* Chart & Insights Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Industry Comparison (Radar)</h3>
                            <div className="flex flex-col text-[10px] gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                    <span className="text-slate-500">Your Organization</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-slate-300 rounded-sm"></div>
                                    <span className="text-slate-500">NASSCOM Evangelist</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 -ml-6 -mr-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                                    <PolarGrid stroke="#cbd5e1" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                    
                                    {/* Benchmark Series */}
                                    <Radar 
                                        name="Evangelist" 
                                        dataKey="benchmark" 
                                        stroke="#94a3b8" 
                                        fill="#94a3b8" 
                                        fillOpacity={0.1} 
                                    />
                                    
                                    {/* User Series */}
                                    <Radar 
                                        name="Your Score" 
                                        dataKey="user" 
                                        stroke="#3b82f6" 
                                        fill="#3b82f6" 
                                        fillOpacity={0.5} 
                                    />
                                    
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <Recommendations />
                    </div>
                </div>

                {/* FAQ / Trust Section */}
                <div className="mt-12 space-y-8 border-t border-slate-200 dark:border-slate-800 pt-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Trust & Verification</h3>
                        <p className="text-slate-500 mt-2">How we ensure your benchmarked score is accurate and industry-ready.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 border-t-4 border-t-consultancy-blue">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Q: How do you know they are telling the truth?</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                "We don't trust the user. We've implemented a **Document Verification Layer**. The app requires evidence (PDFs/Policies) and uses an AI-powered cross-check to verify if the claims match the documents. If they don't, we penalize the score."
                            </p>
                        </div>

                        <div className="glass-panel p-6 border-t-4 border-t-consultancy-accent">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Q: What is this invisible comparison?</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                "The comparison is now visible via a **Radar Chart**. We compare the user's verified data against the 'Evangelist' profiles from the **NASSCOM AI Adoption Index**. Users can see exactly which specific dimensions they are lagging in."
                            </p>
                        </div>

                        <div className="glass-panel p-6 border-t-4 border-t-cyan-500">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Q: Are they just aware of the questions?</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                "To test awareness, the system generates **Dynamic Context Questions** based on the uploaded documents. This ensures the owner actually understands the policies they are uploading."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
