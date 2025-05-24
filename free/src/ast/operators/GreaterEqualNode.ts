// src/ast/operators/GreaterEqualNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operación de mayor o igual que (>=)
 */
export class GreaterEqualNode implements ASTNode {
  constructor(private left: ASTNode, private right: ASTNode) {}

  interpret(ctx: Context): any {
    const leftValue = this.left.interpret(ctx);
    const rightValue = this.right.interpret(ctx);

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue >= rightValue;
    }

    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return leftValue >= rightValue;
    }

    throw new RuntimeError(`No se puede comparar ${leftValue} >= ${rightValue}`);
  }
}
