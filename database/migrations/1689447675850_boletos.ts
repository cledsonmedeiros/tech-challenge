import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "boletos";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table.string("nome_sacado", 255).notNullable();
      table.decimal("valor", 10, 2).notNullable();
      table.string("linha_digitavel", 255).notNullable();
      table.boolean("ativo").defaultTo(true);

      table
        .integer("lote_id")
        .unsigned()
        .references("id")
        .inTable("lotes")
        .onDelete("CASCADE");

      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
