import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const CheckInWidget = ({ onCheckIn, currentCorpus }) => {
    const [value, setValue] = useState(currentCorpus || '');
    const [isSaving, setIsSaving] = useState(false);

    const getCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const currentMonth = getCurrentMonth();

    const handleSave = async () => {
        if (!value || isNaN(value)) {
            toast.error("Please enter a valid corpus value");
            return;
        }

        setIsSaving(true);
        try {
            await onCheckIn(parseFloat(value), currentMonth);
            toast.success(`Check-in for ${currentMonth} successful!`);
        } catch (error) {
            console.error('Check-in failed:', error);
            toast.error(error.message || 'Check-in failed');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Monthly Check-In
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Update your current corpus for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p>
                <div className="space-y-2">
                    <Label htmlFor="checkin-corpus">Current Corpus (k$)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="checkin-corpus"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="e.g. 255"
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Check-In'
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CheckInWidget;
