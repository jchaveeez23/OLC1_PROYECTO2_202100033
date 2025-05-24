// src/ast/ListAccessNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';
import { RuntimeError } from '../interpreter/Errors';

/**
 * Nodo para acceder a elementos de una lista
 */
export class ListAccessNode implements ASTNode {
  constructor(
    private name: string,
    private indices: ASTNode[]
  ) {}

  interpret(ctx: Context): any {
    // Verificamos que la variable exista
    if (!ctx.variableExists(this.name)) {
      throw new RuntimeError(`La lista '${this.name}' no ha sido declarada`);
    }
    
    // Obtenemos la lista del contexto
    const list = ctx.getVariable(this.name);
    
    // Verificamos que sea una lista
    if (!Array.isArray(list)) {
      throw new RuntimeError(`'${this.name}' no es una lista`);
    }
    
    // Evaluamos cada uno de los índices
    const indices = this.indices.map(index => {
      const value = index.interpret(ctx);
      
      // Verificamos que el índice sea un número entero
      if (!Number.isInteger(value)) {
        throw new RuntimeError(`Los índices de acceso a listas deben ser números enteros`);
      }
      
      return value;
    });
    
    // Accedemos al elemento de la lista según los índices
    try {
      return this.accessListElement(list, indices);
    } catch (error: any) {
      throw new RuntimeError(`Error al acceder a la lista: ${error.message || 'Índice inválido'}`);
    }
  }
  
  /**
   * Accede recursivamente a un elemento de la lista según los índices
   */
  private accessListElement(list: any[], indices: number[]): any {
    if (indices.length === 0) {
      return list;
    }
    
    const index = indices[0];
    
    // Verificamos que el índice esté dentro de los límites
    if (index < 0 || index >= list.length) {
      throw new RuntimeError(`Índice fuera de rango: ${index}`);
    }
    
    if (indices.length === 1) {
      return list[index];
    }
    
    // Accedemos al siguiente nivel de la lista
    const nextList = list[index];
    
    // Verificamos que sea una lista
    if (!Array.isArray(nextList)) {
      throw new RuntimeError(`No se puede acceder a más dimensiones en este elemento`);
    }
    
    // Llamada recursiva con el resto de índices
    return this.accessListElement(nextList, indices.slice(1));
  }
}
