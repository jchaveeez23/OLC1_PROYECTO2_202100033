%lex
%%
[ \t\r]+                                  /* skip horizontal whitespace */

\/\/[^\n]*                               { /* comentario de una línea, se descarta */ }

"/*"([^*]|\*+[^*/])*\*+\/                  { /* comentario multilínea, se descarta */ }

\n                                      return 'NEWLINE';
";"                                     return ';';


">="                                     return 'MAYOR_IGUAL';
"<="                                     return 'MENOR_IGUAL';
"=="                                     return 'IGUAL_IGUAL';
"!="                                     return 'DIFERENTE';
">"                                     return 'MAYOR_QUE';
"<"                                     return 'MENOR_QUE';
"."                                      return '.';


"con valor"                              return 'CONVALOR';
"en caso de ser"                         return 'CASO';
"o si"                                   return 'O_SI';
"de lo contrario"                        return 'ELSE';
"fin si"                                 return 'FIN_SI';
"fin segun"                              return 'FIN_SEGUN';
"con incremento"                         return 'CON_INCREMENTO';
"con decremento"                         return 'CON_DECREMENTO';
"fin para"                               return 'FIN_PARA';
"fin mientras"                           return 'FIN_MIENTRAS';
"hasta que"                              return 'HASTA_QUE';
"fin metodo"                             return 'FIN_METODO';

"ingresar"                               return 'INGRESAR';
"como"                                   return 'COMO';
"entero"                                 return 'TIPO_ENTERO';
"Entero"                                 return 'TIPO_ENTERO';
"decimal"                                return 'TIPO_DECIMAL';
"Decimal"                                return 'TIPO_DECIMAL';
"booleano"                               return 'TIPO_BOOLEANO';
"Booleano"                               return 'TIPO_BOOLEANO';
"caracter"                               return 'TIPO_CARACTER';
"Caracter"                               return 'TIPO_CARACTER';
"cadena"                                 return 'TIPO_CADENA';
"Cadena"                                 return 'TIPO_CADENA';
"Lista"                                  return 'LISTA';
"lista"                                  return 'LISTA';
"->"                                     return 'ASIGNAR';
"="                                     return 'ASIGNAR';

"imprimir"                               return 'IMPRIMIR';
"Imprimir"                               return 'IMPRIMIR';
"inc"                                    return 'INCREMENTO';
"dec"                                    return 'DECREMENTO';
"Inc"                                    return 'INCREMENTO';
"Dec"                                    return 'DECREMENTO';

// Funciones nativas
// Añadir estos tokens en la sección del lexer
"nl"                                     return 'NL';
"minuscula"                              return 'MINUSCULA';
"Minuscula"                              return 'MINUSCULA';
"mayuscula"                              return 'MAYUSCULA';
"Mayuscula"                              return 'MAYUSCULA';
"longitud"                               return 'LONGITUD';
"Longitud"                               return 'LONGITUD';
"truncar"                                return 'TRUNCAR';
"Truncar"                                return 'TRUNCAR';
"redondear"                              return 'REDONDEAR';
"Redondear"                              return 'REDONDEAR';
"tipo"                                   return 'TIPO';
"Tipo"                                   return 'TIPO';

// Tokens para literales booleanos
"Verdadero"                              return 'VERDADERO';
"Falso"                                  return 'FALSO';
"verdadero"                              return 'VERDADERO';
"falso"                                  return 'FALSO';
"True"                                   return 'VERDADERO';
"False"                                  return 'FALSO';
"true"                                   return 'VERDADERO';
"false"                                  return 'FALSO';

// Tokens para estructuras de control
"si"                                     return 'SI';
"Si"                                     return 'SI';
"entonces"                               return 'ENTONCES';
"Entonces"                               return 'ENTONCES';
"segun"                                  return 'SEGUN';
"Segun"                                  return 'SEGUN';
"hacer"                                  return 'HACER';
"Hacer"                                  return 'HACER';
"detener"                                return 'DETENER';
"Detener"                                return 'DETENER';
"continuar"                              return 'CONTINUAR';
"Continuar"                              return 'CONTINUAR';
"objeto"                                 return 'OBJETO';
"Objeto"                                 return 'OBJETO';
"metodo"                                 return 'METODO';
"Metodo"                                 return 'METODO';

