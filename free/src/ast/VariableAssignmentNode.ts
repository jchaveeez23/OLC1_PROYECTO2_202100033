// src/ast/VariableAssignmentNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';
import { RuntimeError } from '../interpreter/Errors';

/**
 * Nodo para la asignaciu00f3n de variables
 */
export class VariableAssignmentNode implements ASTNode {
  constructor(
    private name: string | string[],
    private value: ASTNode | ASTNode[]
  ) {}

  interpret(ctx: Context): any {
    // Si es una asignaciu00f3n mu00faltiple (array de nombres)
    if (Array.isArray(this.name)) {
      // Verificar que tengamos valores suficientes
      if (!Array.isArray(this.value)) {
        throw new RuntimeError(`Se esperaba una lista de expresiones para la asignaciu00f3n mu00faltiple`);
      }

      if (this.name.length !== this.value.length) {
        throw new RuntimeError(`La cantidad de variables (${this.name.length}) no coincide con la cantidad de valores (${this.value.length})`);
      }

      // Asignar cada variable con su valor correspondiente
      for (let i = 0; i < this.name.length; i++) {
        const varName = this.name[i];
        const varValue = this.value[i].interpret(ctx);
        
        // Verificar que la variable exista
        if (!ctx.variableExists(varName)) {
          throw new RuntimeError(`La variable '${varName}' no ha sido declarada`);
        }
        
        ctx.assignVariable(varName, varValue);
      }
      return null;
    }
    
    // Si es una asignaciu00f3n simple (un solo nombre)
    if (Array.isArray(this.value)) {
      throw new RuntimeError(`Se proporciona una lista de valores para una sola variable`);
    }

    // Verificar que la variable exista
    if (!ctx.variableExists(this.name)) {
      throw new RuntimeError(`La variable '${this.name}' no ha sido declarada`);
    }
    
    const value = this.value.interpret(ctx);
    ctx.assignVariable(this.name, value);
    return null;
  }
}
