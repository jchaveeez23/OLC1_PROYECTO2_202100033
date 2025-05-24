// src/ast/operators/SubNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operaciu00f3n de resta (-)
 */
export class SubNode implements ASTNode {
  constructor(private left: ASTNode, private right: ASTNode) {}

  interpret(ctx: Context): any {
    const leftValue = this.left.interpret(ctx);
    const rightValue = this.right.interpret(ctx);

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue - rightValue;
    }

    throw new RuntimeError(`No se puede restar ${leftValue} y ${rightValue}`);
  }
}
