import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Lote from "./Lote";

export default class Boleto extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome_sacado: string;

  @column()
  public valor: number;

  @column()
  public linha_digitavel: string;

  @column()
  public ativo: boolean;

  @column()
  public lote_id: number;

  @hasOne(() => Lote, {
    foreignKey: "id",
    localKey: "lote_id",
  })
  public lote: HasOne<typeof Lote>;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;
}
