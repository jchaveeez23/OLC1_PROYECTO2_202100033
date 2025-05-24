// src/ast/literals/StringLiteralNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';

/**
 * Nodo para literales de cadena.
 */
export class StringLiteralNode implements ASTNode {
  constructor(public value: string) {}

  interpret(ctx: Context): any {
    return this.value;
  }
}
