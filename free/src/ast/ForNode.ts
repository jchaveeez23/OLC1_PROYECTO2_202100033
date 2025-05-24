import { ASTNode } from './ASTNode.js';
import { Context } from '../interpreter/Context.js';

/**
 * Nodo para la estructura de ciclo "para"
 */
export class ForNode implements ASTNode {
    private variable: string;
    private initialValue: ASTNode;
    private finalValue: ASTNode;
    private increment: ASTNode;
    private isDecrement: boolean;
    private body: ASTNode[];
    
    /**
     * @param variable Nombre de la variable de control
     * @param initialValue Valor inicial
     * @param finalValue Valor final
     * @param increment Expresiu00f3n de incremento/decremento
     * @param isDecrement Indica si es incremento o decremento
     * @param body Cuerpo del ciclo
     */
    constructor(variable: string, initialValue: ASTNode, finalValue: ASTNode, increment: ASTNode, isDecrement: boolean, body: ASTNode[]) {
        this.variable = variable;
        this.initialValue = initialValue;
        this.finalValue = finalValue;
        this.increment = increment;
        this.isDecrement = isDecrement;
        this.body = body;
    }
    
    interpret(context: Context): any {
        // Crear un nuevo entorno para el ciclo
        context.pushEnvironment();
        
        // Inicializar la variable de control
        const initialValue = this.initialValue.interpret(context);
        context.assignValue(this.variable, initialValue);
        
        // Evaluar el valor final
        const finalValue = this.finalValue.interpret(context);
        
        let result = null;
        
        // Ejecutar el ciclo
        while (true) {
            // Verificar la condiciu00f3n de salida
            const currentValue = context.getValue(this.variable);
            
            if (this.isDecrement) {
                if (currentValue < finalValue) break;
            } else {
                if (currentValue > finalValue) break;
            }
            
            // Ejecutar el cuerpo del ciclo en un nuevo entorno
            context.pushEnvironment();
            
            try {
                for (const statement of this.body) {
                    console.log("Interpretando sentencia:", statement);
                    result = statement.interpret(context);
                    
                    // Verificar si se encontru00f3 una sentencia de transferencia
                    if (context.shouldBreak) {
                        context.shouldBreak = false;
                        context.popEnvironment(); // Salir del entorno del cuerpo
                        context.popEnvironment(); // Salir del entorno del ciclo
                        return result;
                    }
                    
                    if (context.shouldContinue) {
                        context.shouldContinue = false;
                        break;
                    }
                    
                    if (context.shouldReturn) {
                        context.popEnvironment(); // Salir del entorno del cuerpo
                        context.popEnvironment(); // Salir del entorno del ciclo
                        return context.returnValue;
                    }
                }
            } finally {
                context.popEnvironment(); // Limpiar el entorno del cuerpo
            }
            
            // Aplicar el incremento/decremento
            console.log("Incrementando/decrementando:", this.increment);
            this.increment.interpret(context);
        }
        
        context.popEnvironment(); // Limpiar el entorno del ciclo
        return result;
    }
    
    toString(): string {
        return 'ForNode';
    }
}
