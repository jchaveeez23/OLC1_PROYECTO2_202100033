// src/ast/operators/IncrementNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para la operación de incremento (inc)
 */
export class IncrementNode implements ASTNode {
  constructor(private expression: ASTNode) {}

  interpret(ctx: Context): any {
    // Si la expresión es un identificador, incrementamos la variable
    if (this.expression.constructor.name === 'IdentifierNode') {
      const identifierNode = this.expression as any;
      const variableName = identifierNode.name;
      
      // Verificar que la variable exista
      if (!ctx.variableExists(variableName)) {
        throw new RuntimeError(`La variable '${variableName}' no ha sido declarada`);
      }
      
      // Obtener el valor actual
      const currentValue = ctx.getVariable(variableName);
      
      // Verificar que sea un número
      if (typeof currentValue !== 'number') {
        throw new RuntimeError(`No se puede incrementar el valor '${currentValue}' porque no es un número`);
      }
      
      // Incrementar y asignar
      const newValue = currentValue + 1;
      ctx.assignVariable(variableName, newValue);
      return newValue;
    } else {
      // Si no es un identificador, evaluamos la expresión
      const value = this.expression.interpret(ctx);
      
      // Verificar que sea un número
      if (typeof value !== 'number') {
        throw new RuntimeError(`No se puede incrementar el valor '${value}' porque no es un número`);
      }
      
      // Simplemente devolvemos el valor incrementado sin asignarlo
      return value + 1;
    }
  }
}