// Agregar tokens nuevos en la sección lexer
"retornar"                               return 'RETORNAR';
"funcion"                                return 'FUNCION';
"Retornar"                               return 'RETORNAR';
"Funcion"                                return 'FUNCION';
"fin funcion"                            return 'FIN_FUNCION';
"procedimiento"                          return 'PROCEDIMIENTO';
"fin procedimiento"                      return 'FIN_PROCEDIMIENTO';
"ejecutar"                               return 'EJECUTAR';
"Ejecutar"                               return 'EJECUTAR';
"con parametros"                         return 'CON_PARAMETROS';

// Operadores lógicos
"||"                                     return 'OR';
"&&"                                     return 'AND';
"!"                                      return 'NOT';

"hasta"                                  return 'HASTA';
"Hasta"                                  return 'HASTA';
"para"                                   return 'PARA';
"Para"                                   return 'PARA';
"mientras"                               return 'MIENTRAS';
"Mientras"                               return 'MIENTRAS';
"repetir"                                return 'REPETIR';
"Repetir"                                return 'REPETIR';

// Añadir antes de los tokens + y -
"++"                                     return 'INCREMENTO_OP';
"--"                                     return 'DECREMENTO_OP';
"+"                                      return '+';
"-"                                      return '-';

[0-9]+\.[0-9]+                           return 'DECIMAL';
[0-9]+                                   return 'NUMERO';
\"([^"\\]|\\["nlt\\'])*\"                 return 'CADENA';
\'([^\'\\]|\\[\'nlt\\])\'                 return 'CARACTER';
[a-zA-Z_][a-zA-Z0-9_]*                    return 'ID';
"^"                                     return '^';
"%"                                     return '%';
"*"                                     return '*';
"/"                                     return '/';
","                                     return ',';
"("                                     return '(';
")"                                     return ')';
"["                                     return '[';
"]"                                     return ']';
"="                                     return '=';

<<EOF>>                                 return 'EOF';
. {
    console.error(`Carácter no reconocido: '${yytext}'`);
    return 'INVALIDO';
}
/lex

/* Operator precedence - lowest to highest */
%left OR
%left AND
%right NOT
%left IGUAL_IGUAL DIFERENTE MENOR_QUE MENOR_IGUAL MAYOR_QUE MAYOR_IGUAL
%left '+' '-'
%left '*' '/' '%'
%left '^'
%right CAST
%right UMINUS
%left '['

/* Prioridad para resolver conflicto en listas */
%left ','
%left ')'
%left LISTA_EXPR

%start programa
%token INGRESAR COMO CONVALOR TIPO_ENTERO TIPO_DECIMAL TIPO_BOOLEANO TIPO_CARACTER TIPO_CADENA IMPRIMIR
%token VERDADERO FALSO
%token ID NUMERO DECIMAL CADENA CARACTER NEWLINE
%token IGUAL_IGUAL DIFERENTE MENOR_QUE MENOR_IGUAL MAYOR_QUE MAYOR_IGUAL OR AND NOT
%token INCREMENTO DECREMENTO LISTA
%token SI ENTONCES O_SI ELSE FIN_SI SEGUN HACER CASO DETENER FIN_SEGUN
%token RETORNAR FUNCION FIN_FUNCION PROCEDIMIENTO FIN_PROCEDIMIENTO EJECUTAR CON_PARAMETROS

%%

programa
    : sentencias EOF
        { return $1; }
    | sentencias
        { return $1; }
    | sentencias instruccion EOF  // Nueva regla para permitir una instrucción final sin separador
        { 
          if ($2 !== null) {
            $$ = $1.concat([$2]); 
            return $$;
          } else {
            return $1;
          }
        }
    ;

sentencias
    : sentencias sentencia
        { 
          if ($2 !== null) {
            $$ = $1.concat([$2]); 
          } else {
            $$ = $1;
          }
        }
    | /* empty */
        { $$ = []; }
    ;

sentencia
    : instruccion separador
        { $$ = $1; }
    | separador
        { $$ = null; }
    ;

separador
    : NEWLINE
    | ';'
    ;


instruccion
    : INGRESAR ID COMO tipo_dato CONVALOR expresion
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: $4, valor: $6, linea: @2.first_line, columna: @2.first_column }; }
    | INGRESAR ID COMO tipo_dato
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: $4, valor: null, linea: @2.first_line, columna: @2.first_column }; }
    | INGRESAR lista_ids COMO tipo_dato CONVALOR lista_expresiones
        { $$ = { tipo: 'DECLARACION_MULTIPLE', ids: $2, tipoDato: $4, valores: $6, linea: @1.first_line, columna: @1.first_column }; }
    | INGRESAR lista_ids COMO tipo_dato
        { $$ = { tipo: 'DECLARACION_MULTIPLE', ids: $2, tipoDato: $4, valores: null, linea: @1.first_line, columna: @1.first_column }; }
    | INGRESAR LISTA '(' NUMERO ',' tipo_dato ')' ID ASIGNAR '(' lista_expresiones ')'
        { $$ = { tipo: 'DECLARACION_LISTA', id: $8, dimensiones: Number($4), tipoDato: $6, valores: $11, linea: @1.first_line, columna: @1.first_column }; }
    | INGRESAR LISTA '(' NUMERO ',' tipo_dato ')' ID 
        { $$ = { tipo: 'DECLARACION_LISTA', id: $8, dimensiones: Number($4), tipoDato: $6, valores: null, linea: @1.first_line, columna: @1.first_column }; }
    | ID ASIGNAR expresion
        { $$ = { tipo: 'ASIGNACION', id: $1, valor: $3, linea: @1.first_line, columna: @1.first_column }; }
    | lista_ids ASIGNAR lista_expresiones
        { $$ = { tipo: 'ASIGNACION_MULTIPLE', ids: $1, valores: $3, linea: @1.first_line, columna: @1.first_column }; }
    | acceso_lista ASIGNAR expresion
        { $$ = { tipo: 'MODIFICACION_LISTA', acceso: $1, valor: $3, linea: @1.first_line, columna: @1.first_column }; }
    | IMPRIMIR expresion
        { $$ = { tipo: 'IMPRIMIR', valor: $2, conSalto: false, linea: @1.first_line, columna: @1.first_column }; }
    | IMPRIMIR NL expresion
        { $$ = { tipo: 'IMPRIMIR', valor: $3, conSalto: true, linea: @1.first_line, columna: @1.first_column }; }
    | INCREMENTO '(' ID ')'
        { $$ = { tipo: 'INCREMENTO', id: $3, linea: @1.first_line, columna: @1.first_column }; }
    | DECREMENTO '(' ID ')'
        { $$ = { tipo: 'DECREMENTO', id: $3, linea: @1.first_line, columna: @1.first_column }; }
    | CONTINUAR
        { $$ = { tipo: 'CONTINUAR', linea: @1.first_line, columna: @1.first_column }; }
    | DETENER separador
        { $$ = { tipo: 'DETENER', linea: @1.first_line, columna: @1.first_column }; }
    | RETORNAR
        { $$ = { tipo: 'RETORNAR', valor: null, linea: @1.first_line, columna: @1.first_column }; }
    | RETORNAR expresion
        { $$ = { tipo: 'RETORNAR', valor: $2, linea: @1.first_line, columna: @1.first_column }; }
    | EJECUTAR ID '(' ')'
        { $$ = { tipo: 'LLAMADA', id: $2, parametros: [], linea: @1.first_line, columna: @1.first_column }; }
    | EJECUTAR ID '(' lista_expresiones ')'
        { $$ = { tipo: 'LLAMADA', id: $2, parametros: $4, linea: @1.first_line, columna: @1.first_column }; }
    | estructura_control
        { $$ = $1; }
    | OBJETO ID '(' NEWLINE lista_atributos ')'
        { $$ = { tipo: 'DEFINICION_OBJETO', id: $2, atributos: $5, linea: @1.first_line, columna: @1.first_column }; }
    | ID ASIGNAR METODO ID sentencias FIN_METODO
        { $$ = { tipo: 'DEFINICION_METODO', objeto: $1, id: $4, parametros: [], instrucciones: $5, linea: @1.first_line, columna: @1.first_column }; }
    | ID ASIGNAR METODO ID CON_PARAMETROS '(' lista_parametros ')' sentencias FIN_METODO
        { $$ = { tipo: 'DEFINICION_METODO', objeto: $1, id: $4, parametros: $7, instrucciones: $9, linea: @1.first_line, columna: @1.first_column }; }
    | INGRESAR OBJETO ID ID ASIGNAR ID '(' NEWLINE lista_expresiones separadores_opt ')'
        { $$ = { tipo: 'INSTANCIACION_OBJETO', tipoObjeto: $3, id: $4, valores: $9, linea: @1.first_line, columna: @1.first_column }; }
    | EJECUTAR ID '.' ID '(' ')'
        { $$ = { tipo: 'LLAMADA_METODO', objeto: $2, metodo: $4, parametros: [], linea: @1.first_line, columna: @1.first_column }; }
    | EJECUTAR ID '.' ID '(' lista_expresiones ')'
        { $$ = { tipo: 'LLAMADA_METODO', objeto: $2, metodo: $4, parametros: $6, linea: @1.first_line, columna: @1.first_column }; }
    | ID INCREMENTO_OP
        { $$ = { tipo: 'POST_INCREMENTO', id: $1, linea: @1.first_line, columna: @1.first_column }; }
    | ID DECREMENTO_OP
        { $$ = { tipo: 'POST_DECREMENTO', id: $1, linea: @1.first_line, columna: @1.first_column }; }
    ;

