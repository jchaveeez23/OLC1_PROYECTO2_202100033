import { ASTNode } from './ASTNode.js';
import { Context } from '../interpreter/Context.js';

/**
 * Nodo para la sentencia de transferencia "continuar" (continue)
 */
export class ContinueNode implements ASTNode {
    constructor() {}
    
    interpret(context: Context): any {
        // Activar la bandera de salto para continuar con la siguiente iteraciu00f3n
        context.shouldContinue = true;
        return null;
    }
    
    toString(): string {
        return 'ContinueNode';
    }
}
