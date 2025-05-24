// src/ast/ASTNode.ts
import { Context } from '../interpreter/Context';

/**
 * Interfaz base para todos los nodos del AST.
 * Cada nodo debe implementar un método interpret
 * que reciba el contexto de ejecución.
 */
export interface ASTNode {
  interpret(ctx: Context): any;
}