estructura_control
    : condicional_si
    | seleccion_multiple
    | ciclo_para
    | ciclo_mientras
    | ciclo_repetir
    | declaracion_funcion
    | declaracion_procedimiento
    ;

condicional_si
    : SI expresion ENTONCES sentencias FIN_SI
        { $$ = { tipo: 'CONDICIONAL_SI', condicion: $2, instrucciones_si: $4, instrucciones_no: null, linea: @1.first_line, columna: @1.first_column }; }
    | SI expresion ENTONCES sentencias ELSE sentencias FIN_SI
        { $$ = { tipo: 'CONDICIONAL_SI', condicion: $2, instrucciones_si: $4, instrucciones_no: $6, linea: @1.first_line, columna: @1.first_column }; }
    | SI expresion ENTONCES sentencias lista_condiciones_osi ELSE sentencias FIN_SI
        { $$ = { tipo: 'CONDICIONAL_SI_OSI', condicion_inicial: $2, instrucciones_inicial: $4, 
                 condiciones_osi: $5.condiciones, instrucciones_osi: $5.instrucciones, instrucciones_else: $7, linea: @1.first_line, columna: @1.first_column }; }
    | SI expresion ENTONCES sentencias lista_condiciones_osi FIN_SI
        { $$ = { tipo: 'CONDICIONAL_SI_OSI', condicion_inicial: $2, instrucciones_inicial: $4, 
                 condiciones_osi: $5.condiciones, instrucciones_osi: $5.instrucciones, instrucciones_else: null, linea: @1.first_line, columna: @1.first_column }; }
    ;

