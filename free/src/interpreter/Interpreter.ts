// src/interpreter/Interpreter.ts

import { ASTNode } from '../ast/ASTNode';
import { Context } from './Context';
import { RuntimeError } from './Errors';

/**
 * Punto de entrada al intérprete.
 * Recibe el AST (nodo raíz) y ejecuta su método interpret.
 */
export class Interpreter {
  private ctx: Context;

  constructor() {
    this.ctx = new Context();
  }

  /**
   * Ejecuta el AST completo y retorna el resultado de la última instrucción.
   * En caso de errores de ejecución, los agrega al contexto.
   */
  run(root: ASTNode): any {
    try {
      return root.interpret(this.ctx);
  
    } catch (e: any) {
      if (e instanceof RuntimeError) {
        this.ctx.addError(e);
      } else {
        // Convierte cualquier error inesperado en RuntimeError para que sea manejado
        const wrapped = new RuntimeError(e.message || 'Error de ejecución desconocido');
        this.ctx.addError(wrapped);
      }
      return null;
    }
  }
  

  /**
   * Permite acceder a los errores acumulados tras la ejecución.
   */
  getErrors(): RuntimeError[] {
    return this.ctx.errors;
  }

  getOutputs(): string[] {
    return this.ctx.output;
  }
}
