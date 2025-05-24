import { ASTNode } from './ASTNode.js';
import { Context } from '../interpreter/Context.js';

/**
 * Nodo para la estructura de ciclo "repetir hasta"
 */
export class DoUntilNode implements ASTNode {
    private condition: ASTNode;
    private body: ASTNode[];
    
    /**
     * @param condition Condiciu00f3n de salida del ciclo
     * @param body Cuerpo del ciclo
     */
    constructor(condition: ASTNode, body: ASTNode[]) {
        this.condition = condition;
        this.body = body;
    }
    
    interpret(context: Context): any {
        // Crear un nuevo entorno para el ciclo
        context.pushEnvironment();
        
        let result = null;
        
        // Ejecutar el ciclo al menos una vez y luego verificar la condiciu00f3n
        do {
            // Ejecutar el cuerpo del ciclo en un nuevo entorno
            context.pushEnvironment();
            
            try {
                for (const statement of this.body) {
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
            
            // Continuar el ciclo hasta que la condiciu00f3n sea verdadera
        } while (!this.condition.interpret(context));
        
        context.popEnvironment(); // Limpiar el entorno del ciclo
        return result;
    }
    
    toString(): string {
        return 'DoUntilNode';
    }
}
