// src/ast/operators/DivNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operaciu00f3n de divisiu00f3n (/)
 */
export class DivNode implements ASTNode {
  constructor(private left: ASTNode, private right: ASTNode) {}

  interpret(ctx: Context): any {
    const leftValue = this.left.interpret(ctx);
    const rightValue = this.right.interpret(ctx);

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      if (rightValue === 0) {
        throw new RuntimeError('Divisiu00f3n por cero');
      }
      return leftValue / rightValue;
    }

    throw new RuntimeError(`No se puede dividir ${leftValue} por ${rightValue}`);
  }
}
