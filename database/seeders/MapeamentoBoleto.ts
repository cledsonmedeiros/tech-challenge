import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Boleto from "App/Models/Boleto";
import Database from "@ioc:Adonis/Lucid/Database";
import MapeamentoBoleto from "App/Models/MapeamentoBoleto";

export default class extends BaseSeeder {
  public async run() {
    const result = await Database.from(Boleto.table)
      .count("* as total")
      .first();

    const totalCount = result?.total ?? 0;

    if (totalCount > 0) {
      console.log("Criando mapeamento de boletos");
      await MapeamentoBoleto.createMany([
        {
          pagina: 1,
          boleto_id: 3,
        },
        {
          pagina: 2,
          boleto_id: 1,
        },
        {
          pagina: 3,
          boleto_id: 2,
        },
      ]);
    } else {
      console.log("Não há boletos cadastrados, pulando mapeamento de boletos");
    }
  }
}
