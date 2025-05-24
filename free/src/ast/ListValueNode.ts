// src/ast/ListValueNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';

/**
 * Nodo para representar los valores de una lista
 */
export class ListValueNode implements ASTNode {
  constructor(private elements: ASTNode[]) {}

  interpret(ctx: Context): any[] {
    return this.elements.map(element => {
      if (element instanceof Array) {
        return element.map(el => {
          if (el instanceof Array) {
            return el.map(e => e.interpret(ctx));
          }
          return el.interpret(ctx);
        });
      }

      return element.interpret(ctx);;
    });
  }
}