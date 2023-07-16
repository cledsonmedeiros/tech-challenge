# Desafio técnico

Utilizei a versão 18.16.1 do nodejs.

Utilizei o client rest insomnia para envio das requisições. Deixarei um dump da coleção caso sejá necessário.

Instale as dependências do projeto com ```yarn install``` ou ```npm install```

Crie o arquivo ```.env``` a partir do arquivo ```.env.example```

PS.: Existe um arquivo ```docker-compose.yml``` que utilizei para subir rapidamente um banco de dados mysql. Utilizei o comando ```docker compose up -d``` e precisei ajustar as permissões do diretório ```.mysql-data``` com o comando ```sudo chmod -R 777 .mysql-data ``` algumas vezes durante a execução do projeto porque por algum motivo o meu usuário não tinha permissão de acesso a pasta e seus arquivos.

Com o banco de dados devidamente configurado rodar as migrations com o comando ```node ace migration:run```

Após isso rode o comando das seeds ```node ace db:seed```. Nesse momento serão preenchidos os lotes fictícios.

Inicie a aplicação com ```yarn dev``` ou ```npm run dev```

Envie uma requisição POST multipart form para a url http://localhost:3333/lotes/importCSV com campo ```csv_file``` e o arquivo ```input.csv``` que está na raiz do projeto. O arquivo deve ser importado corretamente, inserindo as linhas na tabela _boletos_.

Após isso rode novamente o comando das seeds ```node ace db:seed```. Nesse momento será criado o mapeamento relacionando o número da página do arquivo PDF e o id do boleto.

Envie uma requisição POST multipart form para a url http://localhost:3333/boletos/importPDF com campo ```pdf_file``` e o arquivo ```input.pdf``` que está na raiz do projeto. O arquivo deve ser importado corretamente, dividindo o arquivo PDF original em vários na pasta _tmp/pdf_.

Envie uma requisição GET para a url http://localhost:3333/boletos onde você poderá enviar parâmetros via query string como descrito no desafio para filtragem e geração do relatório em base64.

