import { EntityDatamapperReq } from "./index.datamappers";


export abstract class CoreDatamapper<T extends EntityDatamapperReq> {
  abstract tableName: T["tableName"];
  abstract pool: T["pool"];

  findByPk = async (id: number) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE "id" = $1`,
      [id]
    );
    return result.rows[0];
  };

  findAll = async () => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}";`
    );
    return result.rows;
  }

  findBySpecificField = async (field: string, value: string) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE ${field} = $1`,
      [value]
    );
    return result.rows[0];
  }

  insert = async (entityObject: T["data"]) => {
    const result = await this.pool.query(
      `SELECT * FROM create_${this.tableName}($1)`,
      [entityObject]
    );
    return result.rows[0];
  }

  update = async (entityObject: T["data"]) => {
    const result = await this.pool.query(
      `SELECT * FROM update_${this.tableName}($1)`,
      [entityObject]
    );
    return result.rows[0];
  }

  delete = async (id: number) => {
    const result = await this.pool.query(
      `SELECT * FROM delete_${this.tableName}($1)`,
      [id]
    );
    return result.rows[0];
  }

  checkIfUsed = async(fieldName: string, value: string) => {
    const result = await this.pool.query(
      `SELECT 1 FROM ${this.tableName} WHERE ${fieldName} = $1`,
      [value]
    );
    return result.rows;
  }

  checkIfNotNull = async (fieldName: string, id: number) => {
    const result = await this.pool.query(
      `SELECT 1 FROM ${this.tableName} WHERE ${fieldName} IS NOT NULL AND "id" = $1`,
      [id]
    );
    return result.rows;
  }
}