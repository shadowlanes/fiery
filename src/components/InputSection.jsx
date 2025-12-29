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
                        <Label htmlFor="emergencyCorpus">Emergency Fund (Fixed k$)</Label>
                        <Input
                            id="emergencyCorpus"
                            name="emergencyCorpus"
                            type="number"
                            value={inputs.emergencyCorpus}
                            onChange={handleChange}
                            className="bg-[hsl(var(--chart-1))]/10 border-[hsl(var(--chart-1))]"
                        />
                    </div>

                    <div className="pt-2">
                        <Label className="text-sm text-muted-foreground">Investable: {formatCurrency(Math.max(0, inputs.initialCorpus - inputs.emergencyCorpus))}</Label>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Alpha Trade (%)</Label>
                            <div className="text-sm text-muted-foreground">
                                {inputs.allocation.alpha}% ({formatCurrency((Math.max(0, inputs.initialCorpus - inputs.emergencyCorpus) * inputs.allocation.alpha) / 100)})
                            </div>
                        </div>
                        <Slider
                            value={[inputs.allocation.alpha]}
                            onValueChange={(value) => {
                                const alpha = value[0];
                                const core = 100 - alpha;
                                setInputs(prev => ({
                                    ...prev,
                                    allocation: { alpha, core }
                                }));
                            }}
                            max={100}
                            step={1}
                            className="[&>span:first-child>span]:bg-[hsl(var(--chart-3))]"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Core Engine (%)</Label>
                            <div className="text-sm text-muted-foreground">
                                {inputs.allocation.core}% ({formatCurrency((Math.max(0, inputs.initialCorpus - inputs.emergencyCorpus) * inputs.allocation.core) / 100)})
                            </div>
                        </div>
                        <Slider
                            value={[inputs.allocation.core]}
                            onValueChange={(value) => {
                                const core = value[0];
                                const alpha = 100 - core;
                                setInputs(prev => ({
                                    ...prev,
                                    allocation: { alpha, core }
                                }));
                            }}
                            max={100}
                            step={1}
                            className="[&>span:first-child>span]:bg-[hsl(var(--chart-2))]"
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
