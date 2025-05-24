import express, { Application, Request, Response } from 'express';
import cors from 'cors';

// Importamos las rutas
// Utiliza una ruta relativa más explícita
import router from './routes/interpreter';
// Nota: Aunque usamos .js en la importación, TypeScript lo resolverá correctamente

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    // Middlewares
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // Ruta para el intérprete
    this.app.use('/interpreter', router);

    // Ruta principal
    this.app.get('/', (req: Request, res: Response) => {
      res.send('API funcionando correctamente :)');
    });
  }
}

export default new App().app;
