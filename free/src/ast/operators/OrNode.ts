// src/ast/operators/OrNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';

/**
 * Nodo para la operaciu00f3n lu00f3gica OR (||)
 */
export class OrNode implements ASTNode {
  constructor(private left: ASTNode, private right: ASTNode) {}

  interpret(ctx: Context): any {
    const leftValue = this.left.interpret(ctx);
    
    // Evaluaciu00f3n perezosa (short-circuit)
    if (leftValue) {
      return true;
    }
    
    return Boolean(this.right.interpret(ctx));
  }
}
