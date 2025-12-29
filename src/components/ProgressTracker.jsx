import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { formatCurrency } from "@/utils/calculations"
import { getShareUrl } from "@/utils/inputFetcher"
import { toast } from "sonner"

const ProgressTracker = ({ inputs, current, target, yearsToFire, fireYear }) => {
    const percentage = Math.min(100, Math.max(0, (current / target) * 100));

    const handleShare = () => {
        const url = getShareUrl(inputs);
        navigator.clipboard.writeText(url).then(() => {
            toast.success("Configuration URL copied to clipboard!");
        });
    };

    return (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold text-muted-foreground uppercase tracking-widest">Progress to FIRE</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share Configuration</span>
                </Button>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-6xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                                    {yearsToFire === Infinity ? "∞" : yearsToFire.toFixed(1)}
                                </span>
                                <span className="text-xl text-muted-foreground font-semibold">years remaining</span>
                            </div>
                            {yearsToFire !== Infinity && (
                                <div className="text-sm text-muted-foreground mt-2 font-medium">
                                    Target Date: <span className="text-foreground font-semibold">Year {fireYear}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-semibold">
                                <span>{percentage.toFixed(1)}% Complete</span>
                                <span className="text-primary">{formatCurrency(target)} Goal</span>
                            </div>
                            <Progress value={percentage} className="h-5 w-full bg-primary/20 shadow-inner" indicatorClassName="bg-gradient-to-r from-primary to-primary/80 transition-all duration-500" />
                            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                <span>Current: <span className="text-foreground">{formatCurrency(current)}</span></span>
                                <span>Needs: <span className="text-foreground">{formatCurrency(target - current)}</span> more</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background/80 to-background/40 rounded-xl border-2 border-primary/20 shadow-md">
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Freedom Number</p>
                            <p className="text-4xl font-extrabold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{formatCurrency(target)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProgressTracker
