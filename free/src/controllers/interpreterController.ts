// src/controllers/interpretController.ts
import { Request, Response } from 'express';
import { Interpreter } from '../interpreter/Interpreter';

export const interpret = (req: Request, res: Response): void => {
  const code = req.body.code;
  // 1️⃣ Validación básica
  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Debe enviar un campo "code" de tipo string en el body.' });
    return;
  }

  try {
    let parser = require('../languaje/parser')
    // 2️⃣ Parseo a AST
    const ast = parser.parse(code);

    // 3️⃣ Instanciar el intérprete y ejecutar
    const interpreter = new Interpreter();
    const result = interpreter.run(ast);
    const outputs = interpreter.getOutputs();
    console.log(">>> OUT:", outputs);


    // 4️⃣ Recuperar errores (si los hay)
    const errors = interpreter.getErrors();

    // 5️⃣ Respuesta JSON con AST, resultado y errores
    res.status(200).json({
      success: true,
      ast,            // opcional, para debug puedes quitar en producción
      result,         // valor devuelto por la última instrucción
      errors,         // lista de RuntimeError registrados
      outputs
    });
  } catch (err: any) {
    console.error('Error en el intérprete:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: err.message || err.toString()
    });
  }
};
