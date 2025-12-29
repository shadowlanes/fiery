import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputSection from './InputSection'
import ProgressTracker from './ProgressTracker'
import ProjectionChart from './ProjectionChart'
import { generateProjectionData } from '@/utils/calculations'

const Dashboard = () => {
    const [inputs, setInputs] = useState({
        targetNumber: 2250000,
        initialCorpus: 250000,
        monthlyContribution: 7500,
        allocation: {
            emergency: 1,
            alpha: 32, // $80k / $250k = 32%
            core: 67,
        }
    });

    const projectionData = useMemo(() => {
        return generateProjectionData(
            inputs.initialCorpus,
            inputs.monthlyContribution,
            inputs.targetNumber
        );
    }, [inputs.initialCorpus, inputs.monthlyContribution, inputs.targetNumber]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Personal FIRE Dashboard</h1>
                <p className="text-muted-foreground">Track your path to Financial Independence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <InputSection inputs={inputs} setInputs={setInputs} />
                    <ProgressTracker current={inputs.initialCorpus} target={inputs.targetNumber} />
                </div>

                <div className="lg:col-span-2">
                    <ProjectionChart data={projectionData} target={inputs.targetNumber} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
