import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/calculations"

const ProjectionChart = ({ data, target }) => {
    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Wealth Projection</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
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
                        <defs>
                            <linearGradient id="colorAggressive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="year"
                            stroke="hsl(var(--muted-foreground))"
                            tickFormatter={(value) => `Year ${value}`}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                        />
                        <ReferenceLine y={target} label="FIRE Target" stroke="hsl(var(--destructive))" strokeDasharray="3 3" />

                        <Area
                            type="monotone"
                            dataKey="aggressive"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorAggressive)"
                            name="Aggressive (10%)"
                            stackId="1"
                        />
                        <Area
                            type="monotone"
                            dataKey="expected"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorExpected)"
                            name="Expected (7%)"
                            stackId="2"
                        />
                        <Area
                            type="monotone"
                            dataKey="conservative"
                            stroke="#f59e0b"
                            fillOpacity={1}
                            fill="url(#colorConservative)"
                            name="Conservative (5%)"
                            stackId="3"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default ProjectionChart
