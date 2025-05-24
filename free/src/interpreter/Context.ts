// src/interpreter/Context.ts

// Importar desde archivos relativos en la misma carpeta
import { Environment } from './Environment';
import { RuntimeError } from './Errors';

export class Context {
  private globalEnv: Environment;
  private environments: Environment[];
  private currentEnv: Environment;
  public errors: RuntimeError[] = [];
  public output: string[] = []; // Para almacenar las salidas de imprimir
  
  // Banderas para sentencias de transferencia
  public shouldBreak: boolean = false;
  public shouldContinue: boolean = false;
  public shouldReturn: boolean = false;
  public returnValue: any = null;

  /**
   * Constructor del contexto con un entorno global inicial
   */
  constructor() {
    this.globalEnv = new Environment(null);
    this.environments = [];
    this.currentEnv = this.globalEnv;
    this.environments.push(this.currentEnv);
    this.output = [];
  }
  
  /**
   * Crea un nuevo entorno y lo establece como el entorno actual
   */
  pushEnvironment(): void {
    const newEnv = new Environment(this.currentEnv);
    this.environments.push(newEnv);
    this.currentEnv = newEnv;
  }
  
  /**
   * Elimina el entorno actual y establece el entorno anterior como el actual
   */
  popEnvironment(): void {
    if (this.environments.length <= 1) {
      throw new RuntimeError('No se puede eliminar el entorno global');
    }
    
    this.environments.pop();
    this.currentEnv = this.environments[this.environments.length - 1];
  }

  enterScope(): void {
    this.pushEnvironment();
  }

  exitScope(): void {
    this.popEnvironment();
  }

  /**
   * Declara una variable con su tipo y valor opcional
   */
  declareVariable(name: string, type: string, value?: any): void {
    // Verificar si la variable ya existe en el scope actual
    if (this.currentEnv.exists(name)) {
      throw new RuntimeError(`La variable '${name}' ya ha sido declarada en este ámbito`);
    }
    
    // Creamos un objeto que almacena el tipo y el valor
    this.currentEnv.define(name, {
      type: type,
      value: value === undefined ? this.getDefaultValueForType(type) : value
    });
  }
  
  /**
   * Verifica si una variable existe en cualquier ámbito accesible
   */
  variableExists(name: string): boolean {
    return this.currentEnv.exists(name);
  }
  
  /**
   * Declara una lista con su tipo, dimensiones y valores opcionales
   */
  declareList(name: string, type: string, dimensions: number, values: any[] = []): void {
    // Verificar si la variable ya existe en el scope actual
    if (this.currentEnv.exists(name)) {
      throw new RuntimeError(`La variable '${name}' ya ha sido declarada en este ámbito`);
    }
    
    // Creamos un objeto que almacena el tipo, las dimensiones y los valores
    this.currentEnv.define(name, {
      type: type,
      dimensions: dimensions,
      isList: true,
      value: values
    });
  }

  /**
   * Obtiene el tipo de una lista
   */
  getListType(name: string): string {
    if (!this.variableExists(name)) {
      throw new RuntimeError(`La variable '${name}' no ha sido declarada`);
    }
    
    const variable = this.currentEnv.get(name);
    
    if (!variable.isList) {
      throw new RuntimeError(`La variable '${name}' no es una lista`);
    }
    
    return variable.type;
  }
  
  /**
   * Obtiene las dimensiones de una lista
   */
  getListDimensions(name: string): number {
    if (!this.variableExists(name)) {
      throw new RuntimeError(`La variable '${name}' no ha sido declarada`);
    }
    
    const variable = this.currentEnv.get(name);
    
    if (!variable.isList) {
      throw new RuntimeError(`La variable '${name}' no es una lista`);
    }
    
    return variable.dimensions;
  }
  
  /**
   * Obtiene el valor por defecto según el tipo de dato
   */
  private getDefaultValueForType(type: string): any {
    switch (type.toLowerCase()) {
      case 'entero':
        return 0;
      case 'decimal':
        return 0.0;
      case 'cadena':
        return '';
      case 'caracter':
        return '';
      case 'booleano':
        return false;
      default:
        return null;
    }
  }

  /**
   * Asigna un valor a una variable existente (usado por el ciclo 'para')
   */
  assignValue(name: string, value: any): void {
    // Buscar la variable en todos los entornos, empezando por el actual
    let env = this.currentEnv;
    
    while (env !== null) {
      if (env.exists(name)) {
        env.define(name, { value: value });
        return;
      }
      
      if (env.parent) {
        env = env.parent;
      } else {
        break;
      }
    }
    
    // Si no existe, la declaramos como una variable implícita en el entorno actual
    const type = typeof value === 'number' ? 'entero' : typeof value === 'string' ? 'cadena' : 'booleano';
    this.declareVariable(name, type, value);
  }

  /**
   * Asigna un valor a una variable existente
   */
  assignVariable(name: string, value: any): void {
    if (!this.variableExists(name)) {
      throw new RuntimeError(`La variable '${name}' no ha sido declarada`);
    }
    
    // Obtener la información actual de la variable
    const variable = this.currentEnv.get(name);
    
    // Actualizar solo el valor, manteniendo el tipo
    variable.value = value;
    this.currentEnv.assign(name, variable);
  }

  /**
   * Obtiene el valor de una variable (usado por el ciclo 'para')
   */
  getValue(name: string): any {
    let env: Environment | null = this.currentEnv;
  
    while (env !== null) {
      if (env.exists(name)) {
        const variable = env.get(name);
        if (variable.value === undefined || variable.value === null) {
          this.addError(new RuntimeError(`La variable '${name}' no tiene un valor asignado`));
          return null;
        }
        return variable.value;
      }
  
      env = env.parent;
    }
  
    this.addError(new RuntimeError(`Variable '${name}' no declarada`));
    return null;
  }
  
  

  /**
   * Obtiene el valor de una variable
   */
  getVariable(name: string): any {
    if (!this.variableExists(name)) {
      throw new RuntimeError(`La variable '${name}' no ha sido declarada`);
    }

    return this.currentEnv.get(name).value;
  }

  /**
   * Agrega un mensaje a la lista de salidas del intérprete
   */
  addOutput(output: string): void {
    this.output.push(output);
  }

  /**
   * Agrega un error a la lista de errores
   */
  addError(error: RuntimeError): void {
    this.errors.push(error);
  }
}
