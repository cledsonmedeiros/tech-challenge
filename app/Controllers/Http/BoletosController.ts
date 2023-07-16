import Application from "@ioc:Adonis/Core/Application";
import { cuid } from "@ioc:Adonis/Core/Helpers";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import MapeamentoBoleto from "App/Models/MapeamentoBoleto";
import Boleto from "App/Models/Boleto";

export default class BoletosController {
  public async index({ request, response }: HttpContextContract) {
    const qs = request.qs();

    const boletoQuery = Boleto.query();

    if (Object.keys(qs).includes("nome")) {
      boletoQuery.where("nome_sacado", "like", `%${qs.nome}%`);
    }

    if (Object.keys(qs).includes("valor_inicial")) {
      qs.valor_inicial = Number(qs.valor_inicial);
      boletoQuery.where("valor", ">=", qs.valor_inicial);
    }

    if (Object.keys(qs).includes("valor_final")) {
      qs.valor_final = Number(qs.valor_final);

      boletoQuery.where("valor", "<=", qs.valor_final);
    }

    if (Object.keys(qs).includes("lote_id")) {
      boletoQuery.where("lote_id", qs.lote_id);
    }

    const boletos = await boletoQuery;

    if (Object.keys(qs).includes("relatorio") && qs.relatorio == "1") {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 7;

      const { width, height } = page.getSize();

      const table = {
        x: 50,
        y: height - 100,
        width: width - 100,
        columnCount: 5,
        rowCount: boletos.length + 1,
        columnWidths: (width - 100) / 5,
        rowHeights: Array(boletos.length + 1).fill(30),
      };

      const content = boletos.map((boleto) => {
        return [
          boleto.id,
          boleto.nome_sacado,
          boleto.lote_id,
          boleto.valor,
          boleto.linha_digitavel,
        ];
      });

      content.unshift(["ID", "Nome", "Lote", "Valor", "Linha Digitável"]);

      const tableWidth = table.width;
      const tableHeight = table.rowCount * table.rowHeights[0];

      // Desenhe as linhas horizontais
      for (let i = 0; i <= table.rowCount; i++) {
        const currentY = table.y - i * (tableHeight / table.rowCount);
        page.drawLine({
          start: { x: table.x, y: currentY },
          end: { x: table.x + tableWidth, y: currentY },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      }

      // Desenhe as linhas verticais
      for (let i = 0; i <= table.columnCount; i++) {
        const currentX = table.x + i * (tableWidth / table.columnCount);
        page.drawLine({
          start: { x: currentX, y: table.y },
          end: { x: currentX, y: table.y - tableHeight },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      }

      // Preencha as células com o conteúdo
      for (let row = 0; row < table.rowCount; row++) {
        for (let col = 0; col < table.columnCount; col++) {
          const text = String(content[row][col]);
          const cellX = table.x + col * (tableWidth / table.columnCount);
          const cellY =
            table.y -
            row * (tableHeight / table.rowCount) -
            table.rowHeights[row];

          page.drawText(text, {
            x: cellX + 5,
            y: cellY + 5,
            font,
            size: fontSize,
          });
        }
      }

      // page.drawText("Olá, Mundo!", { x: 50, y: 500, font });
      const pdfBytes = await pdfDoc.save();

      const base64 = Buffer.from(pdfBytes).toString("base64");

      return response.ok({
        base64,
      });
    }

    return response.ok(boletos);
  }

  public async importPDF({ request, response }: HttpContextContract) {
    const pdf_file = request.file("pdf_file", {
      extnames: ["pdf"],
    });

    if (!pdf_file) {
      return response.badRequest({
        error: "Arquivo PDF não informado.",
      });
    }

    if (pdf_file.hasErrors) {
      return response.badRequest({
        errors: pdf_file.errors,
      });
    }

    const hashed_file = `${cuid()}.${pdf_file.extname}`;

    await pdf_file.move(Application.tmpPath("uploads"), {
      name: hashed_file,
    });

    const file_path = Application.tmpPath(`uploads/${hashed_file}`);

    const pdfBytes = fs.readFileSync(file_path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pageCount = pdfDoc.getPageCount();

    try {
      for (let pageNumber = 0; pageNumber < pageCount; pageNumber += 1) {
        const pagina = pageNumber + 1;
        const mapeamento = await MapeamentoBoleto.findByOrFail(
          "pagina",
          pagina
        );

        const newPdfDoc = await PDFDocument.create();
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber]);
        newPdfDoc.addPage(copiedPage);

        const newPdfBytes = await newPdfDoc.save();
        const newFileName = `${mapeamento.boleto_id}.pdf`;
        const newFilePath = Application.tmpPath(`pdf/${newFileName}`);

        if (!fs.existsSync(path.dirname(newFilePath))) {
          fs.mkdirSync(path.dirname(newFilePath), { recursive: true });
        }

        fs.writeFileSync(newFilePath, newPdfBytes);
      }
    } catch (error) {
      return response.badRequest({
        error: "Erro ao importar arquivo PDF.",
      });
    }

    return response.ok({
      message: "Arquivo PDF importado com sucesso.",
    });
  }
}
