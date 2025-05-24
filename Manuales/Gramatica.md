## Sintaxis de SimpliCode

---

## Estructura del Programa

```bnf
<programa> ::= <sentencias>
             | <sentencias> <instruccion>

<sentencias> ::= <sentencias> <sentencia>
               | ε

<sentencia> ::= <instruccion> <separador>
              | <separador>

<separador> ::= NEWLINE
              | ";"

<instruccion> ::= <declaracion>
                | <asignacion>
                | <impresion>
                | <operacion_incremento>
                | <control_de_flujo>
                | <llamada_funcion>
                | <retorno>
                | <definicion_objetos>
```

---

## Declaraciones y Asignaciones

```bnf
<declaracion> ::= "ingresar" ID "como" <tipo_dato> "con valor" <expresion>
                | "ingresar" ID "como" <tipo_dato>
                | "ingresar" <lista_ids> "como" <tipo_dato> "con valor" <lista_expresiones>
                | "ingresar" <lista_ids> "como" <tipo_dato>
                | "ingresar" "Lista" "(" NUMERO "," <tipo_dato> ")" ID "->" "(" <lista_expresiones> ")"
                | "ingresar" "Lista" "(" NUMERO "," <tipo_dato> ")" ID

<asignacion> ::= ID "->" <expresion>
               | <lista_ids> "->" <lista_expresiones>
               | <acceso_lista> "=" <expresion>

<tipo_dato> ::= "entero"
              | "decimal"
              | "booleano"
              | "caracter"
              | "cadena"

<lista_ids> ::= <lista_ids> "," ID
              | ID "," ID
```

---

## E/S y Funcionalidades Básicas

```bnf
<impresion> ::= "imprimir" <expresion>
              | "imprimir" "nl" <expresion>

<operacion_incremento> ::= "inc" "(" ID ")"
                         | "dec" "(" ID ")"

<control_flujo_basico> ::= "continuar"
                         | "detener" <separador>
```

---

## Estructuras de Control

```bnf
<control_de_flujo> ::= <condicional_si>
                     | <seleccion_multiple>
                     | <ciclo_para>
                     | <ciclo_mientras>
                     | <ciclo_repetir>
                     | <declaracion_funcion>
                     | <declaracion_procedimiento>

<condicional_si> ::= "si" <expresion> "entonces" <sentencias> "fin si"
                   | "si" <expresion> "entonces" <sentencias> "de lo contrario" <sentencias> "fin si"
                   | "si" <expresion> "entonces" <sentencias> <lista_condiciones_osi> "de lo contrario" <sentencias> "fin si"
                   | "si" <expresion> "entonces" <sentencias> <lista_condiciones_osi> "fin si"

<lista_condiciones_osi> ::= <lista_condiciones_osi> "o si" <expresion> "entonces" <sentencias>
                          | "o si" <expresion> "entonces" <sentencias>

<seleccion_multiple> ::= "segun" <expresion> "hacer" <separador> <lista_casos> "fin segun"
                       | "segun" <expresion> "hacer" <lista_casos> "fin segun"
                       | "segun" <expresion> "hacer" <separador> <lista_casos> "de lo contrario" "entonces" <sentencias> "detener" <separador> "fin segun"
                       | "segun" <expresion> "hacer" <lista_casos> "de lo contrario" "entonces" <sentencias> "detener" <separador> "fin segun"

<lista_casos> ::= <lista_casos> "en caso de ser" <expresion> "entonces" <sentencias> "detener" <separador>
                | "en caso de ser" <expresion> "entonces" <sentencias> "detener" <separador>

<ciclo_para> ::= "para" ID "->" <expresion> "hasta" <expresion> "con incremento" ID "+" "+" "hacer" <sentencias> "fin para"
               | "para" ID "->" <expresion> "hasta" <expresion> "con decremento" ID "-" "-" "hacer" <sentencias> "fin para"

<ciclo_mientras> ::= "mientras" <expresion> "hacer" <sentencias> "fin mientras"

<ciclo_repetir> ::= "repetir" <sentencias> "hasta que" <expresion>
```

---

