# Servidor Express con Intu00e9rprete

Este es un servidor base de Express utilizando TypeScript, con una estructura escalable y una ruta configurada para un intu00e9rprete.

## Estructura del Proyecto

```
- src/
  - controllers/   # Controladores de la aplicaciu00f3n
  - routes/        # Definiciones de rutas
  - middleware/    # Funciones de middleware
  - models/        # Modelos de datos
  - services/      # Lu00f3gica de negocio
  - utils/         # Funciones utilidades
  - app.ts         # Configuraciu00f3n de Express
  - server.ts      # Punto de entrada
- tests/           # Pruebas
- .gitignore
- package.json
- tsconfig.json
- README.md
```

## Instalaciu00f3n

```bash
npm install
```

## Comandos Disponibles

```bash
# Ejecutar en modo desarrollo
npm run dev

# Compilar el proyecto
npm run build

# Ejecutar la versiu00f3n compilada
npm start
```

## Rutas API

- `GET /` - Ruta principal
- `POST /interpreter` - Envu00eda cu00f3digo a interpretar
- `GET /interpreter/status` - Verifica el estado del intu00e9rprete
