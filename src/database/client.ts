import 'dotenv/config';
import mysql from 'mysql2/promise';
import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { env } from '../config/env';

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export type DatabaseConnection = typeof pool | PoolConnection;
export type SqlParam = string | number | bigint | boolean | Date | null | Buffer | Uint8Array;

export const queryRows = async <TRow extends RowDataPacket[]>(
  sql: string,
  params: SqlParam[] = [],
  connection: DatabaseConnection = pool
): Promise<TRow> => {
  const [rows] = await connection.query<TRow>(sql, params);
  return rows;
};

export const execute = async (
  sql: string,
  params: SqlParam[] = [],
  connection: DatabaseConnection = pool
): Promise<ResultSetHeader> => {
  const [result] = await connection.execute<ResultSetHeader>(sql, params);
  return result;
};

export const withTransaction = async <T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
