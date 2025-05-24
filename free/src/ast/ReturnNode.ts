import { ASTNode } from './ASTNode.js';
import { Context } from '../interpreter/Context.js';

/**
 * Nodo para la sentencia de transferencia "retornar" (return)
 */
export class ReturnNode implements ASTNode {
    private value: ASTNode | null;
    
    /**
     * @param value Valor a retornar (opcional)
     */
    constructor(value: ASTNode | null = null) {
        this.value = value;
    }
    
    interpret(context: Context): any {
        // Activar la bandera de retorno
        context.shouldReturn = true;
        
        // Establecer el valor de retorno si existe
        if (this.value) {
            context.returnValue = this.value.interpret(context);
        } else {
            context.returnValue = null;
        }
        
        return context.returnValue;
    }
    
    toString(): string {
        return 'ReturnNode';
    }
}
