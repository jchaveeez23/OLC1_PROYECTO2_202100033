// src/ast/PrintNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';

/**
 * Nodo para la instrucciu00f3n de imprimir.
 * Evalu00faa la expresiu00f3n y muestra su resultado.
 */
export class PrintNode implements ASTNode {
  constructor(private expression: ASTNode) {}

  interpret(ctx: Context): any {
    const value = this.expression.interpret(ctx);
    console.log(value);
    ctx.addOutput(value.toString());
    return null;
  }
}
