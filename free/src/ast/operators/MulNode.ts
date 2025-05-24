// src/ast/operators/MulNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operaciu00f3n de multiplicaciu00f3n (*)
 */
export class MulNode implements ASTNode {
  constructor(private left: ASTNode, private right: ASTNode) {}

  interpret(ctx: Context): any {
    const leftValue = this.left.interpret(ctx);
    const rightValue = this.right.interpret(ctx);

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue * rightValue;
    }

    throw new RuntimeError(`No se puede multiplicar ${leftValue} y ${rightValue}`);
  }
}
