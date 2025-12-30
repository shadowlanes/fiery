-- CreateTable
CREATE TABLE "checkin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "corpusValue" DOUBLE PRECISION NOT NULL,
    "month" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checkin_userId_month_key" ON "checkin"("userId", "month");
