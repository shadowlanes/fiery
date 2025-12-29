import React from 'react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/calculations"

const ProgressTracker = ({ current, target, yearsToFire, fireYear }) => {
    const percentage = Math.min(100, Math.max(0, (current / target) * 100));

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Progress to FIRE</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current: {formatCurrency(current)}</span>
                        <span className="font-bold">{percentage.toFixed(1)}%</span>
                        <span className="text-muted-foreground">Target: {formatCurrency(target)}</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <div className="text-center text-sm text-muted-foreground">
                        {yearsToFire === Infinity ? (
                            "Unreachable with current inputs"
                        ) : yearsToFire <= 0 ? (
                            "FIRE Achieved!"
                        ) : (
                            <span>
                                <span className="font-semibold text-foreground">{yearsToFire.toFixed(1)}</span> years remaining (Year {fireYear})
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProgressTracker
