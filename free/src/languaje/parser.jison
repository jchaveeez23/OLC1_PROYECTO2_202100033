/* description: Parses and returns multiple instructions as a ProgramNode */

%{
/* Importamos los nodos del AST y errores */
const { RuntimeError } = require('../interpreter/Errors');

// Nodos literales
const { NumberLiteralNode } = require('../ast/literals/NumberLiteralNode');
const { StringLiteralNode } = require('../ast/literals/StringLiteralNode');
const { BooleanLiteralNode } = require('../ast/literals/BooleanLiteralNode');
const { CharacterLiteralNode } = require('../ast/literals/CharacterLiteralNode');

// Nodos de identificadores y programa
const { IdentifierNode } = require('../ast/IdentifierNode');
const { ProgramNode } = require('../ast/ProgramNode');
const { PrintNode } = require('../ast/PrintNode');
const { VariableDeclarationNode } = require('../ast/VariableDeclarationNode');
const { VariableAssignmentNode } = require('../ast/VariableAssignmentNode');

// Operadores aritmu00e9ticos
const { AddNode } = require('../ast/operators/AddNode');
const { SubNode } = require('../ast/operators/SubNode');
const { MulNode } = require('../ast/operators/MulNode');
const { DivNode } = require('../ast/operators/DivNode');
const { PowNode } = require('../ast/operators/PowNode');
const { ModNode } = require('../ast/operators/ModNode');

// Operadores de comparaciu00f3n
const { LessNode } = require('../ast/operators/LessNode');
const { GreaterNode } = require('../ast/operators/GreaterNode');
const { LessEqualNode } = require('../ast/operators/LessEqualNode');
const { GreaterEqualNode } = require('../ast/operators/GreaterEqualNode');

// Operadores de igualdad
const { EqualNode } = require('../ast/operators/EqualNode');
const { NotEqualNode } = require('../ast/operators/NotEqualNode');

// Operadores lu00f3gicos
const { AndNode } = require('../ast/operators/AndNode');
const { OrNode } = require('../ast/operators/OrNode');

// Operaciones de casteo
const { CastNode } = require('../ast/operators/CastNode');

// Operaciones de incremento y decremento
const { IncrementNode } = require('../ast/operators/IncrementNode');
const { DecrementNode } = require('../ast/operators/DecrementNode');

// Nodos para listas
const { ListDeclarationNode } = require('../ast/ListDeclarationNode');
const { ListAccessNode } = require('../ast/ListAccessNode');
const { ListAssignmentNode } = require('../ast/ListAssignmentNode');
const { ListValueNode } = require('../ast/ListValueNode');
const { SwitchNode } = require('../ast/SwitchNode');
const { ForNode } = require('../ast/ForNode');
const { BreakNode } = require('../ast/BreakNode');
const { ContinueNode } = require('../ast/ContinueNode');
const { ReturnNode } = require('../ast/ReturnNode');
const { WhileNode } = require('../ast/WhileNode');
const { DoUntilNode } = require('../ast/DoUntilNode');

// Nodos para estructuras de control
const { IfNode } = require('../ast/IfNode');
%}

/* ——————— LEXER ——————— */
%lex
UNUSED      [ \t\r]+
NEWLINE     \n
DIGIT       [0-9]
DIGITS      {DIGIT}+
LETTER      [a-zA-Z]
ID          {LETTER}[_A-Za-z0-9]*
VARCHAR     \"([^\"\\]|\\.)*\"
FLOAT       {DIGITS}\.{DIGITS}
CHAR        \'[^\']\'
COMMENTS    \/\/.*
COMMENTM    [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]

%%
{UNUSED}                {}
{COMMENTS}              {}
{COMMENTM}              {}
{NEWLINE}               {}

