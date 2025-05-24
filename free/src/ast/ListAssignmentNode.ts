// src/ast/ListAssignmentNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';
import { RuntimeError } from '../interpreter/Errors';

/**
 * Nodo para asignar valores a elementos de una lista
 */
export class ListAssignmentNode implements ASTNode {
  constructor(
    private name: string,
    private indices: ASTNode[],
    private value: ASTNode
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
    
    // Obtenemos el tipo de la lista
    const listType = ctx.getListType(this.name);
    
    // Evaluamos el valor a asignar
    const newValue = this.value.interpret(ctx);
    
    // Verificamos que el valor a asignar sea del tipo correcto
    if (!this.validateType(newValue, listType)) {
      throw new RuntimeError(`No se puede asignar un valor de tipo incorrecto a la lista de tipo '${listType}'`);
    }
    
    // Evaluamos cada uno de los u00edndices
    const indices = this.indices.map(index => {
      const value = index.interpret(ctx);
      
      // Verificamos que el u00edndice sea un nu00famero entero
      if (!Number.isInteger(value)) {
        throw new RuntimeError(`Los u00edndices de acceso a listas deben ser nu00fameros enteros`);
      }
      
      return value;
    });
    
    // Creamos una copia de la lista para modificarla
    const newList = JSON.parse(JSON.stringify(list));
    
    // Modificamos el elemento de la lista segu00fan los u00edndices
    try {
      this.modifyListElement(newList, indices, newValue);
      
      // Actualizamos la lista en el contexto
      ctx.assignVariable(this.name, newList);
      
      return newValue;
    } catch (error: any) {
      throw new RuntimeError(`Error al modificar la lista: ${error.message || 'u00cdndice inválido'}`);
    }
  }
  
  /**
   * Valida que un valor individual sea del tipo correcto
   */
  private validateType(value: any, type: string): boolean {
    switch (type.toLowerCase()) {
      case 'entero':
        return Number.isInteger(value);
      case 'decimal':
        return typeof value === 'number';
      case 'cadena':
        return typeof value === 'string';
      case 'caracter':
        return typeof value === 'string' && value.length === 1;
      case 'booleano':
        return typeof value === 'boolean';
      default:
        return false;
    }
  }
  
  /**
   * Modifica recursivamente un elemento de la lista segu00fan los u00edndices
   */
  private modifyListElement(list: any[], indices: number[], newValue: any): void {
    if (indices.length === 0) {
      throw new RuntimeError(`Se requieren u00edndices para acceder a la lista`);
    }
    
    const index = indices[0];
    
    // Verificamos que el u00edndice estu00e9 dentro de los lu00edmites
    if (index < 0 || index >= list.length) {
      throw new RuntimeError(`u00cdndice fuera de rango: ${index}`);
    }
    
    if (indices.length === 1) {
      // Si es el u00faltimo u00edndice, modificamos el valor
      list[index] = newValue;
      return;
    }
    
    // Accedemos al siguiente nivel de la lista
    const nextList = list[index];
    
    // Verificamos que sea una lista
    if (!Array.isArray(nextList)) {
      throw new RuntimeError(`No se puede acceder a mu00e1s dimensiones en este elemento`);
    }
    
    // Llamada recursiva con el resto de u00edndices
    this.modifyListElement(nextList, indices.slice(1), newValue);
  }
}
