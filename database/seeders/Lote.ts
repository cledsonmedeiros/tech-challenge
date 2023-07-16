import Database from "@ioc:Adonis/Lucid/Database";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Lote from "App/Models/Lote";

export default class extends BaseSeeder {
  public async run() {
    const result = await Database.from(Lote.table).count("* as total").first();

    const totalCount = result?.total ?? 0;

    if (totalCount === 0) {
      console.log("Criando lotes...");

      await Lote.fetchOrCreateMany("nome", [
        {
          nome: "0010",
        },
        {
          nome: "0011",
        },
        {
          nome: "0012",
        },
        {
          nome: "0013",
        },
        {
          nome: "0014",
        },
        {
          nome: "0015",
        },
        {
          nome: "0016",
        },
        {
          nome: "0017",
        },
        {
          nome: "0018",
        },
        {
          nome: "0019",
        },
        {
          nome: "0020",
        },
      ]);
    } else {
      console.log("Já existem lotes cadastrados, pulando criação de lotes...");
    }
  }
}