lista_condiciones_osi
    : lista_condiciones_osi O_SI expresion ENTONCES sentencias
        { 
          $$ = { 
            condiciones: $1.condiciones.concat([$3]), 
            instrucciones: $1.instrucciones.concat([$5]) 
          }; 
        }
    | O_SI expresion ENTONCES sentencias
        { $$ = { condiciones: [$2], instrucciones: [$4] }; }
    ;

seleccion_multiple
    : SEGUN expresion HACER separador lista_casos FIN_SEGUN
        { $$ = { tipo: 'SELECCION_MULTIPLE', expresion: $2, casos: $5.casos, valores: $5.valores, caso_contrario: null, linea: @1.first_line, columna: @1.first_column }; }
    | SEGUN expresion HACER lista_casos FIN_SEGUN
        { $$ = { tipo: 'SELECCION_MULTIPLE', expresion: $2, casos: $4.casos, valores: $4.valores, caso_contrario: null, linea: @1.first_line, columna: @1.first_column }; }
    | SEGUN expresion HACER separador lista_casos ELSE ENTONCES sentencias DETENER separador FIN_SEGUN
        { $$ = { tipo: 'SELECCION_MULTIPLE', expresion: $2, casos: $5.casos, valores: $5.valores, caso_contrario: $8, linea: @1.first_line, columna: @1.first_column }; }
    | SEGUN expresion HACER lista_casos ELSE ENTONCES sentencias DETENER separador FIN_SEGUN
        { $$ = { tipo: 'SELECCION_MULTIPLE', expresion: $2, casos: $4.casos, valores: $4.valores, caso_contrario: $7, linea: @1.first_line, columna: @1.first_column }; }
    ;

