// src/ast/literals/CharacterLiteralNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';

/**
 * Nodo para literales de carácter.
 * Almacena un único carácter y lo retorna en la interpretación.
 */
export class CharacterLiteralNode implements ASTNode {
  constructor(public value: string) {
    if (value.length !== 1) {
      throw new Error(`CharacterLiteralNode espera un solo carácter, recibió: "${value}"`);
    }
  }

  interpret(ctx: Context): any {
    return this.value;
  }
}
