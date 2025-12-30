import React, { useState, useMemo, useEffect } from 'react'
import { Telescope } from 'lucide-react'
import InputSection from './InputSection'
import ProgressTracker from './ProgressTracker'
import ProjectionChart from './ProjectionChart'
import CheckInWidget from './CheckInWidget'
import CheckInHistory from './CheckInHistory'
import { getInitialInputs } from '@/utils/inputFetcher'
import { generateProjectionData } from '@/utils/calculations'
import { authClient } from '@/lib/auth-client'
import { loadGoal, saveGoal, getLatestCheckIn, getCheckInHistory, saveCheckIn } from '@/lib/api'
import { LogIn, User, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { PrivacyPolicyModal, TermsOfServiceModal } from './LegalModals'

const Dashboard = () => {
    const [inputs, setInputs] = useState(getInitialInputs);
    const [isLoadingGoal, setIsLoadingGoal] = useState(false);
    const [checkInHistory, setCheckInHistory] = useState([]);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const { data: session, isPending } = authClient.useSession();

    // Load data when user logs in
    useEffect(() => {
        const loadUserData = async () => {
            if (session?.user && !isLoadingGoal) {
                setIsLoadingGoal(true);
                try {
                    // Load Goal first
                    const goal = await loadGoal();
                    let currentInputs = inputs;
                    if (goal) {
                        currentInputs = goal;
                        setInputs(goal);
                        toast.success('Goal loaded successfully');
                    }

                    // Then Load Check-ins
                    const latestCheckIn = await getLatestCheckIn();
                    const history = await getCheckInHistory();
                    setCheckInHistory(history);

                    if (latestCheckIn) {
                        setInputs({
                            ...currentInputs,
                            initialCorpus: latestCheckIn.corpusValue
                        });
                        toast.info(`Using latest check-in corpus: ${latestCheckIn.corpusValue}k$`);
                    }
                } catch (error) {
                    console.error('Failed to load user data:', error);
                    // Don't show error toast for 404 (no goal/check-in found)
                    if (error.message !== 'Failed to load goal' && error.message !== 'Failed to get latest check-in') {
                        toast.error('Failed to load user data');
                    }
                } finally {
                    setIsLoadingGoal(false);
                }
            }
        };

        loadUserData();
    }, [session?.user?.id]); // Only run when user ID changes

    const handleSaveGoal = async () => {
        try {
            await saveGoal(inputs);
            toast.success('Goal saved successfully');
        } catch (error) {
            console.error('Failed to save goal:', error);
            toast.error(error.message || 'Failed to save goal');
        }
    };

    const handleCheckIn = async (corpusValue, month) => {
        try {
            await saveCheckIn(corpusValue, month);
            // Refresh history after check-in
            const history = await getCheckInHistory();
            setCheckInHistory(history);

            // Update current inputs with new corpus
            setInputs(prev => ({
                ...prev,
                initialCorpus: corpusValue
            }));
        } catch (error) {
            console.error('Check-in failed:', error);
            throw error;
        }
    };

    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: import.meta.env.VITE_APP_URL || window.location.origin
        });
    };

    const handleLogout = async () => {
        await authClient.signOut();
    };

    const monthlyContribution = useMemo(() => {
        const contribution = Math.max(0, inputs.annualIncome - inputs.annualExpense) / 12;
        return contribution;
    }, [inputs.annualIncome, inputs.annualExpense]);

    const targetNumber = useMemo(() => {
        return inputs.targetMultiple * inputs.annualExpense;
    }, [inputs.targetMultiple, inputs.annualExpense]);

    const projectionData = useMemo(() => {
        return generateProjectionData({
            inputs: inputs,
            monthlyContribution: monthlyContribution,
            targetNumber: targetNumber
        });
    }, [inputs, monthlyContribution, targetNumber]);

    const { yearsToFire, fireYear } = useMemo(() => {
        if (projectionData.length === 0) return { yearsToFire: 0, fireYear: new Date().getFullYear() };

        const lastPoint = projectionData[projectionData.length - 1];
        const years = lastPoint.total >= targetNumber ? lastPoint.year : Infinity;
        const currentYear = new Date().getFullYear();

        return {
            yearsToFire: years,
            fireYear: years === Infinity ? Infinity : currentYear + years
        };
    }, [projectionData, targetNumber]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto space-y-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 px-4">
                    <div className="flex flex-col space-y-4 items-center md:items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 shadow-inner">
                                <Telescope className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent font-['Outfit'] italic">
                                VANTAGE
                            </h1>
                        </div>
                        <p className="text-xl text-muted-foreground/80 font-light tracking-widest uppercase pl-1">
                            Your view to <span className="text-primary font-bold">FIRE</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {isPending ? (
                            <div className="h-10 w-40 bg-slate-800/50 animate-pulse rounded-full border border-white/5 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            </div>
                        ) : session ? (
                            <div className="flex items-center gap-4 bg-slate-800/40 p-2 pl-5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl group transition-all duration-300 hover:bg-slate-800/60">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold text-white/90 tracking-tight">{session.user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] font-black"
                                    >
                                        Log Out
                                    </button>
                                </div>
                                <div className="h-10 w-10 rounded-full border-2 border-primary/30 overflow-hidden bg-slate-700 shadow-inner group-hover:border-primary/60 transition-colors">
                                    {session.user.image ? (
                                        <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Button
                                onClick={handleLogin}
                                variant="outline"
                                className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-white gap-3 rounded-full px-8 py-6 text-base font-bold tracking-wide transition-all duration-300 shadow-lg hover:shadow-primary/5 active:scale-95"
                            >
                                <LogIn className="h-5 w-5 text-primary" />
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                    <div className="lg:col-span-1 space-y-6 transition-all duration-300">
                        <InputSection
                            inputs={inputs}
                            setInputs={setInputs}
                            onSave={handleSaveGoal}
                            isAuthenticated={!!session}
                        />
                        {session && (
                            <CheckInWidget
                                onCheckIn={handleCheckIn}
                                currentCorpus={inputs.initialCorpus}
                            />
                        )}
                    </div>

                    <div className="lg:col-span-2 space-y-6 transition-all duration-300">
                        <ProgressTracker
                            inputs={inputs}
                            current={inputs.initialCorpus}
                            target={targetNumber}
                            yearsToFire={yearsToFire}
                            fireYear={fireYear}
                        />
                        <ProjectionChart data={projectionData} target={targetNumber} />

                        {session && (
                            <CheckInHistory history={checkInHistory} />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto py-12 px-4 border-t border-white/5 bg-slate-950/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Telescope className="h-4 w-4 text-primary/60" />
                        <span className="text-sm text-muted-foreground/60 font-medium tracking-wider">
                            © {new Date().getFullYear()} VANTAGE • ALL RIGHTS RESERVED
                        </span>
                    </div>
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setIsPrivacyOpen(true)}
                            className="text-xs text-muted-foreground/60 hover:text-primary transition-colors uppercase tracking-[0.2em] font-black"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => setIsTermsOpen(true)}
                            className="text-xs text-muted-foreground/60 hover:text-primary transition-colors uppercase tracking-[0.2em] font-black"
                        >
                            Terms of Service
                        </button>
                    </div>
                </div>
            </footer>

            <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
            <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        </div>
    )
}

export default Dashboard
