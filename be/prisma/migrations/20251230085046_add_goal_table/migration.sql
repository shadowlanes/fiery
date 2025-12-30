-- CreateTable
CREATE TABLE "goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetMultiple" DOUBLE PRECISION NOT NULL,
    "initialCorpus" DOUBLE PRECISION NOT NULL,
    "emergencyCorpus" DOUBLE PRECISION NOT NULL,
    "annualIncome" DOUBLE PRECISION NOT NULL,
    "annualExpense" DOUBLE PRECISION NOT NULL,
    "allocationHighRisk" DOUBLE PRECISION NOT NULL,
    "allocationSafe" DOUBLE PRECISION NOT NULL,
    "rateEmergency" DOUBLE PRECISION NOT NULL,
    "rateHighRisk" DOUBLE PRECISION NOT NULL,
    "rateSafe" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "goal_userId_key" ON "goal"("userId");
