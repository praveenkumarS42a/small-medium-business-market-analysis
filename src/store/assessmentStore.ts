import { create } from 'zustand';

export type Category = 'Initial' | 'Mature' | 'AI-First' | null;

export interface VerificationResult {
    isValid: boolean;
    confidence: number;
    feedback: string;
}

export interface DynamicQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

export interface AssessmentState {
    // NASSCOM 9 Dimensions
    strategyImpact: string;
    investments: string;
    talentTech: string;
    useCases: string;
    genAiStrategy: string;
    operatingModel: string;
    dataReadiness: string;
    innovation: string;
    ethicsGovernance: string;

    // Document Verification
    uploadedDocuments: File[];
    verificationStatus: 'idle' | 'verifying' | 'verified' | 'failed';
    verificationResults: Record<string, VerificationResult>;
    
    // Dynamic Questions (Awareness Test)
    dynamicQuestions: DynamicQuestion[];
    awarenessScore: number;

    // Market Context
    industry: string;
    domain: string;
    budget: string;
    marketAnalysis: any;

    // Results
    totalScore: number;
    pillarScores: Record<string, number>;
    category: Category;

    // Actions
    setField: (field: keyof Omit<AssessmentState, 'totalScore' | 'pillarScores' | 'category' | 'setField' | 'calculateScore' | 'resetForm' | 'setDocuments' | 'generateQuestions' | 'answerQuestion' | 'marketAnalysis'>, value: string) => void;
    setDocuments: (files: File[]) => void;
    calculateScore: () => void;
    generateQuestions: () => void;
    answerQuestion: (questionId: string, answer: string) => void;
    setMarketAnalysis: (analysis: any) => void;
    resetForm: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
    strategyImpact: '',
    investments: '',
    talentTech: '',
    useCases: '',
    genAiStrategy: '',
    operatingModel: '',
    dataReadiness: '',
    innovation: '',
    ethicsGovernance: '',

    uploadedDocuments: [],
    verificationStatus: 'idle',
    verificationResults: {},
    
    dynamicQuestions: [],
    awarenessScore: 0,

    industry: '',
    domain: '',
    budget: '',
    marketAnalysis: null,

    totalScore: 0,
    pillarScores: {},
    category: null,

    setField: (field, value) => set({ [field]: value } as any),

    setDocuments: (files) => set({ uploadedDocuments: files, verificationStatus: 'verified' }),

    answerQuestion: (questionId, answer) => {
        const questions = get().dynamicQuestions.map(q => 
            q.id === questionId ? { ...q, userAnswer: answer } : q
        );
        set({ dynamicQuestions: questions });
    },

    generateQuestions: () => {
        // Mock question generation based on "documents"
        const mockQuestions: DynamicQuestion[] = [
            {
                id: 'q1',
                question: "Based on your uploaded AI Policy, who is responsible for Bias Testing?",
                options: ["CTO", "Dedicated Ethics Committee", "External Auditors", "Not specified"],
                correctAnswer: "Dedicated Ethics Committee"
            },
            {
                id: 'q2',
                question: "What is the primary data retention period mentioned in your Data Strategy document?",
                options: ["1 year", "3 years", "5 years", "Forever"],
                correctAnswer: "5 years"
            }
        ];
        set({ dynamicQuestions: mockQuestions });
    },

    calculateScore: () => {
        const state = get();
        let score = 0;
        const pillarScores: Record<string, number> = {};

        const mapValueToScore = (val: string) => {
            if (!val || val === 'None' || val === 'Siloed' || val.includes('<1%')) return 10;
            if (val.includes('1-3%') || val.includes('Basic') || val.includes('Departmental')) return 20;
            return 30; // High maturity
        };

        const dimensions = [
            'strategyImpact', 'investments', 'talentTech', 'useCases', 
            'genAiStrategy', 'operatingModel', 'dataReadiness', 'innovation', 'ethicsGovernance'
        ];

        dimensions.forEach(dim => {
            const dimScore = mapValueToScore(state[dim as keyof AssessmentState] as string);
            pillarScores[dim] = dimScore;
            score += dimScore;
        });

        // Penalize if no documents or failed verification (Mock logic)
        if (state.uploadedDocuments.length === 0) {
            score *= 0.8; // 20% penalty for no evidence
        }

        // Add awareness score (Mock)
        const awarenessBonus = state.dynamicQuestions.filter(q => q.userAnswer === q.correctAnswer).length * 5;
        score += awarenessBonus;

        const finalScore = Math.min(Math.round((score / 270) * 100), 100);

        let category: Category = 'Initial';
        if (finalScore > 75) category = 'AI-First';
        else if (finalScore > 40) category = 'Mature';

        set({ totalScore: finalScore, pillarScores, category });
    },

    setMarketAnalysis: (analysis) => set({ marketAnalysis: analysis }),

    resetForm: () => set({
        strategyImpact: '',
        investments: '',
        talentTech: '',
        useCases: '',
        genAiStrategy: '',
        operatingModel: '',
        dataReadiness: '',
        innovation: '',
        ethicsGovernance: '',
        industry: '',
        domain: '',
        budget: '',
        marketAnalysis: null,
        uploadedDocuments: [],
        verificationStatus: 'idle',
        dynamicQuestions: [],
        awarenessScore: 0,
        totalScore: 0,
        pillarScores: {},
        category: null,
    })
}));
