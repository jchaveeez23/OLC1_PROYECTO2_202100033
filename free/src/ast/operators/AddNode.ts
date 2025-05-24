// src/ast/operators/AddNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operación de adición (+)
 */
export class AddNode implements ASTNode {
  constructor(private left: ASTNode, private right: ASTNode) {}

  interpret(ctx: Context): any {
    const leftValue = this.left.interpret(ctx);
    const rightValue = this.right.interpret(ctx);

    // Si alguno es string, concatenamos
    if (typeof leftValue === 'string' || typeof rightValue === 'string') {
      return String(leftValue) + String(rightValue);
    }

    // Si ambos son números, sumamos
    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue + rightValue;
    }

    throw new RuntimeError(`No se puede sumar ${leftValue} y ${rightValue}`);
  }
}
