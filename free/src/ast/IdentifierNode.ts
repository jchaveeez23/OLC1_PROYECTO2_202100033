// src/ast/IdentifierNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';
import { RuntimeError } from '../interpreter/Errors';

/**
 * Nodo para un identificador (variable).
 * Su interpretación lee el valor desde el Context.
 */
export class IdentifierNode implements ASTNode {
  constructor(public name: string) {}

  interpret(ctx: Context): any {
    try {
      return ctx.getVariable(this.name);
    } catch (e: any) {
      // Registramos el error y devolvemos null para continuar la ejecución
      const err = new RuntimeError(`Variable no definida: ${this.name}`);
      ctx.addError(err);
      return null;
    }
  }
}
