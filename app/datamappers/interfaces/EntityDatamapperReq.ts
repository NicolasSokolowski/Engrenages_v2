import { Pool } from "pg";
import { TableNames } from "../../helpers/TableNames";

export interface EntityDatamapperReq {
  tableName: TableNames;
  pool: Pool;
  data: any;
  findByPk(id: number): Promise<EntityDatamapperReq["data"]>;
  findAll(): Promise<EntityDatamapperReq["data"][]>;
  findBySpecificField(field: string, value: string): Promise<EntityDatamapperReq["data"]>;
  insert(item: EntityDatamapperReq["data"]): Promise<EntityDatamapperReq["data"]>;
  update(item: EntityDatamapperReq["data"]): Promise<EntityDatamapperReq["data"]>;
  delete(id: number): Promise<EntityDatamapperReq["data"]>;
  checkIfUsed(fieldName: string, value: string): Promise<any>;
  checkIfNotNull(fieldName: string, id: number): Promise<any>;
}