// src/ast/operators/CastNode.ts
import { ASTNode } from '../ASTNode';
import { Context } from '../../interpreter/Context';
import { RuntimeError } from '../../interpreter/Errors';

/**
 * Nodo para operaciones de casteo (conversiun de tipos)
 */
export class CastNode implements ASTNode {
  constructor(
    private targetType: string,
    private expression: ASTNode
  ) {}

  interpret(ctx: Context): any {
    const value = this.expression.interpret(ctx);
    const targetType = this.targetType.toLowerCase();
    
    // Realizar el casteo segxfan el tipo destino
    switch (targetType) {
      case 'entero':
        return this.castToInteger(value);
      case 'decimal':
        return this.castToDecimal(value);
      case 'cadena':
        return this.castToString(value);
      case 'caracter':
        return this.castToCharacter(value);
      case 'booleano':
        return this.castToBoolean(value);
      default:
        throw new RuntimeError(`Tipo de destino no soportado para casteo: ${this.targetType}`);
    }
  }

  private castToInteger(value: any): number {
    if (typeof value === 'number') {
      return Math.floor(value); // Convertir a entero truncando
    } else if (typeof value === 'string' && value.length === 1) {
      // Casteo de caracter a entero (cundigo ASCII)
      return value.charCodeAt(0);
    } else {
      throw new RuntimeError(`No se puede convertir '${value}' a entero`);
    }
  }

  private castToDecimal(value: any): number {
    if (typeof value === 'number') {
      return value; // Ya es un nunmero, solo asegurarse que sea tratado como decimal
    } else if (typeof value === 'string' && value.length === 1) {
      // Casteo de caracter a decimal (cundigo ASCII como decimal)
      return value.charCodeAt(0);
    } else {
      throw new RuntimeError(`No se puede convertir '${value}' a decimal`);
    }
  }

  private castToString(value: any): string {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    } else {
      throw new RuntimeError(`No se puede convertir '${value}' a cadena`);
    }
  }

  private castToCharacter(value: any): string {
    if (typeof value === 'number') {
      // Convertir nunmero a carxe1cter ASCII
      if (value >= 0 && value <= 255) {
        return String.fromCharCode(value);
      } else {
        throw new RuntimeError(`El valor ${value} estxe1 fuera del rango ASCII (0-255)`);
      }
    } else {
      throw new RuntimeError(`No se puede convertir '${value}' a carxe1cter`);
    }
  }

  private castToBoolean(value: any): boolean {
    if (typeof value === 'number') {
      return value !== 0; // 0 es falso, cualquier otro nunmero es verdadero
    } else if (typeof value === 'string') {
      return value.length > 0; // Cadena vacnua es falso, cualquier otra es verdadero
    } else {
      throw new RuntimeError(`No se puede convertir '${value}' a booleano`);
    }
  }
}
