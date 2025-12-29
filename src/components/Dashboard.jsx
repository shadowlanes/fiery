import React, { useState, useMemo } from 'react'
import { Telescope } from 'lucide-react'
import InputSection from './InputSection'
import ProgressTracker from './ProgressTracker'
import ProjectionChart from './ProjectionChart'
import { getInitialInputs } from '@/utils/inputFetcher'
import { generateProjectionData } from '@/utils/calculations'

const Dashboard = () => {
    const [inputs, setInputs] = useState(getInitialInputs);

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
                <div className="flex flex-col space-y-4 px-4 items-center md:items-start">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                    <div className="lg:col-span-1 space-y-6 transition-all duration-300">
                        <InputSection inputs={inputs} setInputs={setInputs} />
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
