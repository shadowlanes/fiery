import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { formatCurrency } from '@/utils/calculations'

const ProjectionChart = ({ data, target }) => {
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
                            <Tooltip
                                formatter={(value, name) => [formatCurrency(value), name]}
                                labelFormatter={(year) => `Year ${year + new Date().getFullYear()}`}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                            />
                            <ReferenceLine y={target} label="FIRE Target" stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                            <Area
                                type="monotone"
                                dataKey="emergency"
                                stackId="1"
                                stroke="hsl(var(--chart-1))"
                                fill="hsl(var(--chart-1))"
                                fillOpacity={0.6}
                                name="Emergency"
                            />
                            <Area
                                type="monotone"
                                dataKey="core"
                                stackId="1"
                                stroke="hsl(var(--chart-2))"
                                fill="hsl(var(--chart-2))"
                                fillOpacity={0.6}
                                name="Core Engine"
                            />
                            <Area
                                type="monotone"
                                dataKey="alpha"
                                stackId="1"
                                stroke="hsl(var(--chart-3))"
                                fill="hsl(var(--chart-3))"
                                fillOpacity={0.6}
                                name="Alpha Trade"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectionChart
