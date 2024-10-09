import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite3',
  entities: ["./src/model.ts"],
  migrations: ['./src/migrations/*.ts'],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source foi inicializado!");
  })
  .catch((err) => {
    console.error("Erro durante a inicialização do Data Source:", err);
  });
