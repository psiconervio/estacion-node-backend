import sql from '../db.js';

export const createRecord = async (recordData) => {
  const { id, board, temperature, humidity, veleta, anemometro, pluviometro, createdAt } = recordData;
  const query = `
    INSERT INTO records (id, board, temperature, humidity, veleta, anemometro, pluviometro, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [id, board, temperature, humidity, veleta, anemometro, pluviometro, createdAt];
  const { rows } = await sql(query, values);
  return rows[0];
};
