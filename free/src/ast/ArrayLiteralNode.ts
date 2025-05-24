// src/ast/ArrayLiteralNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';

/**
 * Nodo para literales de array: [a, b, c, ...]
 */
export class ArrayLiteralNode implements ASTNode {
  constructor(public elements: ASTNode[]) {}

  interpret(ctx: Context): any {
    // Interpretamos cada elemento y devolvemos el array JS
    return this.elements.map(el => el.interpret(ctx));
  }
}
