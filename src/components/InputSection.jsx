import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/calculations"

const InputSection = ({ inputs, setInputs }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleAllocationChange = (name, value) => {
        setInputs(prev => ({
            ...prev,
            allocation: { ...prev.allocation, [name]: value }
        }));
    };

    const calculateAbsoluteAllocation = (percentage) => {
        return (percentage / 100) * inputs.initialCorpus;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Financial Inputs (k$)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="targetMultiple">Target FIRE Multiple (x)</Label>
                        <Input
                            id="targetMultiple"
                            name="targetMultiple"
                            type="number"
                            value={inputs.targetMultiple}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="initialCorpus">Initial Corpus (k$)</Label>
                        <Input
                            id="initialCorpus"
                            name="initialCorpus"
                            type="number"
                            value={inputs.initialCorpus}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="annualIncome">Annual Income (k$)</Label>
                        <Input
                            id="annualIncome"
                            name="annualIncome"
                            type="number"
                            value={inputs.annualIncome}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="annualExpense">Annual Expense (k$)</Label>
                        <Input
                            id="annualExpense"
                            name="annualExpense"
                            type="number"
                            value={inputs.annualExpense}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Asset Allocation</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Emergency Fund (%)</Label>
                            <div className="text-sm text-muted-foreground">
                                {inputs.allocation.emergency}% ({formatCurrency(calculateAbsoluteAllocation(inputs.allocation.emergency))})
                            </div>
                        </div>
                        <Slider
                            value={[inputs.allocation.emergency]}
                            onValueChange={(value) => handleAllocationChange('emergency', value[0])}
                            max={100}
                            step={1}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Alpha Trade (%)</Label>
                            <div className="text-sm text-muted-foreground">
                                {inputs.allocation.alpha}% ({formatCurrency(calculateAbsoluteAllocation(inputs.allocation.alpha))})
                            </div>
                        </div>
                        <Slider
                            value={[inputs.allocation.alpha]}
                            onValueChange={(value) => handleAllocationChange('alpha', value[0])}
                            max={100}
                            step={1}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Core Engine (%)</Label>
                            <div className="text-sm text-muted-foreground">
                                {inputs.allocation.core}% ({formatCurrency(calculateAbsoluteAllocation(inputs.allocation.core))})
                            </div>
                        </div>
                        <Slider
                            value={[inputs.allocation.core]}
                            onValueChange={(value) => handleAllocationChange('core', value[0])}
                            max={100}
                            step={1}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <details className="group">
                        <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                            <span>Advanced Inputs (Rates)</span>
                            <span className="transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rateEmergency">Emergency Rate (%)</Label>
                                <Input
                                    id="rateEmergency"
                                    type="number"
                                    value={inputs.rates.emergency}
                                    onChange={(e) => setInputs(prev => ({
                                        ...prev,
                                        rates: { ...prev.rates, emergency: Number(e.target.value) }
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rateAlpha">Alpha Rate (%)</Label>
                                <Input
                                    id="rateAlpha"
                                    type="number"
                                    value={inputs.rates.alpha}
                                    onChange={(e) => setInputs(prev => ({
                                        ...prev,
                                        rates: { ...prev.rates, alpha: Number(e.target.value) }
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rateCore">Core Rate (%)</Label>
                                <Input
                                    id="rateCore"
                                    type="number"
                                    value={inputs.rates.core}
                                    onChange={(e) => setInputs(prev => ({
                                        ...prev,
                                        rates: { ...prev.rates, core: Number(e.target.value) }
                                    }))}
                                />
                            </div>
                        </div>
                    </details>
                </div>
            </CardContent>
        </Card>
    )
}

export default InputSection
