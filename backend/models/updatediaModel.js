import prisma from '../config/db.js';

export const getAllRecords = async () => {
  return await prisma.esp3201TableRecord.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });
};

export const findRecordByDate = async (fecha) => {
  return await prisma.esp3201TableUpdatedia.findUnique({
    where: { fecha },
  });
};

export const createUpdatedRecord = async (data) => {
  return await prisma.esp3201TableUpdatedia.create({ data });
};