## Funciones y Procedimientos

```bnf
<declaracion_funcion> ::= "funcion" ID <tipo_dato> <sentencias> "fin funcion"
                        | "funcion" ID <tipo_dato> "con parametros" "(" <lista_parametros> ")" <sentencias> "fin funcion"

<declaracion_procedimiento> ::= "procedimiento" ID <sentencias> "fin procedimiento"
                              | "procedimiento" ID "con parametros" "(" <lista_parametros> ")" <sentencias> "fin procedimiento"

<lista_parametros> ::= ID <tipo_dato>
                     | <lista_parametros> "," ID <tipo_dato>

<retorno> ::= "retornar"
            | "retornar" <expresion>

<llamada_funcion> ::= "ejecutar" ID "(" ")"
                    | "ejecutar" ID "(" <lista_expresiones> ")"
```

---

## Programación Orientada a Objetos

```bnf
<definicion_objetos> ::= "objeto" ID "(" NEWLINE <lista_atributos> ")"
                       | ID "->" "metodo" ID <sentencias> "fin metodo"
                       | ID "->" "metodo" ID "con parametros" "(" <lista_parametros> ")" <sentencias> "fin metodo"
                       | "ingresar" "objeto" ID ID "->" ID "(" NEWLINE <lista_expresiones> <separadores_opt> ")"
                       | "ejecutar" ID "." ID "(" ")"
                       | "ejecutar" ID "." ID "(" <lista_expresiones> ")"

<lista_atributos> ::= <atributo> <separadores_opt>
                    | <lista_atributos> <atributo> <separadores_opt>

<atributo> ::= ID <tipo_dato>

<separadores_opt> ::= ε
                    | <separadores>

<separadores> ::= <separador>
                | <separadores> <separador>
```

---

## Listas y Arreglos

```bnf
<lista_expresiones> ::= <expresion_lista>
                      | <lista_expresiones> "," <separadores_opt> <expresion_lista>

<expresion_lista> ::= <expresion>
                    | <lista_anidada>

<lista_anidada> ::= "(" <lista_expresiones> ")"

<acceso_lista> ::= ID "[" <expresion> "]"
                 | ID "[" <expresion> "]" "[" <expresion> "]"
                 | ID "[" <expresion> "]" "[" <expresion> "]" "[" <expresion> "]"
```

---

## Expresiones

```bnf
<expresion> ::= <expresion> "+" <expresion>
              | <expresion> "-" <expresion>
              | <expresion> "*" <expresion>
              | <expresion> "/" <expresion>
              | <expresion> "^" <expresion>
              | <expresion> "%" <expresion>
              | "-" <expresion>
              | <expresion> "==" <expresion>
              | <expresion> "!=" <expresion>
              | <expresion> "<" <expresion>
              | <expresion> "<=" <expresion>
              | <expresion> ">" <expresion>
              | <expresion> ">=" <expresion>
              | <expresion> "&&" <expresion>
              | <expresion> "||" <expresion>
              | "!" <expresion>
              | "(" <expresion> ")"
              | "(" <tipo_dato> ")" <expresion>
              | NUMERO
              | DECIMAL
              | ID
              | CADENA
              | CARACTER
              | "verdadero"
              | "falso"
              | <acceso_lista>
              | <llamada_funcion_expr>
              | <acceso_objeto>
              | <funcion_nativa>
```

---

## Funciones Nativas y Acceso a Objetos

```bnf
<llamada_funcion_expr> ::= "ejecutar" ID "(" ")"
                         | "ejecutar" ID "(" <lista_expresiones> ")"

<acceso_objeto> ::= ID "." ID
                  | "ejecutar" ID "." ID "(" ")"
                  | "ejecutar" ID "." ID "(" <lista_expresiones> ")"

<funcion_nativa> ::= "minuscula" "(" <expresion> ")"
                   | "mayuscula" "(" <expresion> ")"
                   | "longitud" "(" <expresion> ")"
                   | "truncar" "(" <expresion> ")"
                   | "redondear" "(" <expresion> ")"
                   | "tipo" "(" <expresion> ")"
```