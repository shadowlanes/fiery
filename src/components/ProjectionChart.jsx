import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'
import { formatCurrency } from '@/utils/calculations'

const ProjectionChart = ({ data, target }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Calculate total from payload to ensure we use the stacked values correctly
            const total = payload.reduce((sum, entry) => sum + entry.value, 0);

            return (
                <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-semibold mb-2">Year {label + new Date().getFullYear()}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="capitalize">{entry.name}:</span>
                            <span className="font-mono">{formatCurrency(entry.value)}</span>
                            <span className="text-muted-foreground">({((entry.value / total) * 100).toFixed(1)}%)</span>
                        </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-border flex justify-between font-bold text-sm">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Wealth Projection</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="year"
                                tickFormatter={(year) => year + new Date().getFullYear()}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                tickFormatter={(value) => `$${value}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} />
                            <ReferenceLine y={target} label="FIRE Target" stroke="hsl(var(--destructive))" strokeDasharray="3 3" />

                            {/* Stack order: Emergency (bottom) -> Safe -> High Risk (top) */}
                            <Area
                                type="monotone"
                                dataKey="emergency"
                                stackId="1"
                                stroke="hsl(var(--chart-1))"
                                fill="hsl(var(--chart-1))"
                                fillOpacity={0.9}
                                name="Emergency"
                            />
                            <Area
                                type="monotone"
                                dataKey="safe"
                                stackId="1"
                                stroke="hsl(var(--chart-2))"
                                fill="hsl(var(--chart-2))"
                                fillOpacity={0.9}
                                name="Safe Fund"
                            />
                            <Area
                                type="monotone"
                                dataKey="highRisk"
                                stackId="1"
                                stroke="hsl(var(--chart-3))"
                                fill="hsl(var(--chart-3))"
                                fillOpacity={0.9}
                                name="High Risk"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectionChart
