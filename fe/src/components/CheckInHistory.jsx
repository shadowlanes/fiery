import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { formatCurrency } from "@/utils/calculations";

const CheckInHistory = ({ history }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!history || history.length === 0) return null;

    return (
        <Card className="bg-slate-800/40 border-white/10 backdrop-blur-xl transition-all duration-300">
            <CardHeader
                className="py-4 cursor-pointer flex flex-row items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg font-semibold text-white/90">
                        Check-In History
                    </CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-white/5">
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
            </CardHeader>
            {isOpen && (
                <CardContent className="pt-0">
                    <div className="overflow-hidden rounded-xl border border-white/5">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Month</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Corpus Value</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date Logged</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-white/80">
                                            {item.month}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold text-primary">
                                            {formatCurrency(item.corpusValue)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

export default CheckInHistory;
