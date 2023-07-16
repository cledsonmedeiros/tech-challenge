import Application from "@ioc:Adonis/Core/Application";
import { cuid } from "@ioc:Adonis/Core/Helpers";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import fs from "fs";
import { parse } from "fast-csv";
// const csv = require("fast-csv");

import Lote from "App/Models/Lote";

export default class LotesController {
  public async importCSV({ request, response }: HttpContextContract) {
    const csv_file = request.file("csv_file", {
      extnames: ["csv"],
    });

    if (!csv_file) {
      return response.badRequest({
        error: "Arquivo CSV não informado.",
      });
    }

    if (csv_file.hasErrors) {
      return response.badRequest({
        errors: csv_file.errors,
      });
    }

    const delimiter = request.input("delimiter", ";");

    const hashed_file = `${cuid()}.${csv_file.extname}`;

    await csv_file.move(Application.tmpPath("uploads"), {
      name: hashed_file,
    });

    const file_path = Application.tmpPath(`uploads/${hashed_file}`);

    let imported_lines = 0;

    await new Promise((resolve, reject) => {
      fs.createReadStream(file_path)
        .pipe(parse({ headers: true, delimiter }))
        .on("data", async ({ nome, unidade, valor, linha_digitavel }) => {
          console.log({ nome, unidade, valor, linha_digitavel });

          const nome_unidade = String(unidade).padStart(4, "0");

          const lote = await Lote.findByOrFail("nome", nome_unidade);

          await lote.related("boletos").create({
            nome_sacado: nome,
            valor: Number(valor),
            linha_digitavel,
          });

          imported_lines += 1;
        })
        .on("end", () => {
          return resolve(true);
        })
        .on("error", (err) => {
          return reject(err);
        });
    }).catch(async () => {
      return response.badRequest({
        error: "Erro ao importar arquivo CSV.",
      });
    });

    return response.ok({
      message: "Arquivo CSV importado com sucesso.",
    });
  }
}
