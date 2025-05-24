// src/ast/ListDeclarationNode.ts
import { ASTNode } from './ASTNode';
import { Context } from '../interpreter/Context';
import { RuntimeError } from '../interpreter/Errors';

/**
 * Nodo para la declaraciu00f3n de listas/vectores
 */
export class ListDeclarationNode implements ASTNode {
  constructor(
    private dimensions: number,
    private type: string,
    private name: string,
    private initialValues?: ASTNode
  ) {}

  interpret(ctx: Context): any {
    let values = null;
    
    if (this.initialValues) {
      values = this.initialValues.interpret(ctx);
      
      // Validamos que las dimensiones coincidan
      if (!this.validateDimensions(values, this.dimensions)) {
        throw new RuntimeError(
          `La lista de valores no coincide con las dimensiones especificadas. Se esperaban ${this.dimensions} dimensiones.`
        );
      }
      
      // Validamos que todos los elementos sean del tipo correcto
      if (!this.validateTypes(values, this.type)) {
        throw new RuntimeError(
          `La lista contiene valores de un tipo incorrecto. Se esperaban valores de tipo ${this.type}.`
        );
      }
    } else {
      // Si no hay valores iniciales, creamos una lista vacu00eda con las dimensiones adecuadas
      values = this.createEmptyList(this.dimensions);
    }
    
    // Declaramos la variable en el contexto como una lista
    ctx.declareList(this.name, this.type, this.dimensions, values);
    
    return null;
  }
  
  /**
   * Valida que la estructura de datos tenga las dimensiones correctas
   */
  private validateDimensions(values: any, dimensions: number, level: number = 1): boolean {
    if (dimensions === 1) {
      return Array.isArray(values);
    }
    
    if (!Array.isArray(values)) {
      return false;
    }
    
    if (level === dimensions) {
      return true;
    }
    
    // Validamos que todos los elementos del array sean arrays (para la siguiente dimensiu00f3n)
    return values.every((item) => this.validateDimensions(item, dimensions, level + 1));
  }
  
  /**
   * Valida que todos los elementos de la lista sean del tipo correcto
   */
  private validateTypes(values: any, type: string): boolean {
    if (!Array.isArray(values)) {
      return this.validateType(values, type);
    }
    
    return values.every((item) => 
      Array.isArray(item) 
        ? this.validateTypes(item, type) 
        : this.validateType(item, type)
    );
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
   * Crea una lista vacu00eda con las dimensiones especificadas
   */
  private createEmptyList(dimensions: number): any[] {
    if (dimensions === 1) {
      return [];
    }
    
    return [this.createEmptyList(dimensions - 1)];
  }
}
