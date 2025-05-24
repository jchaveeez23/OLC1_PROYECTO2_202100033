// src/interpreter/Environment.ts

/**
 * Representa un ámbito (scope) de ejecución,
 * con posibles scopes anidados (parent).
 */
export class Environment {
    private values: Map<string, any> = new Map();
  
    constructor(public parent: Environment | null = null) {}
  
    /**
     * Define una nueva variable en este scope.
     * Lanza error si ya existe en el mismo scope.
     */
    define(name: string, value: any): void {
      if (this.values.has(name)) {
        throw new Error(`Variable "${name}" ya definida en este ámbito.`);
      }
      this.values.set(name, value);
    }
  
    /**
     * Asigna un valor a una variable existente.
     * Si no existe aquí, delega al parent. Si no lo encuentra, lanza error.
     */
    assign(name: string, value: any): void {
      if (this.values.has(name)) {
        this.values.set(name, value);
      } else if (this.parent) {
        this.parent.assign(name, value);
      } else {
        throw new Error(`Variable "${name}" no definida.`);
      }
    }
  
    /**
     * Obtiene el valor de una variable.
     * Si no existe en este scope, busca en parent.
     */
    get(name: string): any {
      if (this.values.has(name)) {
        return this.values.get(name);
      }
      if (this.parent) {
        return this.parent.get(name);
      }
      throw new Error(`Variable "${name}" no definida.`);
    }
  
    /**
     * Verifica si una variable existe en este scope o en alguno de sus padres.
     */
    exists(name: string): boolean {
      if (this.values.has(name)) {
        return true;
      }
      if (this.parent) {
        return this.parent.exists(name);
      }
      return false;
    }
  }