import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const InputSection = ({ inputs, setInputs }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSliderChange = (name, value) => {
        setInputs(prev => ({ ...prev, [name]: value[0] }));
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Financial Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="targetNumber">Target FIRE Number ($)</Label>
                        <Input
                            id="targetNumber"
                            name="targetNumber"
                            type="number"
                            value={inputs.targetNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="initialCorpus">Initial Corpus ($)</Label>
                        <Input
                            id="initialCorpus"
                            name="initialCorpus"
                            type="number"
                            value={inputs.initialCorpus}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
                        <Input
                            id="monthlyContribution"
                            name="monthlyContribution"
                            type="number"
                            value={inputs.monthlyContribution}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Asset Allocation</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Emergency Fund (%)</Label>
                            <span className="text-sm text-muted-foreground">{inputs.allocation.emergency}%</span>
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
                            <span className="text-sm text-muted-foreground">{inputs.allocation.alpha}%</span>
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
                            <span className="text-sm text-muted-foreground">{inputs.allocation.core}%</span>
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
