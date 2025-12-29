import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputSection from './InputSection'
import ProgressTracker from './ProgressTracker'
import ProjectionChart from './ProjectionChart'
import { generateProjectionData } from '@/utils/calculations'

const Dashboard = () => {
    const [inputs, setInputs] = useState({
        targetMultiple: 25, // x annual expense
        initialCorpus: 250, // k$
        emergencyCorpus: 40, // k$
        annualIncome: 150, // k$ (example default)
        annualExpense: 60, // k$ (example default)
        allocation: {
            alpha: 32,
            core: 68,
        },
        rates: {
            emergency: 1,
            alpha: 10,
            core: 6,
        }
    });

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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Personal FIRE Dashboard</h1>
                <p className="text-muted-foreground">Track your path to Financial Independence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <InputSection inputs={inputs} setInputs={setInputs} />
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <ProgressTracker
                        current={inputs.initialCorpus}
                        target={targetNumber}
                        yearsToFire={yearsToFire}
                        fireYear={fireYear}
                    />
                    <ProjectionChart data={projectionData} target={targetNumber} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
