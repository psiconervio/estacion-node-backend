/*
  Warnings:

  - You are about to drop the `Esp3201TableRecordDiaMensual` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Esp3201TableRecordDiaSemanal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `esp3201TableRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `esp3201TableUpdatedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Esp3201TableRecordDiaMensual";

-- DropTable
DROP TABLE "Esp3201TableRecordDiaSemanal";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "esp3201TableRecord";

-- DropTable
DROP TABLE "esp3201TableUpdatedia";

-- CreateTable
CREATE TABLE "Station" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherRecord" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeatherRecord" ADD CONSTRAINT "WeatherRecord_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
