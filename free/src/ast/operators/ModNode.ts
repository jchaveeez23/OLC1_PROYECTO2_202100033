// src/ast/operators/ModNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operaciu00f3n de mu00f3dulo (%)
 */
export class ModNode implements ASTNode {
  constructor(private left: ASTNode, private right: ASTNode) {}

  interpret(ctx: Context): any {
    const leftValue = this.left.interpret(ctx);
    const rightValue = this.right.interpret(ctx);

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      if (rightValue === 0) {
        throw new RuntimeError('Operaciu00f3n de mu00f3dulo con divisor cero');
      }
      return leftValue % rightValue;
    }

    throw new RuntimeError(`No se puede calcular mu00f3dulo entre ${leftValue} y ${rightValue}`);
  }
}
