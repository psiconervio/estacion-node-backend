-- CreateTable
CREATE TABLE "DailyAverage" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "averageTemp" DOUBLE PRECISION NOT NULL,
    "averageHumidity" DOUBLE PRECISION NOT NULL,
    "averageWindSpeed" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyAverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyAverage" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "averageTemp" DOUBLE PRECISION NOT NULL,
    "averageHumidity" DOUBLE PRECISION NOT NULL,
    "averageWindSpeed" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyAverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyAverage" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "averageTemp" DOUBLE PRECISION NOT NULL,
    "averageHumidity" DOUBLE PRECISION NOT NULL,
    "averageWindSpeed" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyAverage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyAverage" ADD CONSTRAINT "DailyAverage_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyAverage" ADD CONSTRAINT "WeeklyAverage_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyAverage" ADD CONSTRAINT "MonthlyAverage_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
