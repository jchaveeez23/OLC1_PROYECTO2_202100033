// src/ast/VariableDeclarationNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';
import { RuntimeError } from '../interpreter/Errors';

/**
 * Nodo para la declaración de variables
 */
export class VariableDeclarationNode implements ASTNode {
  constructor(
    private name: string | string[],
    private type: string,
    private initialValue?: ASTNode | ASTNode[]
  ) {}

  interpret(ctx: Context): any {
    // Si es una declaración múltiple (array de nombres)
    if (Array.isArray(this.name)) {
      // Verificar que tengamos la misma cantidad de valores que variables
      if (this.initialValue !== undefined && Array.isArray(this.initialValue)) {
        if (this.name.length !== this.initialValue.length) {
          throw new RuntimeError(`La cantidad de variables (${this.name.length}) no coincide con la cantidad de valores (${this.initialValue.length})`);
        }
        
        // Declarar cada variable con su valor correspondiente
        for (let i = 0; i < this.name.length; i++) {
          const value = this.initialValue[i].interpret(ctx);
          ctx.declareVariable(this.name[i], this.type, value);
        }
      } else {
        // Declaración múltiple sin valor inicial
        for (const varName of this.name) {
          ctx.declareVariable(varName, this.type);
        }
      }
      return null;
    } 
    
    // Si es una declaración simple (un solo nombre)
    if (this.initialValue !== undefined && !Array.isArray(this.initialValue)) {
      const value = this.initialValue.interpret(ctx);
      ctx.declareVariable(this.name, this.type, value);
    } else {
      ctx.declareVariable(this.name, this.type);
    }
    
    return null;
  }
}
