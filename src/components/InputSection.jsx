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

    const handleSliderChange = (name, value) => {
        setInputs(prev => ({ ...prev, [name]: value[0] }));
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
                        <Label htmlFor="targetNumber">Target FIRE Number (k$)</Label>
                        <Input
                            id="targetNumber"
                            name="targetNumber"
                            type="number"
                            value={inputs.targetNumber}
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
                            max={100}
                            step={1}
                            onValueChange={(val) => setInputs(prev => ({
                                ...prev,
                                allocation: { ...prev.allocation, emergency: val[0] }
                            }))}
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
                            max={100}
                            step={1}
                            onValueChange={(val) => setInputs(prev => ({
                                ...prev,
                                allocation: { ...prev.allocation, alpha: val[0] }
                            }))}
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
                            max={100}
                            step={1}
                            onValueChange={(val) => setInputs(prev => ({
                                ...prev,
                                allocation: { ...prev.allocation, core: val[0] }
                            }))}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default InputSection
