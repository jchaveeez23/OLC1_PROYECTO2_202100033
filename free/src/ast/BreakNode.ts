import { ASTNode } from './ASTNode.js';
import { Context } from '../interpreter/Context.js';

/**
 * Nodo para la sentencia de transferencia "detener" (break)
 */
export class BreakNode implements ASTNode {
    constructor() {}
    
    interpret(context: Context): any {
        // Activar la bandera de salto para detener el ciclo
        context.shouldBreak = true;
        return null;
    }
    
    toString(): string {
        return 'BreakNode';
    }
}
