# Manual de Usuario y Mantenimiento de SimpliCode

## Índice

1. Introducción
2. Instalación y Configuración
3. Arquitectura del Sistema
4. El Lenguaje SimpliCode
   - Sintaxis Básica
   - Tipos de Datos
   - Variables y Asignaciones
   - Operadores
   - Estructuras de Control
   - Funciones y Procedimientos
   - Objetos y Métodos
   - Funciones Nativas
5. El IDE SimpliCode
   - Interfaz de Usuario
   - Gestión de Archivos
   - Ejecución de Código
   - Visualización de Resultados
6. Componentes Clave del Sistema
   - Analizador Léxico y Sintáctico
   - Intérprete
   - Generador de AST
7. Mantenimiento y Extensión
   - Añadir Nuevas Características al Lenguaje
   - Extensión del IDE
   - Depuración
8. Ejemplos Prácticos
9. Problemas Conocidos y Soluciones

## 1. Introducción

SimpliCode es un entorno de desarrollo integrado (IDE) diseñado para un lenguaje de programación educativo del mismo nombre. El sistema consta de dos componentes principales: un intérprete backend que procesa y ejecuta código SimpliCode, y una interfaz frontend que permite a los usuarios escribir, editar y ejecutar programas.

El proyecto está diseñado para servir como herramienta educativa, facilitando el aprendizaje de conceptos de programación con una sintaxis clara y una interfaz amigable.

**Tecnologías utilizadas:**
- **Frontend**: React.js
- **Backend**: Node.js
- **Parser/Lexer**: Jison (similar a Bison/Flex)
- **Visualización AST**: viz.js (implementación JavaScript de Graphviz)
- **Estilización**: CSS personalizado

## 2. Instalación y Configuración

### Requisitos previos

- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior)

### Instalación del proyecto

2. **Instalar dependencias del servidor**:

```bash
cd server
npm install
```

3. **Instalar dependencias del cliente**:

```bash
cd ../client
npm install
```

4. **Configurar variables de entorno**:

Para el servidor, crear un archivo `.env` en el directorio server:

```
PORT=3001
```

### Ejecución

1. **Iniciar el servidor**:

```bash
cd server
npm run start
```

2. **Iniciar el cliente**:

```bash
cd client
npm run dev
```

3. **Acceder a la aplicación**:
Abrir en el navegador: `http://localhost:3000`

## 3. Arquitectura del Sistema

SimpliCode utiliza una arquitectura cliente-servidor:

```
┌─────────────┐      HTTP       ┌─────────────┐
│   Cliente   │◄──────────────► │   Servidor  │
│   (React)   │    Requests     │   (Node)    │
└─────────────┘                 └─────────────┘
      │                                │
┌─────▼─────┐                  ┌───────▼─────┐
│ Interfaz  │                  │  Analizador │
│  Usuario  │                  │  Sintáctico │
└───────────┘                  └─────────────┘
                                      │
                               ┌──────▼──────┐
                               │ Intérprete  │
                               └─────────────┘
                                      │
                               ┌──────▼──────┐
                               │ Generador   │
                               │    AST      │
                               └─────────────┘
```

### Estructura de archivos

```
OLC1_Proyecto2_202300353/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AST.jsx
│   │   │   ├── Consola.jsx
│   │   │   ├── Editor.jsx
│   │   │   ├── Errores.jsx
│   │   │   └── Simbolos.jsx
│   │   ├── App.jsx
│   │   └── App.css
├── server/
│   ├── parser/
│   │   └── simplicode.jison
│   ├── src/
│   │   ├── ast-generator.js
│   │   └── interpretador.js
│   └── server.js
```

## 4. El Lenguaje SimpliCode

SimpliCode es un lenguaje de programación diseñado con fines educativos que soporta paradigmas de programación estructurada y orientada a objetos.

### 4.1 Sintaxis Básica

El código en SimpliCode se organiza en instrucciones que pueden separarse por saltos de línea o punto y coma. Los comentarios pueden ser de una línea con  o multilinea con `/* */`.

```
// Este es un comentario de una línea

/* 
  Este es un comentario 
  de múltiples líneas
*/

ingresar a como entero con valor 10
imprimir nl "El valor de a es: " + a
```

### 4.2 Tipos de Datos

SimpliCode soporta los siguientes tipos de datos primitivos:

- **entero**: Números enteros (Ej: `42`)
- **decimal**: Números de punto flotante (Ej: `3.14`)
- **cadena**: Secuencias de caracteres (Ej: `"Hola Mundo"`)
- **caracter**: Caracteres individuales (Ej: `'a'`)
- **booleano**: Valores lógicos `verdadero` o `falso`
- **Lista**: Colecciones de valores del mismo tipo

### 4.3 Variables y Asignaciones

La declaración de variables en SimpliCode sigue esta sintaxis:

