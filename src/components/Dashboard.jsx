import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputSection from './InputSection'
import ProgressTracker from './ProgressTracker'
import ProjectionChart from './ProjectionChart'
import { generateProjectionData, calculateYearsToTarget } from '@/utils/calculations'

const Dashboard = () => {
    const [inputs, setInputs] = useState({
        targetMultiple: 25, // x annual expense
        initialCorpus: 250, // k$
        annualIncome: 150, // k$ (example default)
        annualExpense: 60, // k$ (example default)
        allocation: {
            emergency: 1,
            alpha: 32,
            core: 67,
        }
    });

    const monthlyContribution = useMemo(() => {
        const contribution = Math.max(0, inputs.annualIncome - inputs.annualExpense) / 12;
        return contribution;
    }, [inputs.annualIncome, inputs.annualExpense]);

    const targetNumber = useMemo(() => {
        return inputs.targetMultiple * inputs.annualExpense;
    }, [inputs.targetMultiple, inputs.annualExpense]);

    const { yearsToFire, fireYear } = useMemo(() => {
        const years = calculateYearsToTarget(
            inputs.initialCorpus,
            monthlyContribution,
            0.07, // Expected rate
            targetNumber
        );
        const currentYear = new Date().getFullYear();
        return {
            yearsToFire: years,
            fireYear: Math.floor(currentYear + years)
        };
    }, [inputs.initialCorpus, monthlyContribution, targetNumber]);

    const projectionData = useMemo(() => {
        // Inputs are in k$, so calculations will be in k$
        return generateProjectionData(
            inputs.initialCorpus,
            monthlyContribution,
            targetNumber
        );
    }, [inputs.initialCorpus, monthlyContribution, targetNumber]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Personal FIRE Dashboard</h1>
                <p className="text-muted-foreground">Track your path to Financial Independence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <InputSection inputs={inputs} setInputs={setInputs} />
                    <ProgressTracker
                        current={inputs.initialCorpus}
                        target={targetNumber}
                        yearsToFire={yearsToFire}
                        fireYear={fireYear}
                    />
                </div>

                <div className="lg:col-span-2">
                    <ProjectionChart data={projectionData} target={targetNumber} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
