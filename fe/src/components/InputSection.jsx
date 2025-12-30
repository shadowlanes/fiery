import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/calculations"
import { Save, Loader2 } from 'lucide-react'

const InputSection = ({ inputs, setInputs, onSave, isAuthenticated }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Financial Inputs (k$)</CardTitle>
                    {isAuthenticated && (
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            size="sm"
                            className="gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Goal
                                </>
                            )}
                        </Button>
                    )}
                </div>
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

                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="emergencyCorpus" className="whitespace-nowrap">Emergency Fund</Label>
                        <Input
                            id="emergencyCorpus"
                            name="emergencyCorpus"
                            type="number"
                            value={inputs.emergencyCorpus}
                            onChange={handleChange}
                            className="bg-[hsl(var(--chart-1))]/10 border-[hsl(var(--chart-1))] w-24 text-right"
                        />
                    </div>

                    <div className="pt-2">
                        <Label className="text-sm text-muted-foreground">Investable: {formatCurrency(Math.max(0, inputs.initialCorpus - inputs.emergencyCorpus))}</Label>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>High Risk (%)</Label>
                            <div className="text-sm text-muted-foreground">
                                {inputs.allocation.highRisk}% ({formatCurrency((Math.max(0, inputs.initialCorpus - inputs.emergencyCorpus) * inputs.allocation.highRisk) / 100)})
                            </div>
                        </div>
                        <Slider
                            value={[inputs.allocation.highRisk]}
                            onValueChange={(value) => {
                                const highRisk = value[0];
                                const safe = 100 - highRisk;
                                setInputs(prev => ({
                                    ...prev,
                                    allocation: { highRisk, safe }
                                }));
                            }}
                            max={100}
                            step={1}
                            className="[&>span:first-child>span]:bg-[hsl(var(--chart-3))]"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Safe Fund (%)</Label>
                            <div className="text-sm text-muted-foreground">
                                {inputs.allocation.safe}% ({formatCurrency((Math.max(0, inputs.initialCorpus - inputs.emergencyCorpus) * inputs.allocation.safe) / 100)})
                            </div>
                        </div>
                        <Slider
                            value={[inputs.allocation.safe]}
                            onValueChange={(value) => {
                                const safe = value[0];
                                const highRisk = 100 - safe;
                                setInputs(prev => ({
                                    ...prev,
                                    allocation: { highRisk, safe }
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
                                <Label htmlFor="rateEmergency">Emergency</Label>
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
                                <Label htmlFor="rateHighRisk">High Risk</Label>
                                <Input
                                    id="rateHighRisk"
                                    type="number"
                                    value={inputs.rates.highRisk}
                                    onChange={(e) => setInputs(prev => ({
                                        ...prev,
                                        rates: { ...prev.rates, highRisk: Number(e.target.value) }
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rateSafe">Safe Fund</Label>
                                <Input
                                    id="rateSafe"
                                    type="number"
                                    value={inputs.rates.safe}
                                    onChange={(e) => setInputs(prev => ({
                                        ...prev,
                                        rates: { ...prev.rates, safe: Number(e.target.value) }
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
