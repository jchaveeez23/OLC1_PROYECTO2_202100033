// Tabla de símbolos
const tablaSimbolos = new Map();

// Tabla para almacenar funciones y procedimientos
const tablaFunciones = new Map();

// Nuevas tablas para objetos
const tablaDefinicionObjetos = new Map();
const tablaInstanciasObjetos = new Map();

// Lista de errores
const errores = [];

// Consola de salida
let consola = "";

// Excepción para el retorno
class RetornoException extends Error {
  constructor(valor) {
    super('Retorno');
    this.name = 'RetornoException';
    this.valor = valor;
  }
}

class DetenerException extends Error {
  constructor(desdeSegun = false) {
    super('Detener');
    this.name = 'DetenerException';
    this.desdeSegun = desdeSegun;
  }
}

class ContinuarException extends Error {
  constructor() {
    super('Continuar');
    this.name = 'ContinuarException';
  }
}

function evaluarListaMultidimensional(valores) {
  return valores.map(val => {
    if (val && val.tipo === 'LISTA_ANIDADA') {
      return evaluarListaMultidimensional(val.valores);
    } else {
      return evaluar(val);
    }
  });
}

// Modificar función interpretar para inicializar la tabla de funciones
function interpretar(instrucciones) {
  tablaSimbolos.clear();
  tablaFunciones.clear();
  tablaDefinicionObjetos.clear(); // Limpiar tabla de definiciones de objetos
  tablaInstanciasObjetos.clear(); // Limpiar tabla de instancias
  errores.length = 0;
  consola = "";
  
  // Primera pasada: registrar objetos y funciones
  for (const instr of instrucciones) {
    if (instr.tipo === 'DEFINICION_OBJETO') {
      if (tablaDefinicionObjetos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El objeto '${instr.id}' ya ha sido declarado`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
      } else {
        tablaDefinicionObjetos.set(instr.id, {
          atributos: instr.atributos,
          metodos: new Map()
        });
      }
    } else if (instr.tipo === 'FUNCION' || instr.tipo === 'PROCEDIMIENTO') {
      if (tablaFunciones.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `La función o procedimiento '${instr.id}' ya ha sido declarado`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
      } else {
        tablaFunciones.set(instr.id, instr);
      }
    }
  }
  
  // Segunda pasada: registrar métodos
  for (const instr of instrucciones) {
    if (instr.tipo === 'DEFINICION_METODO') {
      const objetoDef = tablaDefinicionObjetos.get(instr.objeto);
      if (!objetoDef) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El objeto '${instr.objeto}' no ha sido definido`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        continue;
      }
      
      if (objetoDef.metodos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El método '${instr.id}' ya existe en el objeto '${instr.objeto}'`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
      } else {
        objetoDef.metodos.set(instr.id, {
          parametros: instr.parametros,
          instrucciones: instr.instrucciones
        });
      }
    }
  }
  
  // Segunda pasada: ejecutar el código principal
  try {
    for (const instr of instrucciones) {
      try {
        // No ejecutar definiciones de funciones o procedimientos aquí
        if (instr.tipo !== 'FUNCION' && instr.tipo !== 'PROCEDIMIENTO' && instr.tipo !== 'DEFINICION_OBJETO' && instr.tipo !== 'DEFINICION_METODO') {
          ejecutar(instr);
        }
      } catch (e) {
        if (e instanceof DetenerException) {
          // Modificado: Solo es error si no proviene de un bloque segun
          if (!e.desdeSegun) {
            errores.push({
              tipo: "Semántico",
              descripcion: "La sentencia 'detener' solo puede usarse dentro de un ciclo o bloque segun",
              linea: instr.linea || 0,
              columna: instr.columna || 0
            });
          }
        } else if (e instanceof ContinuarException) {
          errores.push({
            tipo: "Semántico",
            descripcion: "La sentencia 'continuar' solo puede usarse dentro de un ciclo",
            linea: instr.linea || 0,
            columna: instr.columna || 0
          });
        } else if (e instanceof RetornoException) {
          errores.push({
            tipo: "Semántico",
            descripcion: "La sentencia 'retornar' solo puede usarse dentro de una función o procedimiento",
            linea: instr.linea || 0,
            columna: instr.columna || 0
          });
        } else {
          throw e;
        }
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

// Modificar función ejecutar para manejar funciones, procedimientos y retorno
function ejecutar(instr) {
  switch (instr.tipo) {
    case "DECLARACION": {
      if (tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${instr.id} ya declarada`,
          linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
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
    
    case "DECLARACION_MULTIPLE": {
      const ids = instr.ids;
      const valores = instr.valores || [];
      
      for (const id of ids) {
        if (tablaSimbolos.has(id)) {
          errores.push({
            tipo: "Semántico",
            descripcion: `Variable ${id} ya declarada`,
            linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
            columna: instr.columna || 0
          });
          return;
        }
      }
      
      if (valores.length > 0 && valores.length !== ids.length) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Número de valores (${valores.length}) no coincide con número de variables (${ids.length})`,
          linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
          columna: instr.columna || 0
        });
        return;
      }
      
      for (let i = 0; i < ids.length; i++) {
        let valor = null;
        if (valores.length > 0) {
          valor = evaluar(valores[i]);
        } else {
          switch (instr.tipoDato) {
            case 'entero': valor = 0; break;
            case 'decimal': valor = 0.0; break;
            case 'booleano': valor = false; break;
            case 'cadena': valor = ""; break;
            case 'caracter': valor = ""; break;
          }
        }
        tablaSimbolos.set(ids[i], { tipo: instr.tipoDato, valor });
      }
      break;
    }
    
    case "DECLARACION_LISTA": {
      if (tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Lista ${instr.id} ya declarada`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }

      let lista;

      // Si se asignan valores, se evalúan y se guardan (soporte multidimensional)
      if (instr.valores && instr.valores.length > 0) {
        lista = evaluarListaMultidimensional(instr.valores);
      } else {
        // Si no hay valores, inicializar con nulos
        lista = Array.from({ length: instr.dimensiones }, () =>
          Array.from({ length: instr.dimensiones }, () => null)
        );
      }

      // Registrar la lista en la tabla de símbolos
      tablaSimbolos.set(instr.id, { tipo: "lista", subTipo: instr.tipoDato, valor: lista });
      break;
    }
    
    case "ASIGNACION": {
      if (!tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${instr.id} no declarada`,
          linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
          columna: instr.columna || 0
        });
        return;
      }
      const valAsignado = evaluar(instr.valor);
      tablaSimbolos.get(instr.id).valor = valAsignado;
      break;
    }
    
    case "ASIGNACION_MULTIPLE": {
      const ids = instr.ids;
      const valores = instr.valores;
      
      for (const id of ids) {
        if (!tablaSimbolos.has(id)) {
          errores.push({
            tipo: "Semántico",
            descripcion: `Variable ${id} no declarada`,
            linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
            columna: instr.columna || 0
          });
          return;
        }
      }
      if (ids.length !== valores.length) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Número de valores (${valores.length}) no coincide con número de variables (${ids.length})`,
          linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
          columna: instr.columna || 0
        });
        return;
      }
      
      for (let i = 0; i < ids.length; i++) {
        const valor = evaluar(valores[i]);
        tablaSimbolos.get(ids[i]).valor = valor;
      }
      break;
    }
    
    case "MODIFICACION_LISTA": {
      const { id, indices } = instr.acceso;
      if (!tablaSimbolos.has(id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Lista ${id} no declarada`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      // Navegar por los índices hasta llegar al penúltimo nivel
      let lista = tablaSimbolos.get(id).valor;
      let actual = lista;
      
      for (let i = 0; i < indices.length - 1; i++) {
        const pos = evaluar(indices[i]);
        if (typeof actual !== 'object' || !Array.isArray(actual) || pos < 0 || pos >= actual.length) {
          errores.push({
            tipo: "Semántico",
            descripcion: `Índice ${pos} inválido o fuera de rango`,
            linea: instr.linea || 0,
            columna: instr.columna || 0
          });
          return;
        }
        actual = actual[pos];
      }
      
      // Obtener el último índice y realizar la asignación
      const posFinal = evaluar(indices[indices.length - 1]);
      if (typeof actual !== 'object' || !Array.isArray(actual) || posFinal < 0 || posFinal >= actual.length) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Índice ${posFinal} inválido o fuera de rango`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      actual[posFinal] = evaluar(instr.valor);
      break;
    }
    
    case "IMPRIMIR": {
      const valorImprimir = evaluar(instr.valor);
      if (valorImprimir !== null && valorImprimir !== undefined) {
        // Convertir el resultado a string para imprimirlo
        let textoImprimir = '';
        
        // Para un valor booleano, convertir a Verdadero/Falso en español
        if (typeof valorImprimir === 'boolean') {
          textoImprimir = valorImprimir ? 'Verdadero' : 'Falso';
          console.log("DEBUG - Valor booleano:", valorImprimir, "->", textoImprimir);
        } else {
          textoImprimir = String(valorImprimir);
        }
        
        // Si conSalto es true, añadir un salto de línea
        if (instr.conSalto) {
          consola += textoImprimir + "\n";
        } else {
          consola += textoImprimir;
        }
      }
      break;
    }
    
    case "INCREMENTO": {
      if (!tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${instr.id} no declarada`,
          linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
          columna: instr.columna || 0
        });
        return;
      }
      const reg = tablaSimbolos.get(instr.id);
      // Se asume que la variable es numérica
      reg.valor = reg.valor + 1;
      break;
    }
    
    case "DECREMENTO": {
      if (!tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${instr.id} no declarada`,
          linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
          columna: instr.columna || 0
        });
        return;
      }
      const reg = tablaSimbolos.get(instr.id);
      reg.valor = reg.valor - 1;
      break;
    }
    
    case "POST_INCREMENTO": {
      if (!tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${instr.id} no declarada`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      const variable = tablaSimbolos.get(instr.id);
      if (typeof variable.valor !== 'number') {
        errores.push({
          tipo: "Semántico", 
          descripcion: `El operador ++ solo puede aplicarse a variables numéricas`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      variable.valor++;
      break;
    }

    case "POST_DECREMENTO": {
      if (!tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${instr.id} no declarada`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      const variable = tablaSimbolos.get(instr.id);
      if (typeof variable.valor !== 'number') {
        errores.push({
          tipo: "Semántico",
          descripcion: `El operador -- solo puede aplicarse a variables numéricas`,
          linea: instr.linea || 0, 
          columna: instr.columna || 0
        });
        return;
      }
      
      variable.valor--;
      break;
    }
    
    case "CONDICIONAL_SI": {
      const cond = evaluar(instr.condicion);
      if (cond) {
        for (const s of instr.instrucciones_si) {
          ejecutar(s);
        }
      } else if (instr.instrucciones_no) {
        for (const s of instr.instrucciones_no) {
          ejecutar(s);
        }
      }
      break;
    }
    
    case "CONDICIONAL_SI_OSI": {
      let ejecutado = false;
      if (evaluar(instr.condicion_inicial)) {
        for (const s of instr.instrucciones_inicial) {
          ejecutar(s);
        }
        ejecutado = true;
      } else {
        for (let i = 0; i < instr.condiciones_osi.length; i++) {
          if (evaluar(instr.condiciones_osi[i])) {
            for (const s of instr.instrucciones_osi[i]) {
              ejecutar(s);
            }
            ejecutado = true;
            break;
          }
        }
        if (!ejecutado && instr.instrucciones_else) {
          for (const s of instr.instrucciones_else) {
            ejecutar(s);
          }
        }
      }
      break;
    }
    
    case "SELECCION_MULTIPLE": {
      const expVal = evaluar(instr.expresion);
      let coincide = false;
      let detenido = false;
      
      try {
        for (let i = 0; i < instr.casos.length && !detenido; i++) {
          if (evaluar(instr.casos[i]) === expVal) {
            try {
              // Ejecutar instrucciones del caso
              for (const s of instr.valores[i]) {
                // Marcar que esta instrucción es parte de un segun
                if (s.tipo === 'DETENER') {
                  s.desdeSegun = true;
                }
                ejecutar(s);
              }
            } catch (e) {
              if (e instanceof DetenerException) {
                // Si encontramos un detener, salimos del segun pero no propagamos la excepción
                detenido = true;
              } else {
                // Propagar otras excepciones
                throw e;
              }
            }
            coincide = true;
            break;
          }
        }
        
        if (!coincide && !detenido && instr.caso_contrario) {
          try {
            for (const s of instr.caso_contrario) {
              // Marcar que esta instrucción es parte de un segun
              if (s.tipo === 'DETENER') {
                s.desdeSegun = true;
              }
              ejecutar(s);
            }
          } catch (e) {
            if (e instanceof DetenerException) {
              // No propagamos la excepción, solo salimos del segun
            } else {
              throw e;
            }
          }
        }
      } catch (e) {
        // Re-lanzar cualquier otra excepción no manejada
        throw e;
      }
      
      break;
    }

    case "CICLO_PARA": {
      const variable = instr.variable;
      const valorInicial = evaluar(instr.valorInicial);
      
      // Si la variable no existe, la creamos
      if (!tablaSimbolos.has(variable)) {
        tablaSimbolos.set(variable, { tipo: 'entero', valor: valorInicial });
      } else {
        // Si ya existe, actualizamos su valor
        tablaSimbolos.get(variable).valor = valorInicial;
      }
      
      // Usamos una función para reevaluar el valor final en cada iteración
      const getValorFinal = () => evaluar(instr.valorFinal);
      
      const incrementoTipo = instr.incremento.tipo;
      const esIncremento = incrementoTipo === 'INCREMENTO' || incrementoTipo === 'INCREMENTO_VALOR';
      
      // Ejecutamos el ciclo reevaluando el valor final en cada iteración
      cicloFor: while (esIncremento 
             ? tablaSimbolos.get(variable).valor <= getValorFinal() 
             : tablaSimbolos.get(variable).valor >= getValorFinal()) {
        
        try {
          for (const sentencia of instr.instrucciones) {
            ejecutar(sentencia);
          }
        } catch (e) {
          if (e instanceof DetenerException) {
            break cicloFor; // Salir del ciclo
          } else if (e instanceof ContinuarException) {
            // Continuar a la siguiente iteración
            // (el incremento se aplicará después)
          } else {
            throw e; // Re-lanzar cualquier otra excepción
          }
        }

        // Aplicar el incremento según el tipo
        if (incrementoTipo === 'INCREMENTO') {
          tablaSimbolos.get(variable).valor++;
        } else if (incrementoTipo === 'DECREMENTO') {
          tablaSimbolos.get(variable).valor--;
        } else if (incrementoTipo === 'INCREMENTO_VALOR') {
          tablaSimbolos.get(variable).valor += instr.incremento.valor;
        } else if (incrementoTipo === 'DECREMENTO_VALOR') {
          tablaSimbolos.get(variable).valor -= instr.incremento.valor;
        }
      }
      break;
    }
    
    case "CICLO_MIENTRAS": {
      try {
        while (evaluar(instr.condicion)) {
          try {
            for (const s of instr.instrucciones) {
              ejecutar(s); // Esto lanzará DetenerException si encuentra DETENER
            }
          } catch (e) {
            if (e instanceof DetenerException) {
              break; // Salir del bucle
            } else if (e instanceof ContinuarException) {
              continue; // Continuar con la siguiente iteración
            } else {
              throw e; // Re-lanzar otras excepciones
            }
          }
        }
      } catch (e) {
        if (!(e instanceof RetornoException)) {
          throw e; // Propagar excepciones que no sean de retorno
        }
      }
      break;
    }
    
    case "CICLO_REPETIR": {
      cicloDoWhile: do {
        try {
          for (const sentencia of instr.instrucciones) {
            ejecutar(sentencia);
          }
        } catch (e) {
          if (e instanceof DetenerException) {
            break cicloDoWhile;
          } else if (e instanceof ContinuarException) {
            continue cicloDoWhile;
          } else {
            throw e;
          }
        }
      } while (evaluar(instr.condicion) === false); // Continúa mientras la condición sea falsa
      break;
    }

    case "DETENER": {
      // Lanzar excepción que será capturada por los ciclos
      throw new DetenerException(instr.desdeSegun || false);
    }

    case "CONTINUAR": {
      // Lanzar excepción que será capturada por los ciclos
      throw new ContinuarException();
    }
    
    case "RETORNAR": {
      throw new RetornoException(instr.valor ? evaluar(instr.valor) : null);
    }
    
    case "FUNCION": {
      // Las funciones se procesan en la primera pasada
      break;
    }
    
    case "PROCEDIMIENTO": {
      // Los procedimientos se procesan en la primera pasada
      break;
    }
    
    case "DEFINICION_OBJETO":
      // Manejado en la primera pasada
      break;
      
    case "DEFINICION_METODO":
      // Manejado en la segunda pasada
      break;
      
    case "INSTANCIACION_OBJETO": {
      const tipoDef = tablaDefinicionObjetos.get(instr.tipoObjeto);
      if (!tipoDef) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El tipo de objeto '${instr.tipoObjeto}' no está definido`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      if (tablaInstanciasObjetos.has(instr.id) || tablaSimbolos.has(instr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `La variable '${instr.id}' ya ha sido declarada`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      // Verificar número correcto de valores
      if (instr.valores.length !== tipoDef.atributos.length) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Número incorrecto de valores para instanciar objeto '${instr.tipoObjeto}'. Se esperaban ${tipoDef.atributos.length}, pero se recibieron ${instr.valores.length}`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      // Crear nueva instancia
      const atributos = new Map();
      for (let i = 0; i < tipoDef.atributos.length; i++) {
        const atributo = tipoDef.atributos[i];
        const valor = evaluar(instr.valores[i]);
        atributos.set(atributo.id, { tipo: atributo.tipo, valor: valor });
      }
      
      // Guardar instancia
      tablaInstanciasObjetos.set(instr.id, {
        tipo: instr.tipoObjeto,
        atributos: atributos
      });
      break;
    }
    
    case "LLAMADA_METODO": {
      const instancia = tablaInstanciasObjetos.get(instr.objeto);
      if (!instancia) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El objeto '${instr.objeto}' no ha sido instanciado`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      const definicionObj = tablaDefinicionObjetos.get(instancia.tipo);
      const metodo = definicionObj.metodos.get(instr.metodo);
      if (!metodo) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El método '${instr.metodo}' no existe en el objeto de tipo '${instancia.tipo}'`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      // Verificar parámetros
      if (instr.parametros.length !== metodo.parametros.length) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Número incorrecto de parámetros para el método '${instr.metodo}'. Se esperaban ${metodo.parametros.length}, pero se recibieron ${instr.parametros.length}`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
      
      // Guardar ámbito actual
      const ambitoAnterior = new Map(tablaSimbolos);
      
      // Agregar atributos del objeto al ámbito
      for (const [id, valor] of instancia.atributos) {
        tablaSimbolos.set(id, valor);
      }
      
      // Agregar parámetros del método
      for (let i = 0; i < metodo.parametros.length; i++) {
        const param = metodo.parametros[i];
        const valor = evaluar(instr.parametros[i]);
        tablaSimbolos.set(param.id, { tipo: param.tipo, valor: valor });
      }
      
      try {
        // Ejecutar método
        for (const sentencia of metodo.instrucciones) {
          ejecutar(sentencia);
        }
      } finally {
        // Restaurar ámbito anterior
        tablaSimbolos.clear();
        for (const [key, value] of ambitoAnterior) {
          tablaSimbolos.set(key, value);
        }
        
        // Actualizar valores de atributos
        for (const [id, valor] of instancia.atributos) {
          if (tablaSimbolos.has(id)) {
            instancia.atributos.set(id, tablaSimbolos.get(id));
          }
        }
      }
      break;
    }
    
    case "LLAMADA": {
      const subrutina = tablaFunciones.get(instr.id);
      if (!subrutina) {
        errores.push({
          tipo: "Semántico",
          descripcion: `La función o procedimiento '${instr.id}' no existe`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
    
      // Validar número de parámetros
      if (instr.parametros.length !== subrutina.parametros.length) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Número incorrecto de parámetros para '${instr.id}'. Se esperaban ${subrutina.parametros.length}, pero se recibieron ${instr.parametros.length}`,
          linea: instr.linea || 0,
          columna: instr.columna || 0
        });
        return;
      }
    
      // IMPORTANTE: Crear una copia completa del ámbito actual
      const ambitoAnteriorGlobal = new Map(tablaSimbolos);
      
      // Evaluar todos los valores de parámetros ANTES de modificar el ámbito
      const valoresParametros = [];
      for (let i = 0; i < instr.parametros.length; i++) {
        valoresParametros.push(evaluar(instr.parametros[i]));
      }
      
      // Asignar valores a los parámetros después de evaluarlos todos
      for (let i = 0; i < subrutina.parametros.length; i++) {
        const param = subrutina.parametros[i];
        const valor = valoresParametros[i];
        
        if (param.tipo === 'lista') {
          // Verificar que el valor sea una lista (o algo que pueda tratarse como tal)
          if (!Array.isArray(valor) && valor !== null) {
            errores.push({
              tipo: "Semántico",
              descripcion: `Se esperaba una lista para el parámetro '${param.id}', pero se recibió ${typeof valor}`,
              linea: instr.linea || 0,
              columna: instr.columna || 0
            });
            continue;
          }
          
          tablaSimbolos.set(param.id, { 
            tipo: "lista", 
            subTipo: param.subtipo || null,
            valor: valor 
          });
        } else {
          tablaSimbolos.set(param.id, { tipo: param.tipo, valor: valor });
        }
      }
    
      try {
        // Ejecutar el cuerpo de la subrutina
        for (const s of subrutina.instrucciones) {
          ejecutar(s);
        }
      } catch (e) {
        // Manejo de excepciones...
      } finally {
        // Guardar referencias a los valores modificados de las listas
        const listasModificadas = new Map();
        
        for (let i = 0; i < subrutina.parametros.length; i++) {
          const param = subrutina.parametros[i];
          if (param.tipo === 'lista' && tablaSimbolos.has(param.id)) {
            listasModificadas.set(i, tablaSimbolos.get(param.id).valor);
          }
        }
        
        // Restaurar el ámbito anterior
        tablaSimbolos.clear();
        for (const [key, value] of ambitoAnteriorGlobal) {
          tablaSimbolos.set(key, value);
        }
        
        // Aplicar los cambios a las listas originales
        for (let i = 0; i < instr.parametros.length; i++) {
          if (listasModificadas.has(i)) {
            // Si el parámetro es una referencia directa a una variable
            if (instr.parametros[i].tipo === 'ID') {
              const nombreOriginal = instr.parametros[i].nombre;
              if (tablaSimbolos.has(nombreOriginal)) {
                // Actualizar la lista original con los valores modificados
                tablaSimbolos.get(nombreOriginal).valor = listasModificadas.get(i);
              }
            }
          }
        }
      }
    
      break;
    }
    
    default: {
      errores.push({
        tipo: "Sintáctico",
        descripcion: `Instrucción desconocida: ${JSON.stringify(instr)}`,
        linea: instr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
        columna: instr.columna || 0
      });
      break;
    }
  }
}

