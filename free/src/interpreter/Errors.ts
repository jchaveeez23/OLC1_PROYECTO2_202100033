// src/interpreter/Errors.ts

/**
 * Error lanzado durante la ejecución (runtime).
 */
export class RuntimeError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'RuntimeError';
    }
  }
  
  /**
   * Error semántico (por ejemplo uso inválido de tipos).
   */
  export class SemanticError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'SemanticError';
    }
  }
  