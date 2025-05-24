// src/ast/operators/PowNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operaciu00f3n de potencia (^)
 */
export class PowNode implements ASTNode {
  constructor(private base: ASTNode, private exponent: ASTNode) {}

  interpret(ctx: Context): any {
    const baseValue = this.base.interpret(ctx);
    const exponentValue = this.exponent.interpret(ctx);

    if (typeof baseValue === 'number' && typeof exponentValue === 'number') {
      return Math.pow(baseValue, exponentValue);
    }

    throw new RuntimeError(`No se puede calcular potencia de ${baseValue} elevado a ${exponentValue}`);
  }
}
