import prisma from '../config/db.js';

export const createRecord = async (data) => {
  return await prisma.esp3201TableRecord.create({ data });
};