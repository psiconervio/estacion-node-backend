-- AlterTable
ALTER TABLE "DailyAverage" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'America/Argentina/Buenos_Aires';

-- AlterTable
ALTER TABLE "MonthlyAverage" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'America/Argentina/Buenos_Aires';

-- AlterTable
ALTER TABLE "Station" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'America/Argentina/Buenos_Aires';

-- AlterTable
ALTER TABLE "WeatherRecord" ALTER COLUMN "recordedAt" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'America/Argentina/Buenos_Aires',
ALTER COLUMN "pluviometro" DROP NOT NULL,
ALTER COLUMN "veleta" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WeeklyAverage" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'America/Argentina/Buenos_Aires';
