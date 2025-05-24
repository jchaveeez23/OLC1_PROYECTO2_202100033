// src/ast/literals/NumberLiteralNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';

/**
 * Nodo para literales numéricos.
 */
export class NumberLiteralNode implements ASTNode {
  constructor(public value: number) {}

  interpret(ctx: Context): any {
    return this.value;
  }
}