lista_casos
    : lista_casos CASO expresion ENTONCES sentencias DETENER separador
        { 
          // Agregar DETENER directamente a las sentencias
          $5.push({ tipo: 'DETENER', linea: @6.first_line, columna: @6.first_column });
          $$ = { 
            casos: $1.casos.concat([$3]), 
            valores: $1.valores.concat([$5]) 
          }; 
        }
    | lista_casos CASO expresion ENTONCES sentencias
        { 
          $$ = { 
            casos: $1.casos.concat([$3]), 
            valores: $1.valores.concat([$5]) 
          }; 
        }
    | CASO expresion ENTONCES sentencias DETENER separador
        { 
          // Agregar DETENER directamente a las sentencias
          $4.push({ tipo: 'DETENER', linea: @5.first_line, columna: @5.first_column });
          $$ = { casos: [$2], valores: [$4] }; 
        }
    | CASO expresion ENTONCES sentencias
        { $$ = { casos: [$2], valores: [$4] }; }
    ;

// Ciclo para - usando la flecha de asignación -> en lugar de =
// Modificación a la regla ciclo_para para soportar incrementos numéricos
ciclo_para
    : PARA ID ASIGNAR expresion HASTA expresion CON_INCREMENTO ID INCREMENTO_OP HACER sentencias FIN_PARA
        { $$ = { tipo: 'CICLO_PARA', variable: $2, valorInicial: $4, valorFinal: $6, 
                 incremento: { tipo: 'INCREMENTO', id: $8 }, instrucciones: $11, 
                 linea: @1.first_line, columna: @1.first_column }; }
    | PARA ID ASIGNAR expresion HASTA expresion CON_DECREMENTO ID DECREMENTO_OP HACER sentencias FIN_PARA
        { $$ = { tipo: 'CICLO_PARA', variable: $2, valorInicial: $4, valorFinal: $6, 
                 incremento: { tipo: 'DECREMENTO', id: $8 }, instrucciones: $11, 
                 linea: @1.first_line, columna: @1.first_column }; }
    | PARA ID ASIGNAR expresion HASTA expresion CON_INCREMENTO NUMERO HACER sentencias FIN_PARA
        { $$ = { tipo: 'CICLO_PARA', variable: $2, valorInicial: $4, valorFinal: $6, 
                 incremento: { tipo: 'INCREMENTO_VALOR', valor: Number($8) }, instrucciones: $10, 
                 linea: @1.first_line, columna: @1.first_column }; }
    | PARA ID ASIGNAR expresion HASTA expresion CON_DECREMENTO NUMERO HACER sentencias FIN_PARA
        { $$ = { tipo: 'CICLO_PARA', variable: $2, valorInicial: $4, valorFinal: $6, 
                 incremento: { tipo: 'DECREMENTO_VALOR', valor: Number($8) }, instrucciones: $10, 
                 linea: @1.first_line, columna: @1.first_column }; }
    ;

