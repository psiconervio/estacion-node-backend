/*
  Warnings:

  - You are about to drop the column `averageWindSpeed` on the `DailyAverage` table. All the data in the column will be lost.
  - You are about to drop the column `averageWindSpeed` on the `MonthlyAverage` table. All the data in the column will be lost.
  - You are about to drop the column `windSpeed` on the `WeatherRecord` table. All the data in the column will be lost.
  - You are about to drop the column `averageWindSpeed` on the `WeeklyAverage` table. All the data in the column will be lost.
  - Added the required column `averageAnemometro` to the `DailyAverage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averagePluviomero` to the `DailyAverage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageVeleta` to the `DailyAverage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageAnemometro` to the `MonthlyAverage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averagePluviomero` to the `MonthlyAverage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageVeleta` to the `MonthlyAverage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anemometro` to the `WeatherRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pluviometro` to the `WeatherRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `veleta` to the `WeatherRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageAnemometro` to the `WeeklyAverage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averagePluviomero` to the `WeeklyAverage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageVeleta` to the `WeeklyAverage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyAverage" DROP COLUMN "averageWindSpeed",
ADD COLUMN     "averageAnemometro" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "averagePluviomero" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "averageVeleta" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyAverage" DROP COLUMN "averageWindSpeed",
ADD COLUMN     "averageAnemometro" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "averagePluviomero" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "averageVeleta" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeatherRecord" DROP COLUMN "windSpeed",
ADD COLUMN     "anemometro" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pluviometro" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "veleta" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeeklyAverage" DROP COLUMN "averageWindSpeed",
ADD COLUMN     "averageAnemometro" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "averagePluviomero" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "averageVeleta" TEXT NOT NULL;
