import { ASTNode } from './ASTNode.js';
import { Context } from '../interpreter/Context.js';

interface Case {
    value: ASTNode;
    body: ASTNode[];
}

/**
 * Nodo para la estructura de selección múltiple (segun-hacer)
 */
export class SwitchNode implements ASTNode {
    private discriminant: ASTNode; // La expresión a evaluar
    private cases: Case[]; // Lista de casos
    private defaultCase: ASTNode[] | null; // Caso por defecto (de lo contrario)
    
    /**
     * @param discriminant Expresión a evaluar
     * @param cases Lista de casos con su valor y cuerpo
     * @param defaultCase Caso por defecto (opcional)
     */
    constructor(discriminant: ASTNode, cases: Case[], defaultCase: ASTNode[] | null = null) {
        this.discriminant = discriminant;
        this.cases = cases;
        this.defaultCase = defaultCase;
    }
    
    interpret(context: Context): any {
        // Evaluar la expresión principal
        const value = this.discriminant.interpret(context);
        
        // Buscar un caso que coincida
        for (const caseItem of this.cases) {
            const caseValue = caseItem.value.interpret(context);
            
            // Si el valor coincide, ejecutar el cuerpo del caso
            if (value === caseValue) {
                // Crear un nuevo entorno para las instrucciones del caso
                context.pushEnvironment();
                
                // Ejecutar cada instrucción del cuerpo del caso
                let result = null;
                for (const statement of caseItem.body) {
                    result = statement.interpret(context);
                }
                
                // Restaurar el entorno anterior
                context.popEnvironment();
                
                return result;
            }
        }
        
        // Si no se encuentra un caso que coincida y hay un caso por defecto, ejecutarlo
        if (this.defaultCase) {
            context.pushEnvironment();
            
            let result = null;
            for (const statement of this.defaultCase) {
                result = statement.interpret(context);
            }
            
            context.popEnvironment();
            
            return result;
        }
        
        // Si no hay caso por defecto, retornar null
        return null;
    }
    
    toString(): string {
        return 'SwitchNode';
    }
}
