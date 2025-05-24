// src/ast/ProgramNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';

/**
 * Nodo raíz que agrupa una lista de sentencias/instrucciones.
 * Al interpretarlo, ejecuta cada declaración en orden.
 */
export class ProgramNode implements ASTNode {
  constructor(public statements: ASTNode[]) {}

  interpret(ctx: Context): any {
    let result: any;
    for (const stmt of this.statements) {
      result = stmt.interpret(ctx);
    }
    return result;
  }
}