```
// Declaración simple
ingresar <identificador> como <tipo_dato>

// Declaración con asignación
ingresar <identificador> como <tipo_dato> con valor <expresión>

// Asignación de valor a variable existente
<identificador> -> <expresión>

// Ejemplos:
ingresar edad como entero con valor 25
ingresar nombre como cadena con valor "Juan"
nombre -> "Pedro"

// Declaración múltiple
ingresar x, y como entero con valor 10, 20

// Declaración de listas
ingresar Lista (2, entero) numeros -> (1, 2)
ingresar Lista (2, cadena) nombres -> ("Ana", "Luis") 

// Listas anidadas
ingresar Lista (2, Cadena) cadenas -> (("vector", "/lista"),("2", "dimensiones"))
```

### 4.4 Operadores

SimpliCode soporta diversos operadores, organizados por precedencia:

**Operadores aritméticos:**
- `+` : Suma o concatenación
- `-` : Resta
- `*` : Multiplicación
- `/` : División
- `%` : Módulo
- `^` : Potencia
- `-` (unario): Negación

**Operadores relacionales:**
- `==` : Igualdad
- `!=` : Diferencia
- `<` : Menor que
- `<=` : Menor o igual que
- `>` : Mayor que
- `>=` : Mayor o igual que

**Operadores lógicos:**
- `&&` : AND
- `||` : OR
- `!` : NOT

### 4.5 Estructuras de Control

#### Condicionales

**Simple:**
```
si <expresión> entonces
    <sentencias>
fin si
```

**Con else:**
```
si <expresión> entonces
    <sentencias>
de lo contrario
    <sentencias>
fin si
```

**Múltiple (if-elif-else):**
```
si <expresión> entonces
    <sentencias>
o si <expresión> entonces
    <sentencias>
o si <expresión> entonces
    <sentencias>
de lo contrario
    <sentencias>
fin si
```

**Switch (según):**
```
segun <expresión> hacer
    en caso de ser <valor1> entonces
        <sentencias>
    detener;
    
    en caso de ser <valor2> entonces
        <sentencias>
    detener;
    
    de lo contrario entonces
        <sentencias>
    detener;
fin segun
```

#### Ciclos

**Mientras:**
```
mientras <expresión> hacer
    <sentencias>
fin mientras
```

**Repetir Hasta:**
```
repetir
    <sentencias>
hasta que <expresión>
```

**Para:**
```
para i -> 0 hasta 10 con incremento i++ hacer
    <sentencias>
fin para

// Con decremento:
para i -> 10 hasta 0 con decremento i-- hacer
    <sentencias>
fin para
```

**Control de ciclos:**
- `detener;`: Equivalente a `break`
- `continuar;`: Equivalente a `continue`

### 4.6 Funciones y Procedimientos

**Declaración de función (retorna valor):**
```
funcion nombreFuncion <tipo_retorno>
    <sentencias>
    retornar <expresión>
fin funcion

// Con parámetros
funcion suma entero con parametros (a entero, b entero)
    retornar a + b
fin funcion
```

**Declaración de procedimiento (no retorna valor):**
```
procedimiento nombreProcedimiento
    <sentencias>
fin procedimiento

// Con parámetros
procedimiento saludar con parametros (nombre cadena)
    imprimir nl "Hola " + nombre
fin procedimiento
```

**Llamada:**
```
ejecutar nombreFuncion()
ejecutar suma(5, 3)
```

### 4.7 Objetos y Métodos

SimpliCode soporta programación orientada a objetos con una sintaxis simplificada.

**Definición de objetos:**
```
objeto Persona (
    nombre cadena
    edad entero
)
```

**Definición de métodos:**
```
Persona -> metodo saludar
    imprimir nl "Hola, soy " + nombre
fin metodo

Persona -> metodo cumplirAnios con parametros (anios entero)
    edad -> edad + anios
fin metodo
```

**Instanciación de objetos:**
```
ingresar objeto Persona p1 -> Persona (
    "Juan",
    25
)
```

**Llamada a métodos:**
```
ejecutar p1.saludar()
ejecutar p1.cumplirAnios(1)
```

### 4.8 Funciones Nativas

SimpliCode proporciona varias funciones nativas:

- `minuscula(cadena)`: Convierte una cadena a minúsculas
- `mayuscula(cadena)`: Convierte una cadena a mayúsculas
- `longitud(cadena)`: Retorna la longitud de una cadena
- `truncar(decimal)`: Trunca un número decimal
- `redondear(decimal)`: Redondea un número decimal
- `tipo(valor)`: Retorna el tipo de dato de un valor

**Ejemplos:**
```
imprimir nl minuscula("HOLA")  // imprime: hola
imprimir nl longitud("test")   // imprime: 4
imprimir nl truncar(3.7)       // imprime: 3
```

## 5. El IDE SimpliCode

### 5.1 Interfaz de Usuario

La interfaz de SimpliCode está diseñada para ser intuitiva y funcional. Consta de las siguientes áreas principales:

1. **Barra de herramientas**: Contiene botones para acciones comunes (Nuevo, Abrir, Guardar, Ejecutar)
2. **Editor de código**: Área principal donde se escribe el código
3. **Panel de pestañas de archivos**: Permite trabajar con múltiples archivos
4. **Panel de resultados**: Muestra consola, errores, tabla de símbolos y AST
5. **Pestañas de resultados**: Permite cambiar entre diferentes vistas de resultados

