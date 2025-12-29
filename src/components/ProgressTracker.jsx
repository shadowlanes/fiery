import React from 'react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/calculations"

const ProgressTracker = ({ current, target, yearsToFire, fireYear }) => {
    const percentage = Math.min(100, Math.max(0, (current / target) * 100));

    return (
        <Card className="border-primary/20 bg-primary/5 shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground uppercase tracking-wider">Progress to FIRE</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold tracking-tight text-primary">
                                    {yearsToFire === Infinity ? "∞" : yearsToFire.toFixed(1)}
                                </span>
                                <span className="text-xl text-muted-foreground font-medium">years remaining</span>
                            </div>
                            {yearsToFire !== Infinity && (
                                <div className="text-sm text-muted-foreground mt-1 font-medium">
                                    Target Date: <span className="text-foreground">Year {fireYear}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{percentage.toFixed(1)}% Complete</span>
                                <span>{formatCurrency(target)} Goal</span>
                            </div>
                            <Progress value={percentage} className="h-4 w-full bg-primary/20" indicatorClassName="bg-primary" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Current: {formatCurrency(current)}</span>
                                <span>Needs: {formatCurrency(target - current)} more</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center p-4 bg-background/50 rounded-lg border border-border/50">
                        <div className="text-center space-y-1">
                            <p className="text-sm text-muted-foreground">Freedom Number</p>
                            <p className="text-3xl font-bold text-foreground">{formatCurrency(target)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProgressTracker
