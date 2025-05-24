// src/ast/ArrayAccessNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';
import { RuntimeError } from '../interpreter/Errors';

/**
 * Nodo para acceso a índice: arrayExpr[indexExpr]
 */
export class ArrayAccessNode implements ASTNode {
  constructor(public arrayExpr: ASTNode, public indexExpr: ASTNode) {}

  interpret(ctx: Context): any {
    const arr = this.arrayExpr.interpret(ctx);
    const idx = this.indexExpr.interpret(ctx);

    if (!Array.isArray(arr)) {
      const err = new RuntimeError(`No es un array: ${arr}`);
      ctx.addError(err);
      return null;
    }
    if (typeof idx !== 'number' || !Number.isInteger(idx)) {
      const err = new RuntimeError(`Índice inválido: ${idx}`);
      ctx.addError(err);
      return null;
    }
    if (idx < 0 || idx >= arr.length) {
      const err = new RuntimeError(`Índice fuera de rango: ${idx}`);
      ctx.addError(err);
      return null;
    }

    return arr[idx];
  }
}