// Ciclo mientras
ciclo_mientras
    : MIENTRAS expresion HACER sentencias FIN_MIENTRAS
        { $$ = { tipo: 'CICLO_MIENTRAS', condicion: $2, instrucciones: $4, 
                 linea: @1.first_line, columna: @1.first_column }; }
    ;

// Ciclo repetir hasta
ciclo_repetir
    : REPETIR sentencias HASTA_QUE expresion
        { $$ = { tipo: 'CICLO_REPETIR', condicion: $4, instrucciones: $2, 
                 linea: @1.first_line, columna: @1.first_column }; }
    ;

// Regla para parámetros
lista_parametros
    : parametro
        { $$ = [$1]; }
    | lista_parametros ',' parametro
        { $$ = $1.concat([$3]); }
    ;

parametro
    : ID tipo_dato
        {
          if (typeof $2 === 'object' && $2.tipo === 'lista') {
            $$ = { id: $1, tipo: 'lista', dimension: $2.dimension, subtipo: $2.subtipo };
          } else {
            $$ = { id: $1, tipo: $2 };
          }
        }
    ;

// Regla para funciones
declaracion_funcion
    : FUNCION ID tipo_dato sentencias FIN_FUNCION
        { $$ = { 
            tipo: 'FUNCION', 
            id: $2, 
            tipoRetorno: $3, 
            parametros: [], 
            instrucciones: $4, 
            linea: @1.first_line, 
            columna: @1.first_column 
          }; 
        }
    | FUNCION ID tipo_dato CON_PARAMETROS '(' lista_parametros ')' sentencias FIN_FUNCION
        { $$ = { 
            tipo: 'FUNCION', 
            id: $2, 
            tipoRetorno: $3, 
            parametros: $6, 
            instrucciones: $8, 
            linea: @1.first_line, 
            columna: @1.first_column 
          }; 
        }
    ;

// Regla para procedimientos
declaracion_procedimiento
    : PROCEDIMIENTO ID sentencias FIN_PROCEDIMIENTO
        { $$ = { 
            tipo: 'PROCEDIMIENTO', 
            id: $2, 
            parametros: [],
            instrucciones: $3, 
            linea: @1.first_line, 
            columna: @1.first_column 
          }; 
        }
    | PROCEDIMIENTO ID CON_PARAMETROS '(' lista_parametros ')' sentencias FIN_PROCEDIMIENTO
        { $$ = { 
            tipo: 'PROCEDIMIENTO', 
            id: $2, 
            parametros: $5,
            instrucciones: $7, 
            linea: @1.first_line, 
            columna: @1.first_column 
          }; 
        }
    ;

// Modificar la regla tipo_dato para soportar listas
tipo_dato
    : TIPO_ENTERO
        { $$ = 'entero'; }
    | TIPO_DECIMAL
        { $$ = 'decimal'; }
    | TIPO_BOOLEANO
        { $$ = 'booleano'; }
    | TIPO_CARACTER
        { $$ = 'caracter'; }
    | TIPO_CADENA
        { $$ = 'cadena'; }
    | LISTA
        { $$ = { tipo: 'lista', dimension: null, subtipo: null }; }
    | LISTA '(' NUMERO ',' tipo_dato ')'
        { $$ = { tipo: 'lista', dimension: Number($3), subtipo: $5 }; }
    ;

lista_ids
    : lista_ids ',' ID
        { $$ = $1.concat([$3]); }
    | ID ',' ID
        { $$ = [$1, $3]; }
    ;

lista_expresiones
    : expresion_lista
        { $$ = [$1]; }
    | lista_expresiones ',' separadores_opt expresion_lista
        { $$ = $1.concat([$4]); }
        
    ;

expresion_lista
    : expresion %prec LISTA_EXPR
        { $$ = $1; }
    | lista_anidada
        { $$ = $1; }
    ;