El código del componente principal del editor ilustra la estructura de la interfaz:

```jsx
// Editor.jsx (simplificado)
export default function Editor() {
  const [tabs, setTabs] = useState([
    { id: "tab1", name: "nuevo_archivo.ci", content: "", active: true }
  ]);
  
  const [astDot, setAstDot] = useState("");
  const [consola, setConsola] = useState("");
  const [errores, setErrores] = useState([]);
  const [simbolos, setSimbolos] = useState([]);
  const [activeResultTab, setActiveResultTab] = useState("consola");

  return (
    <div className="app">
      {/* Header con logo y herramientas */}
      <div className="app-header">
        <div className="app-logo">SimpliCode</div>
        <div className="tools-container">
          <button onClick={crearNuevo}>Nuevo</button>
          <button onClick={abrirArchivo}>Abrir</button>
          <button onClick={guardarArchivo}>Guardar</button>
          <button onClick={ejecutar}>Ejecutar</button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="app-content">
        {/* Editor de código */}
        <div className="editor-container">
          {/* Pestañas de archivos */}
          <div className="tabs-container">
            {tabs.map(tab => (/* ... */))}
          </div>
          
          {/* Área de texto */}
          <textarea
            className="editor-textarea"
            value={getActiveCode()}
            onChange={(e) => updateActiveTabContent(e.target.value)}
            placeholder="Escribe tu código aquí..."
          />
        </div>
        
        {/* Panel de resultados */}
        <div className="results-container">
          <div className="results-tabs">
            <button onClick={() => setActiveResultTab('consola')}>Consola</button>
            <button onClick={() => setActiveResultTab('simbolos')}>Tabla de Símbolos</button>
            <button onClick={() => setActiveResultTab('errores')}>
              Errores
              {errores.length > 0 && <span className="error-badge">{errores.length}</span>}
            </button>
            <button onClick={() => setActiveResultTab('ast')}>AST</button>
          </div>
          
          <div className="result-content">
            {activeResultTab === "consola" && <Consola texto={consola} />}
            {activeResultTab === "simbolos" && <Simbolos data={simbolos} />}
            {activeResultTab === "errores" && <Errores data={errores} />}
            {activeResultTab === "ast" && <AST dot={astDot} />}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5.2 Gestión de Archivos

El IDE permite trabajar con múltiples archivos a la vez mediante un sistema de pestañas. Las funciones principales son:

**Crear nuevo archivo:**
```jsx
const crearNuevo = () => {
  const newId = `tab${Date.now()}`;
  const newTab = {
    id: newId,
    name: `nuevo_archivo_${tabs.length + 1}.ci`,
    content: "",
    active: true
  };
  
  setTabs([
    ...tabs.map(tab => ({ ...tab, active: false })),
    newTab
  ]);
};
```

**Abrir archivo existente:**
```jsx
const abrirArchivo = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".ci";
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const newId = `tab${Date.now()}`;
      const newTab = {
        id: newId,
        name: file.name,
        content: event.target.result,
        active: true
      };
      
      setTabs([
        ...tabs.map(tab => ({ ...tab, active: false })),
        newTab
      ]);
    };
    
    reader.readAsText(file);
  };
  
  input.click();
};
```

**Guardar archivo:**
```jsx
const guardarArchivo = () => {
  const activeTab = getActiveTab();
  const blob = new Blob([activeTab.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = activeTab.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
```

### 5.3 Ejecución de Código

La ejecución del código se realiza enviando el contenido del editor al servidor:

```jsx
const ejecutar = async () => {
  try {
    const res = await axios.post("http://localhost:3001/interpretar", { 
      codigo: getActiveCode() 
    });
    
    setConsola(res.data.consola);
    setErrores(res.data.errores);
    setSimbolos(res.data.simbolos);
    setAstDot(res.data.ast);
    
    // Cambiar a pestaña de errores si hay errores
    if (res.data.errores && res.data.errores.length > 0) {
      setActiveResultTab("errores");
    } else {
      setActiveResultTab("consola");
    }
  } catch (error) {
    setConsola("Error al interpretar: " + (error.message || "Error desconocido"));
    setActiveResultTab("consola");
  }
};
```

### 5.4 Visualización de Resultados

SimpliCode ofrece diferentes vistas para analizar los resultados de la ejecución:

**Consola:**
Muestra la salida de las instrucciones `imprimir` del programa.

```jsx
// Consola.jsx
export default function Consola({ texto }) {
  const consolaRef = useRef(null);
  
  useEffect(() => {
    if (consolaRef.current) {
      consolaRef.current.scrollTop = consolaRef.current.scrollHeight;
    }
  }, [texto]);

  return (
    <pre 
      className="consola" 
      ref={consolaRef}
    >
      {texto || "La consola está vacía. Ejecuta tu código para ver los resultados."}
    </pre>
  );
}
```

**Tabla de Símbolos:**
Muestra las variables, su tipo y valor actual.

```jsx
// Simbolos.jsx
export default function Simbolos({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-message">No hay símbolos disponibles.</div>;
  }

  return (
    <div className="tabla-simbolos">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s, i) => (
            <tr key={i}>
              <td>{s.id}</td>
              <td>{s.tipo}</td>
              <td className="symbol-value">
                {typeof s.valor === 'object' 
                  ? JSON.stringify(s.valor)
                  : String(s.valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Errores:**
Muestra los errores detectados durante la ejecución.

```jsx
// Errores.jsx
export default function Errores({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-message">No se han encontrado errores.</div>;
  }

  return (
    <div className="tabla-errores">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Línea</th>
            <th>Columna</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{e.tipo}</td>
              <td className="error-message">{e.descripcion}</td>
              <td>{e.linea}</td>
              <td>{e.columna}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**AST (Árbol de Sintaxis Abstracta):**
Visualiza la estructura del código analizado en forma de árbol.

```jsx
// AST.jsx (fragmento)
export default function AST({ dot }) {
  const [svg, setSvg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!dot || typeof dot !== "string") {
      setSvg("<p>No se generó ningún AST.</p>");
      return;
    }

    setIsLoading(true);
    const viz = new Viz({ Module, render });

    viz.renderString(dot, { engine: "dot", format: "svg", scale: 2 })
      .then((result) => {
        setSvg(result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al generar AST:", err);
        setSvg("<p>Error al generar AST.</p>");
        setIsLoading(false);
      });
  }, [dot]);

  // Resto del componente...
}
```

## 6. Componentes Clave del Sistema

### 6.1 Analizador Léxico y Sintáctico

El análisis léxico y sintáctico se realiza utilizando Jison, una herramienta basada en JavaScript similar a Bison/Flex. El archivo simplicode.jison define tanto las reglas léxicas como las gramaticales para el lenguaje SimpliCode.

**Sección Léxica:**

```jison
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

// Definición de palabras clave
"ingresar"                               return 'INGRESAR';
"como"                                   return 'COMO';
"entero"                                 return 'TIPO_ENTERO';
// ... más tokens ...

// Definición de patrones para literales
[0-9]+\.[0-9]+                           return 'DECIMAL';
[0-9]+                                   return 'NUMERO';
\"([^"\\]|\\["nlt\\'])*\"                 return 'CADENA';
\'([^\'\\]|\\[\'nlt\\])\'                 return 'CARACTER';
[a-zA-Z_][a-zA-Z0-9_]*                    return 'ID';
/lex
```

**Sección de Gramática:**

```jison
/* Definición de precedencia de operadores */
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

%start programa

%%

programa
    : sentencias EOF
        { return $1; }
    | sentencias
        { return $1; }
    | sentencias instruccion EOF
        { 
          if ($2 !== null) {
            $$ = $1.concat([$2]); 
            return $$;
          } else {
            return $1;
          }
        }
    ;

// ... más reglas gramaticales ...

expresion
    : expresion '+' expresion
        { $$ = { tipo: 'SUMA', izquierda: $1, derecha: $3, linea: @2.first_line, columna: @2.first_column }; }
    // ... más reglas de expresiones ...
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
    // ... más reglas ...
    ;

%%
```

### 6.2 Intérprete

El intérprete (`interpretador.js`) es responsable de ejecutar el código analizado. Este componente:

1. Mantiene una tabla de símbolos para variables
2. Evalúa expresiones
3. Ejecuta instrucciones
4. Maneja errores

**Tablas y variables globales:**

```javascript
// Tabla de símbolos
const tablaSimbolos = new Map();

// Tabla para almacenar funciones y procedimientos
const tablaFunciones = new Map();

// Tablas para objetos
const tablaDefinicionObjetos = new Map();
const tablaInstanciasObjetos = new Map();

// Lista de errores
const errores = [];

// Consola de salida
let consola = "";
```

**Función principal del intérprete:**

```javascript
function interpretar(instrucciones) {
  tablaSimbolos.clear();
  tablaFunciones.clear();
  tablaDefinicionObjetos.clear();
  tablaInstanciasObjetos.clear();
  errores.length = 0;
  consola = "";
  
  // Primera pasada: registrar objetos y funciones
  for (const instr of instrucciones) {
    if (instr.tipo === 'DEFINICION_OBJETO') {
      // Registro de definiciones de objetos...
    } else if (instr.tipo === 'FUNCION' || instr.tipo === 'PROCEDIMIENTO') {
      // Registro de funciones...
    }
  }
  
  // Segunda pasada: registrar métodos
  for (const instr of instrucciones) {
    if (instr.tipo === 'DEFINICION_METODO') {
      // Registro de métodos...
    }
  }
  
  // Ejecución del código principal
  try {
    for (const instr of instrucciones) {
      try {
        // No ejecutar definiciones de funciones o métodos
        if (instr.tipo !== 'FUNCION' && instr.tipo !== 'PROCEDIMIENTO' && 
            instr.tipo !== 'DEFINICION_OBJETO' && instr.tipo !== 'DEFINICION_METODO') {
          ejecutar(instr);
        }
      } catch (e) {
        // Manejo de excepciones de control (detener, continuar, retornar)
        // ...
      }
    }
  } catch (err) {
    errores.push({ 
      tipo: "Interno", 
      descripcion: err.message,
      linea: 0,
      columna: 0 
    });
  }
  
  return {
    consola,
    errores,
    simbolos: [...tablaSimbolos.entries()].map(([id, val]) => ({
      id,
      tipo: val.tipo,
      valor: val.valor
    }))
  };
}
```

**Función ejecutar para instrucciones:**

```javascript
function ejecutar(instr) {
  switch (instr.tipo) {
    case "DECLARACION": {
      if (tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${instr.id} ya declarada`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      let valorDefault = null;
      switch (instr.tipoDato) {
        case 'entero': valorDefault = 0; break;
        case 'decimal': valorDefault = 0.0; break;
        case 'booleano': valorDefault = false; break;
        case 'cadena': valorDefault = ""; break;
        case 'caracter': valorDefault = ""; break;
      }
      
      const valDecl = instr.valor ? evaluar(instr.valor) : valorDefault;
      tablaSimbolos.set(instr.id, { tipo: instr.tipoDato, valor: valDecl });
      break;
    }
    
    case "IMPRIMIR": {
      const valorImprimir = evaluar(instr.valor);
      if (valorImprimir !== null && valorImprimir !== undefined) {
        let textoImprimir = '';
        
        if (typeof valorImprimir === 'boolean') {
          textoImprimir = valorImprimir ? 'Verdadero' : 'Falso';
        } else {
          textoImprimir = String(valorImprimir);
        }
        
        if (instr.conSalto) {
          consola += textoImprimir + "\n";
        } else {
          consola += textoImprimir;
        }
      }
      break;
    }
    
    // Muchos más casos...
  }
}
```

**Función evaluar para expresiones:**

```javascript
function evaluar(expr) {
  switch (expr.tipo) {
    case "NUMERO":
      return expr.valor;
      
    case "DECIMAL":
      return expr.valor;
      
    case "BOOLEANO":
      return expr.valor;
      
    case "CADENA":
      return expr.valor;
      
    case "CARACTER":
      return expr.valor;
      
    case "ID": {
      if (!tablaSimbolos.has(expr.nombre)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${expr.nombre} no declarada`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      return tablaSimbolos.get(expr.nombre).valor;
    }
      
    case "SUMA":
      return evaluar(expr.izquierda) + evaluar(expr.derecha);
      
    // Más operaciones...
      
    case "FUNCION_NATIVA": {
      const nombreFuncion = expr.nombre;
      
      switch (nombreFuncion) {
        case "minuscula": {
          const argumento = evaluar(expr.argumentos[0]);
          if (typeof argumento !== 'string') {
            // Manejo de error...
          }
          return argumento.toLowerCase();
        }
        
        // Más funciones nativas...
      }
    }
    
    // Más casos...
  }
}
```

### 6.3 Generador de AST

El módulo ast-generator.js convierte el AST creado durante el análisis sintáctico en una representación visual usando el formato DOT de Graphviz, que luego se renderiza como SVG.

#### Estructura del Generador

```javascript
function generarAST(instrucciones) {
  contador = 0;
  let dot = 'digraph AST {\nnode [shape=box];\n';
  const conexiones = [];
  const nodos = [];

  const raizId = nuevoNodo("INICIO", nodos);

  for (const instr of instrucciones) {
    const sub = procesarNodo(instr, nodos, conexiones);
    conexiones.push(`${raizId} -> ${sub};`);
  }

  dot += nodos.join("\n") + "\n" + conexiones.join("\n") + "\n}";
  return dot;
}
```

#### Procesamiento de Nodos

La función `procesarNodo` recursivamente convierte cada nodo del AST en su representación gráfica:

```javascript
function procesarNodo(nodo, nodos, conexiones) {
  if (!nodo || typeof nodo !== "object") {
    return nuevoNodo("null", nodos);
  }

  switch (nodo.tipo) {
    case "DECLARACION": {
      const raiz = nuevoNodo("DECLARACION", nodos);
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      const tipoNode = nuevoNodo(`TIPO: ${nodo.tipoDato}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      conexiones.push(`${raiz} -> ${tipoNode}`);
      
      if (nodo.valor) {
        const valNode = procesarNodo(nodo.valor, nodos, conexiones);
        conexiones.push(`${raiz} -> ${valNode}`);
      }
      return raiz;
    }
    
    // Más casos para otros tipos de nodos...
  }
}
```

#### Visualización

El resultado es un string en formato DOT que se envía al cliente, donde se renderiza como un SVG interactivo usando la librería viz.js.

## 7. Mantenimiento y Extensión

### 7.1 Añadir Nuevas Características al Lenguaje

Para extender SimpliCode con nuevas funcionalidades, es necesario modificar varios componentes del sistema:

#### Paso 1: Actualizar el Analizador Léxico/Sintáctico

1. **Añadir Nuevos Tokens**:

```jison
// Añadir en la sección léxica del archivo simplicode.jison
"nueva_palabra_clave"            return 'NUEVA_PALABRA';
```

2. **Definir Nuevas Reglas Gramaticales**:

```jison
// Añadir en la sección de gramática
nueva_instruccion
    : NUEVA_PALABRA expresion
        { $$ = { tipo: 'NUEVA_INSTRUCCION', valor: $2, linea: @1.first_line, columna: @1.first_column }; }
    ;

// Actualizar la regla de instrucción para incluir la nueva instrucción
instruccion
    : declaracion
    | asignacion
    | nueva_instruccion
    | ... // otras instrucciones
    ;
```

#### Paso 2: Actualizar el Intérprete

Añadir soporte para la nueva instrucción en la función `ejecutar()`:

```javascript
// Añadir en la función ejecutar() de interpretador.js
case "NUEVA_INSTRUCCION": {
  // Implementar la lógica para la nueva instrucción
  const valor = evaluar(instr.valor);
  // Hacer algo con el valor...
  break;
}
```

#### Paso 3: Actualizar el Generador de AST

```javascript
// Añadir en procesarNodo() de ast-generator.js
case "NUEVA_INSTRUCCION": {
  const raiz = nuevoNodo("NUEVA_INSTRUCCION", nodos);
  const valNode = procesarNodo(nodo.valor, nodos, conexiones);
  conexiones.push(`${raiz} -> ${valNode}`);
  return raiz;
}
```

#### Ejemplo: Añadir la Función Nativa `potencia(base, exponente)`

1. Actualizar el analizador léxico:
```jison
"potencia"                                return 'POTENCIA_FUNC';
```

2. Actualizar la gramática:
```jison
funcion_nativa
    : ... // otras funciones existentes
    | POTENCIA_FUNC '(' expresion ',' expresion ')'
        { $$ = { tipo: 'FUNCION_NATIVA', nombre: 'potencia', argumentos: [$3, $5], linea: @1.first_line, columna: @1.first_column }; }
    ;
```

3. Actualizar el intérprete:
```javascript
case "FUNCION_NATIVA": {
  // ...
  switch (nombreFuncion) {
    // ...
    case "potencia": {
      const base = evaluar(expr.argumentos[0]);
      const exponente = evaluar(expr.argumentos[1]);
      if (typeof base !== 'number' || typeof exponente !== 'number') {
        // Manejo de error...
        return null;
      }
      return Math.pow(base, exponente);
    }
    // ...
  }
}
```

### 7.2 Extensión del IDE

El IDE de SimpliCode está construido con React y puede extenderse para añadir nuevas funcionalidades.

#### Añadir un Nuevo Panel de Visualización

1. **Crear un Nuevo Componente**:

```jsx
export default function NuevoPanel({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-message">No hay datos disponibles.</div>;
  }

  return (
    <div className="nuevo-panel">
      {/* Implementación del panel */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

2. **Integrar en el Editor**:

```jsx
// Importar el nuevo componente
import NuevoPanel from "./NuevoPanel";

// Añadir un nuevo estado
const [nuevosDatos, setNuevosDatos] = useState([]);

// Añadir una nueva pestaña en las pestañas de resultados
<button 
  className={`result-tab ${activeResultTab === 'nuevo' ? 'active' : ''}`}
  onClick={() => setActiveResultTab('nuevo')}
>
  Nuevo Panel
</button>

// Añadir el componente en el área de contenido
{activeResultTab === "nuevo" && <NuevoPanel data={nuevosDatos} />}

// Actualizar la función ejecutar para recibir y establecer los nuevos datos
const ejecutar = async () => {
  try {
    const res = await axios.post("http://localhost:3001/interpretar", { 
      codigo: getActiveCode() 
    });
    
    // ... código existente ...
    
    setNuevosDatos(res.data.nuevosDatos); // Suponiendo que el servidor envía estos datos
  } catch (error) {
    // ... manejo de errores ...
  }
};
```

3. **Actualizar el CSS para el Nuevo Panel**:

```css
.nuevo-panel {
  padding: 1rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: auto;
  height: 100%;
}
```

#### Añadir Resaltado de Sintaxis

Para mejorar la experiencia de edición, se puede integrar un editor con resaltado de sintaxis como Monaco Editor (VS Code) o CodeMirror:

```jsx
import { useState } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ value, onChange }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript" // Configurar para SimpliCode
      theme="vs-dark"
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
      }}
    />
  );
}

// Uso en el componente Editor principal
<CodeEditor 
  value={getActiveCode()}
  onChange={(newValue) => updateActiveTabContent(newValue)}
/>
```

### 7.3 Depuración

SimpliCode puede extenderse para incluir capacidades de depuración. Aquí hay algunas implementaciones sugeridas:

#### Añadir Soporte para Puntos de Interrupción

1. **Modificar el intérprete**:

```javascript
// Añadir a interpretador.js
const breakpoints = new Set(); // Conjunto de números de línea con puntos de interrupción

// Función para añadir/quitar puntos de interrupción
function toggleBreakpoint(linea) {
  if (breakpoints.has(linea)) {
    breakpoints.delete(linea);
    return false;
  } else {
    breakpoints.add(linea);
    return true;
  }
}

// Modificar la ejecución para respetar puntos de interrupción
function ejecutar(instr) {
  if (instr.linea && breakpoints.has(instr.linea)) {
    // Pausar ejecución y notificar al cliente
    // Implementar mecanismo de comunicación para depuración
  }
  
  // Continuar con la ejecución normal...
}

// Exponer la función
module.exports.toggleBreakpoint = toggleBreakpoint;
```

2. **Añadir un endpoint de API**:

```javascript
// En server.js
app.post('/toggleBreakpoint', (req, res) => {
  const { linea } = req.body;
  const isActive = interpretador.toggleBreakpoint(linea);
  res.json({ isActive });
});
```

3. **Implementar en el cliente**:

```jsx
const toggleBreakpoint = async (lineNumber) => {
  try {
    const res = await axios.post("http://localhost:3001/toggleBreakpoint", {
      linea: lineNumber
    });
    
    // Actualizar UI para mostrar el punto de interrupción
    if (res.data.isActive) {
      // Añadir marcador visual
    } else {
      // Quitar marcador visual
    }
  } catch (error) {
    console.error("Error al establecer punto de interrupción:", error);
  }
};
```

#### Añadir Ejecución Paso a Paso

Se puede implementar un sistema que permita ejecutar el código instrucción por instrucción:

1. **Modificar el intérprete**:

```javascript
// Variables para controlar la ejecución
let ejecutandoPasoAPaso = false;
let instruccionActual = 0;
let instruccionesPendientes = [];

// Función para iniciar ejecución paso a paso
function iniciarEjecucionPasoAPaso(instrucciones) {
  ejecutandoPasoAPaso = true;
  instruccionActual = 0;
  instruccionesPendientes = instrucciones;
  
  // Devolver información sobre la primera instrucción
  return obtenerInfoInstruccion(instruccionesPendientes[0]);
}

// Función para ejecutar el siguiente paso
function ejecutarSiguientePaso() {
  if (!ejecutandoPasoAPaso || instruccionActual >= instruccionesPendientes.length) {
    return { finalizado: true };
  }
  
  const instr = instruccionesPendientes[instruccionActual++];
  ejecutar(instr);
  
  // Devolver información sobre la siguiente instrucción o finalización
  if (instruccionActual < instruccionesPendientes.length) {
    return obtenerInfoInstruccion(instruccionesPendientes[instruccionActual]);
  } else {
    return { finalizado: true };
  }
}

// Función para obtener información descriptiva de una instrucción
function obtenerInfoInstruccion(instr) {
  return {
    tipo: instr.tipo,
    linea: instr.linea,
    columna: instr.columna,
    // Otros datos relevantes según el tipo de instrucción
  };
}
```

2. **Añadir endpoints de API**:

```javascript
app.post('/iniciarDepuracion', (req, res) => {
  const { codigo } = req.body;
  try {
    const ast = parser.parse(codigo);
    const infoInstruccion = interpretador.iniciarEjecucionPasoAPaso(ast);
    res.json({ infoInstruccion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/siguientePaso', (req, res) => {
  try {
    const resultado = interpretador.ejecutarSiguientePaso();
    // Incluir el estado actual de variables, consola, etc.
    res.json({
      ...resultado,
      consola: interpretador.getConsola(),
      simbolos: interpretador.getSimbolos()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 8. Ejemplos Prácticos

### 8.1 Ejemplo Básico: Calculadora de Factorial

```
// Calculadora de factorial recursiva
funcion factorial entero con parametros (n entero)
    si n <= 1 entonces
        retornar 1
    de lo contrario
        retornar n * ejecutar factorial(n - 1)
    fin si
fin funcion

imprimir nl "Calculadora de Factorial"
imprimir nl "Factorial de 5: " + ejecutar factorial(5)  // Imprime: Factorial de 5: 120
```

### 8.2 Ejemplo Intermedio: Manejo de Listas

```
// Ejemplo de manejo de listas
ingresar Lista (5, entero) numeros -> (10, 7, 3, 8, 1)
ingresar suma como entero con valor 0

// Sumar todos los elementos
para i -> 0 hasta 4 con incremento i++ hacer
    suma -> suma + numeros[i]
fin para

imprimir nl "Elementos de la lista: " + numeros[0] + ", " + numeros[1] + ", " + numeros[2] + ", " + numeros[3] + ", " + numeros[4]
imprimir nl "Suma total: " + suma  // Imprime: Suma total: 29

// Encontrar el máximo
ingresar max como entero con valor numeros[0]

para i -> 1 hasta 4 con incremento i++ hacer
    si numeros[i] > max entonces
        max -> numeros[i]
    fin si
fin para

imprimir nl "El valor máximo es: " + max  // Imprime: El valor máximo es: 10
```

### 8.3 Ejemplo Avanzado: Programación Orientada a Objetos

```
// Definición de una clase Persona
objeto Persona (
    nombre cadena
    edad entero
    genero cadena
)

// Método para saludar
Persona -> metodo saludar
    imprimir nl "Hola, soy " + nombre + ", tengo " + edad + " años"
fin metodo

// Método para cumplir años
Persona -> metodo cumpleanos
    edad -> edad + 1
    imprimir nl nombre + " ahora tiene " + edad + " años"
fin metodo

// Crear instancias de Persona
ingresar objeto Persona juan -> Persona (
    "Juan Pérez",
    25,
    "Masculino"
)

ingresar objeto Persona maria -> Persona (
    "María García",
    30,
    "Femenino"
)

// Usar métodos
ejecutar juan.saludar()  // Imprime: Hola, soy Juan Pérez, tengo 25 años
ejecutar maria.saludar() // Imprime: Hola, soy María García, tengo 30 años

ejecutar juan.cumpleanos() // Imprime: Juan Pérez ahora tiene 26 años
```

### 8.4 Ejemplo Complejo: Ordenamiento de Burbuja

```
// Implementación del algoritmo de ordenamiento de burbuja
procedimiento ordenarBurbuja con parametros (lista Lista)
    ingresar n como entero con valor longitud(lista)
    ingresar i como entero con valor 0
    ingresar j como entero
    ingresar temp como entero
    
    mientras i < n - 1 hacer
        j -> 0
        mientras j < n - i - 1 hacer
            si lista[j] > lista[j + 1] entonces
                // Intercambiar elementos
                temp -> lista[j]
                lista[j] -> lista[j + 1]
                lista[j + 1] -> temp
            fin si
            j -> j + 1
        fin mientras
        i -> i + 1
    fin mientras
fin procedimiento

// Crear y mostrar una lista
ingresar Lista (6, entero) miLista -> (64, 34, 25, 12, 22, 11)

imprimir nl "Lista original:"
para i -> 0 hasta 5 con incremento i++ hacer
    imprimir nl miLista[i]
fin para

// Ordenar la lista
ejecutar ordenarBurbuja(miLista)

imprimir nl "\nLista ordenada:"
para i -> 0 hasta 5 con incremento i++ hacer
    imprimir nl miLista[i]
fin para
```

## 9. Problemas Conocidos y Soluciones

### 9.1 Problema: Errores en Comparaciones entre Caracteres y Números

**Síntoma**: Al comparar un carácter con un valor numérico (ej: `'a' > 10`), el resultado es incorrecto.

**Causa**: La comparación directa sin convertir los caracteres a sus valores ASCII.

**Solución**: Actualizar las funciones de comparación para convertir caracteres a valores ASCII:

```javascript
case "MAYOR_QUE": {
  let izq = evaluar(expr.izquierda);
  let der = evaluar(expr.derecha);
  
  // Convertir caracteres a sus códigos ASCII para comparación
  if (typeof izq === 'string' && izq.length === 1) {
    izq = izq.charCodeAt(0);
  }
  if (typeof der === 'string' && der.length === 1) {
    der = der.charCodeAt(0);
  }
  
  return izq > der;
}
```

### 9.2 Problema: Caracteres de Escape en Cadenas

**Síntoma**: Los caracteres de escape como `\n` no funcionan en las cadenas de texto.

**Causa**: Los caracteres de escape se procesan como secuencias literales.

**Solución**: Procesar caracteres de escape al evaluar cadenas:

```javascript
case "CADENA": {
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
```

### 9.3 Problema: Conflictos en la Gramática con Listas Anidadas

**Síntoma**: Error al analizar listas anidadas como `(("a", "b"), ("c", "d"))`.

**Causa**: Ambigüedad en la gramática entre expresiones entre paréntesis y listas anidadas.

**Solución**: Ajustar las reglas de precedencia y las producciones para eliminar la ambigüedad:

```jison
// Añadir una precedencia específica para listas
%left ','
%nonassoc ')'
%nonassoc '('  // Más alta precedencia para paréntesis

// Modificar la regla para listas
lista_anidada
    : '(' lista_valores ')'
        { $$ = { tipo: 'LISTA_ANIDADA', valores: $2, linea: @1.first_line, columna: @1.first_column }; }
    ;
```

### 9.4 Problema: El Layout no Ocupa Todo el Ancho de la Pantalla

**Síntoma**: La interfaz no se expande para ocupar todo el ancho disponible.

**Causa**: Configuraciones CSS incorrectas o incompletas.

**Solución**: Ajustar el CSS para forzar el ancho completo:

```css
/* Asegura que el HTML y body ocupen todo el viewport */
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Garantiza que el root ocupe todo el espacio disponible */
#root {
  width: 100vw;
  height: 100vh;
  display: flex;
  margin: 0;
  padding: 0;
}

/* Asegura que la app principal ocupe todo el ancho */
.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
```

### 9.5 Problema: Reconocimiento de Palabras Clave con Diferentes Capitalizaciones

**Síntoma**: El analizador no reconoce `verdadero` y `Verdadero` como el mismo token.

**Causa**: Las reglas léxicas son sensibles a mayúsculas y minúsculas.

**Solución**: Definir múltiples reglas para las mismas palabras con diferentes capitalizaciones:

```jison
"Verdadero"                              return 'VERDADERO';
"verdadero"                              return 'VERDADERO';
"Falso"                                  return 'FALSO';
"falso"                                  return 'FALSO';
```
