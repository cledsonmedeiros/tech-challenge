import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Boleto from "./Boleto";

export default class MapeamentoBoleto extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public boleto_id: number;

  @column()
  public pagina: number;

  @hasOne(() => Boleto, {
    foreignKey: "id",
    localKey: "boleto_id",
  })
  public boleto: HasOne<typeof Boleto>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
