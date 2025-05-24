// src/ast/IfNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';

/**
 * Nodo para manejar estructuras condicionales (si-entonces-de lo contrario)
 */
export class IfNode implements ASTNode {
  /**
   * @param condition La condición a evaluar
   * @param thenBody Las instrucciones a ejecutar si la condición es verdadera
   * @param elseIfs Lista opcional de condiciones alternativas (o si) y sus cuerpos
   * @param elseBody Lista opcional de instrucciones a ejecutar si ninguna condición es verdadera
   */
  constructor(
    private condition: ASTNode,
    private thenBody: ASTNode[],
    private elseIfs: { condition: ASTNode; body: ASTNode[] }[] = [],
    private elseBody: ASTNode[] = []
  ) {}

  interpret(ctx: Context): any {
    // Evaluamos la condición principal
    const conditionResult = this.condition.interpret(ctx);
    
    // Si la condición es verdadera, ejecutamos el cuerpo principal
    if (conditionResult) {
      // Creamos un nuevo entorno para el bloque
      ctx.pushEnvironment();
      
      // Ejecutamos cada instrucción en el cuerpo principal
      let result = null;
      for (const instruction of this.thenBody) {
        result = instruction.interpret(ctx);
      }
      
      // Restauramos el entorno anterior
      ctx.popEnvironment();
      
      return result;
    }
    
    // Si la condición principal es falsa, evaluamos las condiciones "o si"
    for (const elseIf of this.elseIfs) {
      // Evaluamos la condición del "o si"
      const elseIfCondition = elseIf.condition.interpret(ctx);
      
      // Si esta condición es verdadera, ejecutamos su cuerpo
      if (elseIfCondition) {
        // Creamos un nuevo entorno para el bloque
        ctx.pushEnvironment();
        
        // Ejecutamos cada instrucción en este bloque
        let result = null;
        for (const instruction of elseIf.body) {
          result = instruction.interpret(ctx);
        }
        
        // Restauramos el entorno anterior
        ctx.popEnvironment();
        
        return result;
      }
    }
    
    // Si ninguna condición fue verdadera y hay un bloque "de lo contrario", lo ejecutamos
    if (this.elseBody.length > 0) {
      // Creamos un nuevo entorno para el bloque
      ctx.pushEnvironment();
      
      // Ejecutamos cada instrucción en el bloque "de lo contrario"
      let result = null;
      for (const instruction of this.elseBody) {
        result = instruction.interpret(ctx);
      }
      
      // Restauramos el entorno anterior
      ctx.popEnvironment();
      
      return result;
    }
    
    // Si no hay un bloque "de lo contrario" y ninguna condición fue verdadera, retornamos null
    return null;
  }
}
