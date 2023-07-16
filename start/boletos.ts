import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "BoletosController.index");
  Route.post("/importPDF", "BoletosController.importPDF");
}).prefix("boletos");

Route.group(() => {
  Route.post("/importCSV", "LotesController.importCSV");
}).prefix("lotes");