"ingresar"              return 'ENTER';
"como"                  return 'AS';
"con valor"             return 'WITHVALUE';
"imprimir"              return 'PRINT';
"verdadero"             return 'TRUE';
"falso"                 return 'FALSE';
"entero"                return 'INTEGER';
"decimal"               return 'DECIMAL';
"cadena"                return 'STRING';
"caracter"              return 'CHARACTER';
"booleano"              return 'BOOLEAN';
"inc"                   return 'INC';
"dec"                   return 'DEC';
"lista"                 return 'LIST';
"si"                    return 'IF';
"entonces"              return 'THEN';
"de lo contrario"       return 'ELSE';
"o si"                 return 'ELSEIF';
"fin si"               return 'ENDIF';
"segun"                 return 'SWITCH';
"hacer"                 return 'DO';
"en caso de ser"        return 'CASE';
"detener"               return 'BREAK';
"fin segun"             return 'ENDSWITCH';
"para"                  return 'FOR';
"hasta"                 return 'UNTIL';
"con incremento"        return 'WITH_INCREMENT';
"con decremento"        return 'WITH_DECREMENT';
"fin para"              return 'ENDFOR';
"continuar"             return 'CONTINUE';
"retornar"              return 'RETURN';
"mientras"              return 'WHILE';
"fin mientras"          return 'ENDWHILE';
"repetir"               return 'DO';
"hasta que"             return 'UNTIL_COND';

"->"                    return 'ARROW';
"<="                    return 'LESSEQUAL';
">="                    return 'GREATEREQUAL';
"=="                    return 'EQUALEQUAL';
"!="                    return 'NOTEQUAL';
"&&"                    return 'AND';
"||"                    return 'OR';
"["                     return 'LEFTBRACKET';
"]"                     return 'RIGHTBRACKET';
"("                     return 'LEFTPAREN';
")"                     return 'RIGHTPAREN';
"{"                     return 'LEFTBRACE';
"}"                     return 'RIGHTBRACE';
"-"                    return 'MINUS';       // "RESTA"
"+"                    return 'PLUS';        // "SUMA"
"*"                    return 'MULTIPLY';    // "MULTIPLICACION"
"/"                    return 'DIVIDE';      // "DIVISION"
"^"                    return 'POWER';       // "POTENCIA"
"%"                    return 'MOD';         // "MODULO"
"="                     return 'EQUALS';
"!"                     return 'NOT';
"<"                     return 'LESSTHAN';
">"                     return 'GREATERTHAN';
"."                     return 'DOT';
","                     return 'COMMA';

{FLOAT}                 return 'FLOAT';
{DIGITS}                return 'DIGITS';
{ID}                    return 'ID';
{VARCHAR}               return 'VARCHAR';
{CHAR}                  return 'CHAR';
<<EOF>>                 return 'EOF';
.                       return 'INVALID';
/lex

/* ——————— DIRECTIVAS ——————— */
%start expressions
%token PRINT ENTER AS WITHVALUE ARROW LEFTBRACKET RIGHTBRACKET LEFTPAREN RIGHTPAREN LEFTBRACE RIGHTBRACE 
%token MINUS PLUS MULTIPLY DIVIDE POWER MOD LESSTHAN GREATERTHAN LESSEQUAL GREATEREQUAL EQUALEQUAL NOTEQUAL AND OR NOT DOT COMMA FLOAT DIGITS ID VARCHAR EOF INVALID TRUE FALSE
%token INTEGER DECIMAL STRING CHARACTER BOOLEAN INC DEC LIST IF THEN ELSE ELSEIF ENDIF SWITCH DO CASE BREAK ENDSWITCH
%token FOR UNTIL INCREMENT DECREMENT ENDFOR CONTINUE RETURN WHILE ENDWHILE UNTIL_COND WITH_INCREMENT WITH_DECREMENT

/* ——————— GRAMÁTICA ——————— */
%%
expressions
    : instructionList EOF
        { return new ProgramNode($1); }
    | EOF
        { return new ProgramNode([]); }

    ;

instructionList
    : instruction
        { $$ = [ $1 ]; }
    | instructionList instruction
        { $1.push($2); $$ = $1; }
    ;

instruction
    : printStatement
        { $$ = $1; }
    | variableDeclaration
        { $$ = $1; }
    | variableAssignment
        { $$ = $1; }
    | ifStatement
        { $$ = $1; }
    | switchStatement
        { $$ = $1; }
    | forStatement
        { $$ = $1; }
    | whileStatement
        { $$ = $1; }
    | doUntilStatement
        { $$ = $1; }
    | breakStatement
        { $$ = $1; }
    | continueStatement
        { $$ = $1; }
    | increment                     { $$ = $1; }
    | decrement                     { $$ = $1; }
    | incrementShort                { $$ = $1; }
    | decrementShort                { $$ = $1; }
    ;