lista_anidada
    : '(' lista_expresiones ')'
        { $$ = { tipo: 'LISTA_ANIDADA', valores: $2, linea: @1.first_line, columna: @1.first_column }; }
    ;

acceso_lista
    : ID '[' expresion ']'
        { $$ = { tipo: 'ACCESO_LISTA', id: $1, indices: [$3], linea: @1.first_line, columna: @1.first_column }; }
    | ID '[' expresion ']' '[' expresion ']'
        { $$ = { tipo: 'ACCESO_LISTA', id: $1, indices: [$3, $6], linea: @1.first_line, columna: @1.first_column }; }
    | ID '[' expresion ']' '[' expresion ']' '[' expresion ']'
        { $$ = { tipo: 'ACCESO_LISTA', id: $1, indices: [$3, $6, $9], linea: @1.first_line, columna: @1.first_column }; }
    ;

expresion
    : expresion '+' expresion
        { $$ = { tipo: 'SUMA', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion '-' expresion
        { $$ = { tipo: 'RESTA', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion '*' expresion
        { $$ = { tipo: 'MULTIPLICACION', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion '/' expresion
        { $$ = { tipo: 'DIVISION', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion '^' expresion
        { $$ = { tipo: 'POTENCIA', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion '%' expresion
        { $$ = { tipo: 'MODULO', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | '-' expresion %prec UMINUS
        { $$ = { tipo: 'NEGACION', valor: $2, linea: @1.first_line, columna: @1.first_column }; }
    | expresion IGUAL_IGUAL expresion
        { $$ = { tipo: 'IGUAL', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion DIFERENTE expresion
        { $$ = { tipo: 'DIFERENTE', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion MENOR_QUE expresion
        { $$ = { tipo: 'MENOR_QUE', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion MENOR_IGUAL expresion
        { $$ = { tipo: 'MENOR_IGUAL', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion MAYOR_QUE expresion
        { $$ = { tipo: 'MAYOR_QUE', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion MAYOR_IGUAL expresion
        { $$ = { tipo: 'MAYOR_IGUAL', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion AND expresion
        { $$ = { tipo: 'AND', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | expresion OR expresion
        { $$ = { tipo: 'OR', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    | NOT expresion
        { $$ = { tipo: 'NOT', valor: $2, linea: @1.first_line, columna: @1.first_column }; }
    | '(' expresion ')'
        { $$ = $2; }
    | '(' tipo_dato ')' expresion %prec CAST
        { $$ = { tipo: 'CASTEO', tipoDato: $2, valor: $4 }; }
    | NUMERO
        { $$ = { tipo: 'NUMERO', valor: Number($1), linea: @1.first_line, columna: @1.first_column }; }
    | DECIMAL
        { $$ = { tipo: 'DECIMAL', valor: parseFloat($1), linea: @1.first_line, columna: @1.first_column }; }
    | ID
        { $$ = { tipo: 'ID', nombre: $1, linea: @1.first_line, columna: @1.first_column }; }
    | CADENA
        { 
          // Quitar comillas
          let texto = $1.slice(1, -1);
          
          // Procesar secuencias de escape
          texto = texto.replace(/\\n/g, '\n')
                       .replace(/\\t/g, '\t')
                       .replace(/\\r/g, '\r')
                       .replace(/\\"/g, '"')
                       .replace(/\\'/g, "'")
                       .replace(/\\\\/g, '\\');
                       
          $$ = { tipo: 'CADENA', valor: texto, linea: @1.first_line, columna: @1.first_column }; 
        }
    | CARACTER
        { 
          // Quitar comillas simples
          let texto2 = $1.slice(1, -1);
          
          // Procesar secuencias de escape
          texto2 = texto2.replace(/\\n/g, '\n')
                       .replace(/\\t/g, '\t')
                       .replace(/\\r/g, '\r')
                       .replace(/\\"/g, '"')
                       .replace(/\\'/g, "'")
                       .replace(/\\\\/g, '\\');
                       
          $$ = { tipo: 'CARACTER', valor: texto2, linea: @1.first_line, columna: @1.first_column }; 
        }
    | VERDADERO
        { $$ = { tipo: 'BOOLEANO', valor: true, linea: @1.first_line, columna: @1.first_column }; }
    | FALSO
        { $$ = { tipo: 'BOOLEANO', valor: false, linea: @1.first_line, columna: @1.first_column }; }
    | acceso_lista
        { $$ = $1; }
    | EJECUTAR ID '(' ')'
        { $$ = { tipo: 'LLAMADA_EXPR', id: $2, parametros: [], linea: @1.first_line, columna: @1.first_column }; }
    | EJECUTAR ID '(' lista_expresiones ')'
        { $$ = { tipo: 'LLAMADA_EXPR', id: $2, parametros: $4, linea: @1.first_line, columna: @1.first_column }; }
    | ID '.' ID
        { $$ = { tipo: 'ACCESO_ATRIBUTO', objeto: $1, atributo: $3, linea: @1.first_line, columna: @1.first_column }; }
    | EJECUTAR ID '.' ID '(' ')'
        { $$ = { tipo: 'LLAMADA_METODO_EXPR', objeto: $2, metodo: $4, parametros: [], linea: @1.first_line, columna: @1.first_column }; }
    | EJECUTAR ID '.' ID '(' lista_expresiones ')'
        { $$ = { tipo: 'LLAMADA_METODO_EXPR', objeto: $2, metodo: $4, parametros: $6, linea: @1.first_line, columna: @1.first_column }; }
    | MINUSCULA '(' expresion ')'
        { $$ = { tipo: 'FUNCION_NATIVA', nombre: 'minuscula', argumentos: [$3], linea: @1.first_line, columna: @1.first_column }; }
    | MAYUSCULA '(' expresion ')'
        { $$ = { tipo: 'FUNCION_NATIVA', nombre: 'mayuscula', argumentos: [$3], linea: @1.first_line, columna: @1.first_column }; }
    | LONGITUD '(' expresion ')'
        { $$ = { tipo: 'FUNCION_NATIVA', nombre: 'longitud', argumentos: [$3], linea: @1.first_line, columna: @1.first_column }; }
    | TRUNCAR '(' expresion ')'
        { $$ = { tipo: 'FUNCION_NATIVA', nombre: 'truncar', argumentos: [$3], linea: @1.first_line, columna: @1.first_column }; }
    | REDONDEAR '(' expresion ')'
        { $$ = { tipo: 'FUNCION_NATIVA', nombre: 'redondear', argumentos: [$3], linea: @1.first_line, columna: @1.first_column }; }
    | TIPO '(' expresion ')'
        { $$ = { tipo: 'FUNCION_NATIVA', nombre: 'tipo', argumentos: [$3], linea: @1.first_line, columna: @1.first_column }; }
    | ID INCREMENTO_OP
        { $$ = { tipo: 'POST_INCREMENTO_EXPR', id: $1, linea: @1.first_line, columna: @1.first_column }; }
    | ID DECREMENTO_OP
        { $$ = { tipo: 'POST_DECREMENTO_EXPR', id: $1, linea: @1.first_line, columna: @1.first_column }; }
    | ID '(' ')'
        { $$ = { tipo: 'LLAMADA_EXPR', id: $1, parametros: [], linea: @1.first_line, columna: @1.first_column }; }
    | ID '(' lista_expresiones ')'
        { $$ = { tipo: 'LLAMADA_EXPR', id: $1, parametros: $3, linea: @1.first_line, columna: @1.first_column }; }
    ;

lista_atributos
    : atributo separadores_opt
        { $$ = [$1]; }
    | lista_atributos atributo separadores_opt
        { $$ = $1.concat([$2]); }
    ;

// 3. Añade una regla para separadores opcionales (cero o más)
separadores_opt
    : /* vacío */
    | separadores
    ;

// 4. Al menos un separador
separadores
    : separador
    | separadores separador
    ;

atributo
    : ID tipo_dato
        { $$ = { id: $1, tipo: $2 }; }
    ;

%%