// Añadir caso para evaluar llamadas a funciones
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
          linea: expr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
          columna: expr.columna || 0
        });
        return null;
      }
      return tablaSimbolos.get(expr.nombre).valor;
    }
      
    case "ACCESO_LISTA": {
      const { id, indices } = expr;
      if (!tablaSimbolos.has(id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Lista ${id} no declarada`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }

      // Navegar por los índices para acceder al valor en la posición correspondiente
      let resultado = tablaSimbolos.get(id).valor;

      for (const indice of indices) {
        const pos = evaluar(indice);
        if (typeof resultado !== 'object' || !Array.isArray(resultado) || pos < 0 || pos >= resultado.length) {
          errores.push({
            tipo: "Semántico",
            descripcion: `Índice ${pos} inválido o fuera de rango`,
            linea: expr.linea || 0,
            columna: expr.columna || 0
          });
          return null;
        }
        resultado = resultado[pos];
      }

      return resultado;
    }
      
    case "ACCESO_ATRIBUTO": {
      const instancia = tablaInstanciasObjetos.get(expr.objeto);
      if (!instancia) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El objeto '${expr.objeto}' no ha sido instanciado`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      const atributo = instancia.atributos.get(expr.atributo);
      if (!atributo) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El atributo '${expr.atributo}' no existe en el objeto '${expr.objeto}'`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      return atributo.valor;
    }
      
    case "SUMA":
      return evaluar(expr.izquierda) + evaluar(expr.derecha);
      
    case "RESTA": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Si uno es carácter, convertir a ASCII
      if (typeof izq === 'string' && izq.length === 1) {
        izq = izq.charCodeAt(0);
      }
      if (typeof der === 'string' && der.length === 1) {
        der = der.charCodeAt(0);
      }
      
      return izq - der;
    }
      
    case "MULTIPLICACION": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Si uno es carácter y el otro es número, convertir el carácter a ASCII
      if (typeof izq === 'string' && izq.length === 1 && typeof der === 'number') {
        izq = izq.charCodeAt(0);
      } else if (typeof der === 'string' && der.length === 1 && typeof izq === 'number') {
        der = der.charCodeAt(0);
      }
      
      return izq * der;
    }
      
    case "DIVISION": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Si uno es carácter, convertir a ASCII
      if (typeof izq === 'string' && izq.length === 1) {
        izq = izq.charCodeAt(0);
      }
      if (typeof der === 'string' && der.length === 1) {
        der = der.charCodeAt(0);
      }
      
      return izq / der;
    }
      
    case "POTENCIA": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Si uno es carácter, convertir a ASCII
      if (typeof izq === 'string' && izq.length === 1) {
        izq = izq.charCodeAt(0);
      }
      if (typeof der === 'string' && der.length === 1) {
        der = der.charCodeAt(0);
      }
      
      return Math.pow(izq, der);
    }
      
    case "MODULO": {
      const izq = evaluar(expr.izquierda);
      const der = evaluar(expr.derecha);
      
      // Si ambos operandos son números, usar una implementación de módulo más precisa
      if (typeof izq === 'number' && typeof der === 'number') {
          // Implementación más precisa del módulo para números decimales
          return ((izq % der) + der) % der;
      }
      return izq % der;
    }
      
    case "NEGACION":
      return -evaluar(expr.valor);
      
    case "IGUAL": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Convertir caracteres a sus códigos ASCII si uno es carácter
      if (typeof izq === 'string' && izq.length === 1) {
        // Si estamos comparando con un número, convertir a código ASCII
        if (typeof der === 'number') {
          izq = izq.charCodeAt(0);
        }
      }
      
      if (typeof der === 'string' && der.length === 1) {
        // Si estamos comparando con un número, convertir a código ASCII
        if (typeof izq === 'number') {
          der = der.charCodeAt(0);
        }
      }
      
      // Usar comparación con tolerancia para cualquier operación numérica
      return sonNumerosIguales(izq, der);
    }
      
    case "DIFERENTE": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Convertir caracteres a sus códigos ASCII solo si ambos son caracteres
      if (typeof izq === 'string' && izq.length === 1 && 
          typeof der === 'string' && der.length === 1) {
          izq = izq.charCodeAt(0);
          der = der.charCodeAt(0);
      }
      
      return izq !== der;
    }
      
    case "MENOR_QUE": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Convertir caracteres a sus códigos ASCII para comparación
      if (typeof izq === 'string' && izq.length === 1) {
          izq = izq.charCodeAt(0);
      }
      if (typeof der === 'string' && der.length === 1) {
          der = der.charCodeAt(0);
      }
      
      return izq < der;
    }
      
    case "MENOR_IGUAL": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Convertir caracteres a sus códigos ASCII para comparación
      if (typeof izq === 'string' && izq.length === 1) {
          izq = izq.charCodeAt(0);
      }
      if (typeof der === 'string' && der.length === 1) {
          der = der.charCodeAt(0);
      }
      
      return izq <= der;
    }
      
    case "MAYOR_QUE": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Convertir caracteres a sus códigos ASCII para comparación
      if (typeof izq === 'string' && izq.length === 1) {
        izq = izq.charCodeAt(0);
        console.log("DEBUG: Convertido carácter a ASCII:", expr.izquierda, "->", izq);
      }
      if (typeof der === 'string' && der.length === 1) {
        der = der.charCodeAt(0);
        console.log("DEBUG: Convertido carácter a ASCII:", expr.derecha, "->", der);
      }
      
      const resultado = izq > der;
      console.log(`DEBUG: Comparación ${izq} > ${der} = ${resultado}`);
      return resultado;
    }
      
    case "MAYOR_IGUAL": {
      let izq = evaluar(expr.izquierda);
      let der = evaluar(expr.derecha);
      
      // Convertir caracteres a sus códigos ASCII para comparación
      if (typeof izq === 'string' && izq.length === 1) {
          izq = izq.charCodeAt(0);
      }
      if (typeof der === 'string' && der.length === 1) {
          der = der.charCodeAt(0);
      }
      
      return izq >= der;
    }
      
    case "AND":
      return evaluar(expr.izquierda) && evaluar(expr.derecha);
      
    case "OR":
      return evaluar(expr.izquierda) || evaluar(expr.derecha);
      
    case "NOT":
      return !evaluar(expr.valor);
      
    case "CASTEO": {
      const valor = evaluar(expr.valor);
      switch (expr.tipoDato) {
        case 'entero': 
          // Si es un carácter, convertir a su código ASCII
          if (typeof valor === 'string' && valor.length === 1) {
            return valor.charCodeAt(0);
          }
          return parseInt(valor);
          
        case 'decimal': 
          // Si es un carácter, convertir a su código ASCII como decimal
          if (typeof valor === 'string' && valor.length === 1) {
            return parseFloat(valor.charCodeAt(0));
          }
          return parseFloat(valor);
          
        case 'booleano': 
          return Boolean(valor);
          
        case 'cadena': 
          return String(valor);
          
        case 'caracter': 
          // Si es un número, convertirlo a su carácter ASCII
          if (typeof valor === 'number') {
            return String.fromCharCode(valor);
          }
          // Si es cadena, tomar solo el primer carácter
          else if (typeof valor === 'string') {
            return valor.charAt(0);
          }
          return String(valor).charAt(0);
          
        default: 
          return valor;
      }
    }
    
    case "LLAMADA_EXPR": {
      const funcion = tablaFunciones.get(expr.id);
      if (!funcion) {
        errores.push({
          tipo: "Semántico",
          descripcion: `La función '${expr.id}' no existe`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      if (funcion.tipo !== 'FUNCION') {
        errores.push({
          tipo: "Semántico",
          descripcion: `'${expr.id}' es un procedimiento, no una función. No puede ser usado en una expresión`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      // IMPORTANTE: Crear una copia completa del ámbito actual
      const ambitoAnterior = new Map(tablaSimbolos);
      
      // Validar número de parámetros
      if (expr.parametros.length !== funcion.parametros.length) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Número incorrecto de parámetros para '${expr.id}'. Se esperaban ${funcion.parametros.length}, pero se recibieron ${expr.parametros.length}`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      // Evaluar todos los valores de los parámetros ANTES de modificar el ámbito
      const valoresParametros = [];
      for (let i = 0; i < expr.parametros.length; i++) {
        valoresParametros.push(evaluar(expr.parametros[i]));
      }
      
      // Asignar valores a los parámetros
      for (let i = 0; i < funcion.parametros.length; i++) {
        const param = funcion.parametros[i];
        tablaSimbolos.set(param.id, { tipo: param.tipo, valor: valoresParametros[i] });
      }
      
      let valorRetorno = null;
      
      try {
        // Ejecutar el cuerpo de la función
        for (const s of funcion.instrucciones) {
          ejecutar(s);
        }
        
        // Si llegamos aquí sin excepción de retorno, es un error
        errores.push({
          tipo: "Semántico",
          descripcion: `La función '${expr.id}' debe retornar un valor`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        
      } catch (e) {
        if (e instanceof RetornoException) {
          valorRetorno = e.valor;
          
          // Verificar que se retornó un valor
          if (valorRetorno === null) {
            errores.push({
              tipo: "Semántico",
              descripcion: `La función '${expr.id}' debe retornar un valor`,
              linea: expr.linea || 0,
              columna: expr.columna || 0
            });
          }
        } else {
          // Propagar otras excepciones
          throw e;
        }
      } finally {
        // Restaurar ámbito anterior COMPLETAMENTE
        tablaSimbolos.clear();
        for (const [key, value] of ambitoAnterior) {
          tablaSimbolos.set(key, value);
        }
      }
      
      return valorRetorno;
    }
    
    case "LLAMADA_METODO_EXPR": {
      const instancia = tablaInstanciasObjetos.get(expr.objeto);
      if (!instancia) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El objeto '${expr.objeto}' no ha sido instanciado`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      const definicionObj = tablaDefinicionObjetos.get(instancia.tipo);
      const metodo = definicionObj.metodos.get(expr.metodo);
      if (!metodo) {
        errores.push({
          tipo: "Semántico",
          descripcion: `El método '${expr.metodo}' no existe en el objeto de tipo '${instancia.tipo}'`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      // Verificar parámetros
      if (expr.parametros.length !== metodo.parametros.length) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Número incorrecto de parámetros para el método '${expr.metodo}'. Se esperaban ${metodo.parametros.length}, pero se recibieron ${expr.parametros.length}`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      // Guardar ámbito actual
      const ambitoAnterior = new Map(tablaSimbolos);
      
      // Agregar atributos del objeto al ámbito
      for (const [id, valor] of instancia.atributos) {
        tablaSimbolos.set(id, valor);
      }
      
      // Agregar parámetros del método
      for (let i = 0; i < metodo.parametros.length; i++) {
        const param = metodo.parametros[i];
        const valor = evaluar(expr.parametros[i]);
        tablaSimbolos.set(param.id, { tipo: param.tipo, valor: valor });
      }
      
      let valorRetorno = null;
      
      try {
        // Ejecutar método
        for (const sentencia of metodo.instrucciones) {
          try {
            ejecutar(sentencia);
          } catch (e) {
            if (e instanceof RetornoException) {
              valorRetorno = e.valor;
              break;
            } else {
              throw e;
            }
          }
        }
      } finally {
        // Restaurar ámbito anterior
        tablaSimbolos.clear();
        for (const [key, value] of ambitoAnterior) {
          tablaSimbolos.set(key, value);
        }
        
        // Actualizar valores de atributos
        for (const [id, valor] of instancia.atributos) {
          if (tablaSimbolos.has(id)) {
            instancia.atributos.set(id, tablaSimbolos.get(id));
          }
        }
      }
      
      return valorRetorno;
    }
    
    case "FUNCION_NATIVA": {
      const nombreFuncion = expr.nombre;
      
      switch (nombreFuncion) {
          case "minuscula": {
              const argumento = evaluar(expr.argumentos[0]);
              if (typeof argumento !== 'string') {
                  errores.push({
                      tipo: "Semántico",
                      descripcion: `La función 'minuscula' requiere un argumento de tipo cadena, pero recibió ${typeof argumento}`,
                      linea: expr.linea || 0,
                      columna: expr.columna || 0
                  });
                  return null;
              }
              return argumento.toLowerCase();
          }
          
          case "mayuscula": {
              const argumento = evaluar(expr.argumentos[0]);
              if (typeof argumento !== 'string') {
                  errores.push({
                      tipo: "Semántico",
                      descripcion: `La función 'mayuscula' requiere un argumento de tipo cadena, pero recibió ${typeof argumento}`,
                      linea: expr.linea || 0,
                      columna: expr.columna || 0
                  });
                  return null;
              }
              return argumento.toUpperCase();
          }
          
          case "longitud": {
              const argumento = evaluar(expr.argumentos[0]);
              if (typeof argumento === 'string' || Array.isArray(argumento)) {
                  return argumento.length;
              }
              errores.push({
                  tipo: "Semántico",
                  descripcion: `La función 'longitud' requiere un argumento de tipo cadena o lista, pero recibió ${typeof argumento}`,
                  linea: expr.linea || 0,
                  columna: expr.columna || 0
              });
              return null;
          }
          
          case "truncar": {
              const argumento = evaluar(expr.argumentos[0]);
              if (typeof argumento !== 'number') {
                  errores.push({
                      tipo: "Semántico",
                      descripcion: `La función 'truncar' requiere un argumento numérico, pero recibió ${typeof argumento}`,
                      linea: expr.linea || 0,
                      columna: expr.columna || 0
                  });
                  return null;
              }
              return Math.trunc(argumento);
          }
          
          case "redondear": {
              const argumento = evaluar(expr.argumentos[0]);
              if (typeof argumento !== 'number') {
                  errores.push({
                      tipo: "Semántico",
                      descripcion: `La función 'redondear' requiere un argumento numérico, pero recibió ${typeof argumento}`,
                      linea: expr.linea || 0,
                      columna: expr.columna || 0
                  });
                  return null;
              }
              return Math.round(argumento);
          }
          
          case "tipo": {
              const argumento = evaluar(expr.argumentos[0]);
              
              if (argumento === null || argumento === undefined) {
                  return "nulo";
              }
              
              // Determinar el tipo según las reglas de SimpliCode
              if (typeof argumento === 'number') {
                  return Number.isInteger(argumento) ? "entero" : "decimal";
              } else if (typeof argumento === 'string') {
                  return argumento.length === 1 ? "caracter" : "cadena";
              } else if (typeof argumento === 'boolean') {
                  return "booleano";
              } else if (Array.isArray(argumento)) {
                  return "lista";
              } else if (typeof argumento === 'object') {
                  return "objeto";
              } else {
                  return "desconocido";
              }
          }
          
          default:
              errores.push({
                  tipo: "Semántico",
                  descripcion: `Función nativa '${nombreFuncion}' no reconocida`,
                  linea: expr.linea || 0,
                  columna: expr.columna || 0
              });
              return null;
      }
    }
    
    case "POST_INCREMENTO_EXPR": {
      if (!tablaSimbolos.has(expr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${expr.id} no declarada`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      const variable = tablaSimbolos.get(expr.id);
      if (typeof variable.valor !== 'number') {
        errores.push({
          tipo: "Semántico",
          descripcion: `El operador ++ solo puede aplicarse a variables numéricas`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      const valorAnterior = variable.valor;
      variable.valor++;
      return valorAnterior; // Devuelve el valor antes del incremento
    }

    case "POST_DECREMENTO_EXPR": {
      if (!tablaSimbolos.has(expr.id)) {
        errores.push({
          tipo: "Semántico",
          descripcion: `Variable ${expr.id} no declarada`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      const variable = tablaSimbolos.get(expr.id);
      if (typeof variable.valor !== 'number') {
        errores.push({
          tipo: "Semántico",
          descripcion: `El operador -- solo puede aplicarse a variables numéricas`,
          linea: expr.linea || 0,
          columna: expr.columna || 0
        });
        return null;
      }
      
      const valorAnterior = variable.valor;
      variable.valor--;
      return valorAnterior; // Devuelve el valor antes del decremento
    }
    
    default:
      errores.push({
        tipo: "Interno",
        descripcion: `Expresión desconocida: ${JSON.stringify(expr)}`,
        linea: expr.linea || 0, // Asegúrate de que las instrucciones incluyan esta información
        columna: expr.columna || 0
      });
      return null;
  }
}

// Función de utilidad para comparaciones de punto flotante
function sonNumerosIguales(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    const tolerancia = 1e-10;
    return Math.abs(a - b) < tolerancia;
  }
  return a === b;
}

module.exports = interpretar;
module.exports.interpretar = interpretar;