forStatement
    : FOR ID ARROW logical UNTIL logical WITH_INCREMENT increment DO instructionList ENDFOR
        { $$ = new ForNode($2, $4, $6, $8, false, $10); }
    | FOR ID ARROW logical UNTIL logical WITH_DECREMENT decrement DO instructionList ENDFOR
        { $$ = new ForNode($2, $4, $6, $8, true, $10); }
    ;

whileStatement
    : WHILE logical DO instructionList ENDWHILE
        { $$ = new WhileNode($2, $4); }
    ;

doUntilStatement
    : DO instructionList UNTIL_COND logical
        { $$ = new DoUntilNode($4, $2); }
    ;

breakStatement
    : BREAK
        { $$ = new BreakNode(); }
    ;

continueStatement
    : CONTINUE
        { $$ = new ContinueNode(); }
    ;

returnStatement
    : RETURN
        { $$ = new ReturnNode(); }
    | RETURN logical
        { $$ = new ReturnNode($2); }
    ;

switchStatement
    : SWITCH logical DO caseList ENDSWITCH
        { $$ = new SwitchNode($2, $4, null); }
    | SWITCH logical DO caseList ELSE THEN instructionList BREAK ENDSWITCH
        { $$ = new SwitchNode($2, $4, $6); }
    ;

caseList
    : singleCase
        { $$ = [$1]; }
    | caseList singleCase
        { $1.push($2); $$ = $1; }
    ;

singleCase
    : CASE logical THEN instructionList BREAK
        { $$ = { value: $2, body: $4 }; }
    ;

ifStatement
    : IF logical THEN instructionList ENDIF
        { $$ = new IfNode($2, $4, [], []); }
    | IF logical THEN instructionList ELSE instructionList ENDIF
        { $$ = new IfNode($2, $4, [], $6); }
    | IF logical THEN instructionList elseIfList ENDIF
        { $$ = new IfNode($2, $4, $5, []); }
    | IF logical THEN instructionList elseIfList ELSE instructionList ENDIF
        { $$ = new IfNode($2, $4, $5, $7); }
    ;

elseIfList
    : ELSEIF logical THEN instructionList
        { $$ = [{ condition: $2, body: $4 }]; }
    | elseIfList ELSEIF logical THEN instructionList
        { $1.push({ condition: $3, body: $5 }); $$ = $1; }
    ;

variableDeclaration
    : ENTER variable_id AS dataType
        { $$ = new VariableDeclarationNode($2, $4); }
    | ENTER variable_id AS dataType WITHVALUE logical
        { $$ = new VariableDeclarationNode($2, $4, $6); }
    | ENTER variable_list AS dataType
        { $$ = new VariableDeclarationNode($2, $4); }
    | ENTER variable_list AS dataType WITHVALUE expression_list
        { $$ = new VariableDeclarationNode($2, $4, $6); }
    | ENTER LIST LEFTPAREN DIGITS COMMA dataType RIGHTPAREN ID ARROW LEFTPAREN listValues RIGHTPAREN
        { $$ = new ListDeclarationNode(Number($4), $6, $8, $11); }
    | ENTER LIST LEFTPAREN DIGITS COMMA dataType RIGHTPAREN ID
        { $$ = new ListDeclarationNode(Number($4), $6, $8); }
    ;

variableAssignment
    : variable_id ARROW logical
        { $$ = new VariableAssignmentNode($1, $3); }
    | listAccess ARROW logical
        { $$ = new ListAssignmentNode($1.name, $1.indices, $3); }
    | variable_list ARROW expression_list
        { $$ = new VariableAssignmentNode($1, $3); }
    ;

variable_list
    : variable_id COMMA variable_id
        { $$ = [$1, $3]; }
    | variable_list COMMA variable_id
        { $1.push($3); $$ = $1; }
    ;

expression_list
    : logical COMMA logical
        { $$ = [$1, $3]; }
    | expression_list COMMA logical
        { $1.push($3); $$ = $1; }
    ;

variable_id
    : ID
        { $$ = $1; }
    ;

