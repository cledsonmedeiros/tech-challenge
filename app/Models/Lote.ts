import { DateTime } from "luxon";
import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Boleto from "./Boleto";

export default class Lote extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @column()
  public ativo: boolean;

  @hasMany(() => Boleto, {
    localKey: "id",
    foreignKey: "lote_id",
  })
  public boletos: HasMany<typeof Boleto>;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;
}
