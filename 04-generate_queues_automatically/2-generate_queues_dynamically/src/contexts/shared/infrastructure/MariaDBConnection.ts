import { Service } from "diod";
import { createPool, Pool, PoolConnection } from "mariadb";

@Service()
export class MariaDBConnection {
	private poolInstance: Pool | null = null;

	private get pool(): Pool {
		if (!this.poolInstance) {
			this.poolInstance = createPool({
				host: "localhost",
				user: "codely",
				password: "c0d3ly7v",
				database: "ecommerce",
			});
		}

		return this.poolInstance;
	}

	async searchOne<T>(query: string): Promise<T | null> {
		let conn: PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();
			const rows = await conn.query(query);

			return rows[0] ?? null;
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			if (conn) {
				await conn.release();
			}
		}
	}

	async searchAll<T>(query: string): Promise<T[]> {
		let conn: PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();

			return await conn.query(query);
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			if (conn) {
				await conn.release();
			}
		}
	}

	async execute(query: string): Promise<void> {
		let conn: PoolConnection | null = null;
		try {
			conn = await this.pool.getConnection();
			await conn.query(query);
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			if (conn) {
				await conn.release();
			}
		}
	}

	async close(): Promise<void> {
		if (this.poolInstance !== null) {
			await this.pool.end();
		}
	}
}
