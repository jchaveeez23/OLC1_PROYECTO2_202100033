// src/ast/operators/EqualNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';

/**
 * Nodo para la operaciu00f3n de igualdad (==)
 */
export class EqualNode implements ASTNode {
  constructor(private left: ASTNode, private right: ASTNode) {}

  interpret(ctx: Context): any {
    const leftValue = this.left.interpret(ctx);
    const rightValue = this.right.interpret(ctx);

    // Comparaciu00f3n flexible para soportar diferentes tipos
    return leftValue == rightValue;
  }
}
