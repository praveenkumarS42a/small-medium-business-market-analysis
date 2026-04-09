import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/assessmentStore';
import { generateMarketAnalysis } from '../lib/gemini';
import { ArrowRight, ArrowLeft, CheckCircle2, Upload, FileText, Loader2 } from 'lucide-react';

const steps = [
    { id: 0, title: 'Context' },
    { id: 1, title: 'Strategy' },
    { id: 2, title: 'Investment' },
    { id: 3, title: 'Talent' },
    { id: 4, title: 'Use Cases' },
    { id: 5, title: 'GenAI' },
    { id: 6, title: 'Ops Model' },
    { id: 7, title: 'Data' },
    { id: 8, title: 'Innovation' },
    { id: 9, title: 'Ethics' },
    { id: 10, title: 'Verification' },
    { id: 11, title: 'Awareness' },
];

export function AssessmentForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        industry, domain, budget,
        strategyImpact, investments, talentTech, useCases, genAiStrategy,
        operatingModel, dataReadiness, innovation, ethicsGovernance,
        uploadedDocuments, dynamicQuestions,
        setField, setDocuments, calculateScore, generateQuestions, answerQuestion
    } = useAssessmentStore();

    const handleNext = async () => {
        if (currentStep === 10) {
            generateQuestions();
            setCurrentStep(11);
        } else if (currentStep < 11) {
            setCurrentStep(c => c + 1);
        } else {
            setIsAnalyzing(true);
            calculateScore();
            
            // Generate AI Market Analysis
            try {
                const state = useAssessmentStore.getState();
                const analysis = await generateMarketAnalysis({
                    industry: state.industry,
                    domain: state.domain,
                    budget: state.budget,
                    currentMaturity: state.category || 'Initial'
                });
                useAssessmentStore.getState().setMarketAnalysis(analysis);
            } catch (error) {
                console.error("AI Analysis failed:", error);
            } finally {
                setIsAnalyzing(false);
                navigate('/dashboard');
            }
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: return !!industry && !!domain && !!budget;
            case 1: return !!strategyImpact;
            case 2: return !!investments;
            case 3: return !!talentTech;
            case 4: return !!useCases;
            case 5: return !!genAiStrategy;
            case 6: return !!operatingModel;
            case 7: return !!dataReadiness;
            case 8: return !!innovation;
            case 9: return !!ethicsGovernance;
            case 10: return uploadedDocuments.length > 0;
            case 11: return dynamicQuestions.every(q => q.userAnswer);
            default: return false;
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments(Array.from(e.target.files));
        }
    };

    const OptionGrid = ({ field, options }: { field: any, options: string[] }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {options.map(opt => {
                const isSelected = (useAssessmentStore.getState() as any)[field] === opt;
                return (
                    <button 
                        key={opt} 
                        onClick={() => setField(field, opt)} 
                        className={`p-4 rounded-xl border text-left transition-all ${isSelected ? 'border-consultancy-blue bg-blue-50 dark:bg-blue-900/20 ring-1 ring-consultancy-blue text-consultancy-blue dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'}`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{opt}</span>
                            {isSelected && <CheckCircle2 className="h-5 w-5" />}
                        </div>
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">NASSCOM AI Maturity Assessment 2.0</h1>
                <p className="text-slate-500 dark:text-slate-400">Complete the 9 pillars and verify your claims for an industry-standard benchmark.</p>

                {/* Progress Bar */}
                <div className="relative pt-4 overflow-x-auto pb-2">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700 min-w-[600px]">
                        <div style={{ width: `${(currentStep / steps.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-consultancy-blue transition-all duration-500"></div>
                    </div>
                    <div className="flex justify-between w-full min-w-[600px]">
                        {steps.map(step => (
                            <div key={step.id} className={`text-[10px] font-semibold uppercase tracking-tighter ${currentStep >= step.id ? 'text-consultancy-blue dark:text-consultancy-accent' : 'text-slate-400 dark:text-slate-500'}`}>
                                {step.title}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 md:p-8 min-h-[450px] flex flex-col relative overflow-hidden">
                <div className="flex-1 transition-opacity duration-300">

                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">0. Market Context</h2>
                            <p className="text-sm text-slate-500 mb-6">Tell us about your business to get accurate competitive benchmarks.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                                    <select 
                                        value={industry}
                                        onChange={(e) => setField('industry', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-consultancy-blue outline-none transition-all"
                                    >
                                        <option value="">Select Industry</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Education">Education</option>
                                        <option value="Technology">Technology</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Specific Domain</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Cancer Diagnostics, E-commerce Logistics"
                                        value={domain}
                                        onChange={(e) => setField('domain', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-consultancy-blue outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Annual AI Budget (Approx in USD)</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. $50,000, $1M"
                                        value={budget}
                                        onChange={(e) => setField('budget', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-consultancy-blue outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. AI Strategy and Impact</h2>
                            <p className="text-sm text-slate-500 mb-6">How integral is AI to your overall business strategy?</p>
                            <OptionGrid field="strategyImpact" options={['Ad-Hoc Projects', 'Core Strategy Component', 'AI-First Vision']} />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. AI Investments</h2>
                            <p className="text-sm text-slate-500 mb-6">Percentage of annual revenue/budget allocated to AI.</p>
                            <OptionGrid field="investments" options={['<1% of Revenue', '1-5% of Revenue', '>5% of Revenue']} />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. AI Talent and Technology</h2>
                            <p className="text-sm text-slate-500 mb-6">Scale of your dedicated AI/Data workforce.</p>
                            <OptionGrid field="talentTech" options={['Outsourced', 'Mini Internal Team', 'Full COE (Center of Excellence)']} />
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. AI Use Cases</h2>
                            <p className="text-sm text-slate-500 mb-6">Depth and breadth of AI implementation.</p>
                            <OptionGrid field="useCases" options={['Single Dept', 'Cross-Functional', 'End-to-End Automation']} />
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">5. Generative AI Strategy</h2>
                            <p className="text-sm text-slate-500 mb-6">Adoption status of LLMs and Generative models.</p>
                            <OptionGrid field="genAiStrategy" options={['Exploring/Chatbots', 'Internal Productivity Tools', 'Customer-Facing GenAI Products']} />
                        </div>
                    )}

                    {currentStep === 6 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">6. Operating Model</h2>
                            <p className="text-sm text-slate-500 mb-6">Organizational structure for AI delivery.</p>
                            <OptionGrid field="operatingModel" options={['Decentralized', 'Hub & Spoke', 'Federated / Central Governance']} />
                        </div>
                    )}

                    {currentStep === 7 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">7. Data and Technology Readiness</h2>
                            <p className="text-sm text-slate-500 mb-6">Maturity of data pipelines and infrastructure.</p>
                            <OptionGrid field="dataReadiness" options={['Manual Processing', 'Centralized Data Lake', 'Automated ML-Ops Pipeline']} />
                        </div>
                    )}

                    {currentStep === 8 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">8. AI-Led Innovation</h2>
                            <p className="text-sm text-slate-500 mb-6">Frequency of AI-driven new product/service launches.</p>
                            <OptionGrid field="innovation" options={['Occasional', 'Regular Cycle', 'Continuous R&D Culture']} />
                        </div>
                    )}

                    {currentStep === 9 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">9. AI Ethics, Governance & Controls</h2>
                            <p className="text-sm text-slate-500 mb-6">Risk mitigation and ethical guidelines status.</p>
                            <OptionGrid field="ethicsGovernance" options={['None', 'Manual Review', 'Automated Guardrails']} />
                        </div>
                    )}

                    {currentStep === 10 && (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                <Upload className="h-8 w-8 text-consultancy-blue" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Document Verification Layer</h2>
                            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
                                To verify your maturity claims, please upload evidence such as your **AI Governance Policy**, **Data Strategy Roadmap**, or **Budget Allocation Sheets**.
                            </p>
                            
                            <input 
                                type="file" 
                                multiple 
                                hidden 
                                ref={fileInputRef} 
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx"
                            />

                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 cursor-pointer hover:border-consultancy-blue transition-colors bg-slate-50/50 dark:bg-slate-800/30"
                            >
                                <p className="text-slate-600 dark:text-slate-400">Click to upload files (PDFs/DOCs only)</p>
                            </div>

                            {uploadedDocuments.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                                    {uploadedDocuments.map((file, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                                            <FileText className="h-4 w-4 text-consultancy-blue" />
                                            <span className="text-sm font-medium">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 11 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dynamic Awareness Test</h2>
                                <p className="text-sm text-slate-500 mt-2">To ensure genuine policy understanding, answer these AI-generated questions based on your uploads.</p>
                            </div>

                            <div className="space-y-8">
                                {dynamicQuestions.map((q, idx) => (
                                    <div key={q.id} className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex gap-2">
                                            <span className="text-consultancy-blue italic">Q{idx + 1}:</span> {q.question}
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map(opt => (
                                                <button 
                                                    key={opt} 
                                                    onClick={() => answerQuestion(q.id, opt)}
                                                    className={`p-4 rounded-xl border text-left text-sm transition-all ${q.userAnswer === opt ? 'border-consultancy-blue bg-blue-50 dark:bg-blue-900/20 text-consultancy-blue' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                    <button
                        onClick={() => setCurrentStep(c => c - 1)}
                        className={`btn-secondary ${currentStep === 0 ? 'invisible' : ''}`}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isStepValid() || isAnalyzing}
                        className="btn-primary min-w-[140px]"
                    >
                        {isAnalyzing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {currentStep === 11 ? 'Calculate Score' : (currentStep === 10 ? 'Start Awareness Test' : 'Next Step')} 
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
