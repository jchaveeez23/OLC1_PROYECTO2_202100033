// src/ast/literals/BooleanLiteralNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';

/**
 * Nodo para literales booleanos.
 */
export class BooleanLiteralNode implements ASTNode {
  constructor(public value: boolean) {}

  interpret(ctx: Context): any {
    return this.value;
  }
}
