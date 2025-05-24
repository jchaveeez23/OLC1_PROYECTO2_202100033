// src/ast/operators/DecrementNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operaciu00f3n de decremento (dec)
 */
export class DecrementNode implements ASTNode {
  constructor(private expression: ASTNode) {}

  interpret(ctx: Context): any {
    // Si la expresiu00f3n es un identificador, decrementamos la variable
    if (this.expression.constructor.name === 'IdentifierNode') {
      const identifierNode = this.expression as any;
      const variableName = identifierNode.name;
      
      // Verificar que la variable exista
      if (!ctx.variableExists(variableName)) {
        throw new RuntimeError(`La variable '${variableName}' no ha sido declarada`);
      }
      
      // Obtener el valor actual
      const currentValue = ctx.getVariable(variableName);
      
      // Verificar que sea un nu00famero
      if (typeof currentValue !== 'number') {
        throw new RuntimeError(`No se puede decrementar el valor '${currentValue}' porque no es un nu00famero`);
      }
      
      // Decrementar y asignar
      const newValue = currentValue - 1;
      ctx.assignVariable(variableName, newValue);
      return newValue;
    } else {
      // Si no es un identificador, evaluamos la expresiu00f3n
      const value = this.expression.interpret(ctx);
      
      // Verificar que sea un nu00famero
      if (typeof value !== 'number') {
        throw new RuntimeError(`No se puede decrementar el valor '${value}' porque no es un nu00famero`);
      }
      
      // Simplemente devolvemos el valor decrementado sin asignarlo
      return value - 1;
    }
  }
}