dataType
    : INTEGER
        { $$ = 'entero'; }
    | DECIMAL
        { $$ = 'decimal'; }
    | STRING
        { $$ = 'cadena'; }
    | CHARACTER
        { $$ = 'caracter'; }
    | BOOLEAN
        { $$ = 'booleano'; }
    ;

listValues
    : listElements
        { $$ = new ListValueNode($1); }
    ;

listElements
    : singleElement
        { $$ = [$1]; }
    | singleElement COMMA listElements
        { $$ = [$1, ...$3]; }
    | nestedElement
        { $$ = [$1]; }
    | nestedElement COMMA listElements
        { $$ = [$1, ...$3]; }
    ;

singleElement
    : logical
        { $$ = $1; }
    ;

nestedElement
    : LEFTPAREN listElements RIGHTPAREN
        { $$ = $2; }
    ;

listAccess
    : ID LEFTBRACKET logical RIGHTBRACKET
        { $$ = { name: $1, indices: [$3] }; }
    | ID LEFTBRACKET logical RIGHTBRACKET LEFTBRACKET logical RIGHTBRACKET
        { $$ = { name: $1, indices: [$3, $6] }; }
    | ID LEFTBRACKET logical RIGHTBRACKET LEFTBRACKET logical RIGHTBRACKET LEFTBRACKET logical RIGHTBRACKET
        { $$ = { name: $1, indices: [$3, $6, $9] }; }
    ;

printStatement
    : PRINT logical
        { $$ = new PrintNode($2); }
    ;

logical
    : comparison
        { $$ = $1; }
    | logical AND comparison
        { $$ = new AndNode($1, $3); }
    | logical OR comparison
        { $$ = new OrNode($1, $3); }
    ;

comparison
    : equality
        { $$ = $1; }
    | comparison LESSTHAN equality
        { $$ = new LessNode($1, $3); }
    | comparison GREATERTHAN equality
        { $$ = new GreaterNode($1, $3); }
    | comparison LESSEQUAL equality
        { $$ = new LessEqualNode($1, $3); }
    | comparison GREATEREQUAL equality
        { $$ = new GreaterEqualNode($1, $3); }
    ;

equality
    : term
        { $$ = $1; }
    | equality EQUALEQUAL term
        { $$ = new EqualNode($1, $3); }
    | equality NOTEQUAL term
        { $$ = new NotEqualNode($1, $3); }
    ;

term
    : termLow
        { $$ = $1; }
    | term PLUS termLow
        { $$ = new AddNode($1, $3); }
    | term MINUS termLow
        { $$ = new SubNode($1, $3); }
    ;

termLow
    : power
        { $$ = $1; }
    | termLow MULTIPLY power
        { $$ = new MulNode($1, $3); }
    | termLow DIVIDE power
        { $$ = new DivNode($1, $3); }
    | termLow MOD power
        { $$ = new ModNode($1, $3); }
    ;

power
    : factor
        { $$ = $1; }
    | factor POWER power
        { $$ = new PowNode($1, $3); }
    ;

factor
    : ID                         { $$ = new IdentifierNode($1); }
    | FLOAT                      { $$ = new NumberLiteralNode(Number($1)); }
    | DIGITS                     { $$ = new NumberLiteralNode(Number($1)); }
    | VARCHAR                    { $$ = new StringLiteralNode($1.slice(1, -1)); }
    | CHAR                       { $$ = new CharacterLiteralNode($1.slice(1, -1)); }
    | TRUE                       { $$ = new BooleanLiteralNode(true); }
    | FALSE                      { $$ = new BooleanLiteralNode(false); }
    | LEFTPAREN dataType RIGHTPAREN factor { $$ = new CastNode($2, $4); }
    | incrementShort
    | decrementShort
    | listAccess                 { $$ = new ListAccessNode($1.name, $1.indices); }
    ;

incrementShort
    : INC LEFTPAREN logical RIGHTPAREN { $$ = new IncrementNode($3); }
    ;

decrementShort
    : DEC LEFTPAREN logical RIGHTPAREN { $$ = new DecrementNode($3); }
    ;

increment
    : ID PLUS PLUS { $$ = new IncrementNode(new IdentifierNode($1)); }
    ;

decrement
    : ID MINUS MINUS { $$ = new DecrementNode(new IdentifierNode($1)); }
    ;

