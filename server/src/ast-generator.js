let contador = 0;

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

function nuevoNodo(label, nodos) {
  const id = `n${contador++}`;
  const safeLabel = String(label).replace(/"/g, '\\"');
  nodos.push(`${id} [label="${safeLabel}"]`);
  return id;
}

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
    
    case "DECLARACION_MULTIPLE": {
      const raiz = nuevoNodo("DECLARACION_MULTIPLE", nodos);
      const tipoNode = nuevoNodo(`TIPO: ${nodo.tipoDato}`, nodos);
      conexiones.push(`${raiz} -> ${tipoNode}`);

      const idsNode = nuevoNodo("IDS", nodos);
      conexiones.push(`${raiz} -> ${idsNode}`);
      for (const id of nodo.ids) {
        const idNode = nuevoNodo(`ID: ${id}`, nodos);
        conexiones.push(`${idsNode} -> ${idNode}`);
      }
      
      if (nodo.valores && nodo.valores.length > 0) {
        const valsNode = nuevoNodo("VALORES", nodos);
        conexiones.push(`${raiz} -> ${valsNode}`);
        for (const val of nodo.valores) {
          const valNode = procesarNodo(val, nodos, conexiones);
          conexiones.push(`${valsNode} -> ${valNode}`);
        }
      }
      return raiz;
    }
    
    case "DECLARACION_LISTA": {
      const raiz = nuevoNodo("DECLARACION_LISTA", nodos);
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      const tipoNode = nuevoNodo(`TIPO: ${nodo.tipoDato}`, nodos);
      const dimNode = nuevoNodo(`DIMENSIONES: ${nodo.dimensiones}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      conexiones.push(`${raiz} -> ${tipoNode}`);
      conexiones.push(`${raiz} -> ${dimNode}`);
      
      if (nodo.valores && nodo.valores.length > 0) {
        const valsNode = nuevoNodo("VALORES", nodos);
        conexiones.push(`${raiz} -> ${valsNode}`);
        
        // Procesamiento mejorado para listas multidimensionales
        for (const val of nodo.valores) {
          const valNode = procesarNodo(val, nodos, conexiones);
          conexiones.push(`${valsNode} -> ${valNode}`);
        }
      }
      return raiz;
    }
    
    case "ASIGNACION": {
      const raiz = nuevoNodo("ASIGNACION", nodos);
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      const valNode = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${idNode}`);
      conexiones.push(`${raiz} -> ${valNode}`);
      return raiz;
    }
    
    case "ASIGNACION_MULTIPLE": {
      const raiz = nuevoNodo("ASIGNACION_MULTIPLE", nodos);
      const idsNode = nuevoNodo("IDS", nodos);
      conexiones.push(`${raiz} -> ${idsNode}`);
      for (const id of nodo.ids) {
        const idNode = nuevoNodo(`ID: ${id}`, nodos);
        conexiones.push(`${idsNode} -> ${idNode}`);
      }
      
      const valsNode = nuevoNodo("VALORES", nodos);
      conexiones.push(`${raiz} -> ${valsNode}`);
      for (const val of nodo.valores) {
        const valNode = procesarNodo(val, nodos, conexiones);
        conexiones.push(`${valsNode} -> ${valNode}`);
      }
      return raiz;
    }
    
    case "MODIFICACION_LISTA": {
      const raiz = nuevoNodo("MODIFICACION_LISTA", nodos);
      const accesoNode = procesarNodo(nodo.acceso, nodos, conexiones);
      const valorNode = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${accesoNode}`);
      conexiones.push(`${raiz} -> ${valorNode}`);
      return raiz;
    }
    
    case "IMPRIMIR": {
      const raiz = nuevoNodo("IMPRIMIR", nodos);
      const valNode = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${valNode}`);
      return raiz;
    }
    
    case "INCREMENTO": {
      const raiz = nuevoNodo("INCREMENTO", nodos);
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      return raiz;
    }
    
    case "DECREMENTO": {
      const raiz = nuevoNodo("DECREMENTO", nodos);
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      return raiz;
    }
    
    case "CONDICIONAL_SI": {
      const raiz = nuevoNodo("CONDICIONAL_SI", nodos);
      const condNode = nuevoNodo("CONDICION", nodos);
      conexiones.push(`${raiz} -> ${condNode}`);
      const condValNode = procesarNodo(nodo.condicion, nodos, conexiones);
      conexiones.push(`${condNode} -> ${condValNode}`);
      
      const siNode = nuevoNodo("INSTRUCCIONES_SI", nodos);
      conexiones.push(`${raiz} -> ${siNode}`);
      for (const instr of nodo.instrucciones_si) {
        const instrNode = procesarNodo(instr, nodos, conexiones);
        if (instrNode) {
          conexiones.push(`${siNode} -> ${instrNode}`);
        }
      }
      
      if (nodo.instrucciones_no) {
        const noNode = nuevoNodo("INSTRUCCIONES_NO", nodos);
        conexiones.push(`${raiz} -> ${noNode}`);
        for (const instr of nodo.instrucciones_no) {
          const instrNode = procesarNodo(instr, nodos, conexiones);
          if (instrNode) {
            conexiones.push(`${noNode} -> ${instrNode}`);
          }
        }
      }
      return raiz;
    }
    
    case "CONDICIONAL_SI_OSI": {
      const raiz = nuevoNodo("CONDICIONAL_SI_OSI", nodos);
      const condIniNode = nuevoNodo("CONDICION_INICIAL", nodos);
      conexiones.push(`${raiz} -> ${condIniNode}`);
      const condIniValNode = procesarNodo(nodo.condicion_inicial, nodos, conexiones);
      conexiones.push(`${condIniNode} -> ${condIniValNode}`);
      
      const instrIniNode = nuevoNodo("INSTRUCCIONES_INICIALES", nodos);
      conexiones.push(`${raiz} -> ${instrIniNode}`);
      for (const instr of nodo.instrucciones_inicial) {
        const instrNode = procesarNodo(instr, nodos, conexiones);
        if (instrNode) {
          conexiones.push(`${instrIniNode} -> ${instrNode}`);
        }
      }
      
      for (let i = 0; i < nodo.condiciones_osi.length; i++) {
        const condOsiNode = nuevoNodo(`CONDICION_OSI_${i + 1}`, nodos);
        conexiones.push(`${raiz} -> ${condOsiNode}`);
        const condOsiValNode = procesarNodo(nodo.condiciones_osi[i], nodos, conexiones);
        conexiones.push(`${condOsiNode} -> ${condOsiValNode}`);
        
        const instrOsiNode = nuevoNodo(`INSTRUCCIONES_OSI_${i + 1}`, nodos);
        conexiones.push(`${raiz} -> ${instrOsiNode}`);
        for (const instr of nodo.instrucciones_osi[i]) {
          const instrNode = procesarNodo(instr, nodos, conexiones);
          if (instrNode) {
            conexiones.push(`${instrOsiNode} -> ${instrNode}`);
          }
        }
      }
      
      if (nodo.instrucciones_else) {
        const elseNode = nuevoNodo("INSTRUCCIONES_ELSE", nodos);
        conexiones.push(`${raiz} -> ${elseNode}`);
        for (const instr of nodo.instrucciones_else) {
          const instrNode = procesarNodo(instr, nodos, conexiones);
          if (instrNode) {
            conexiones.push(`${elseNode} -> ${instrNode}`);
          }
        }
      }
      return raiz;
    }
    
    case "SELECCION_MULTIPLE": {
      const raiz = nuevoNodo("SELECCION_MULTIPLE", nodos);
      
      const exprNode = nuevoNodo("EXPRESION", nodos);
      conexiones.push(`${raiz} -> ${exprNode}`);
      const exprValNode = procesarNodo(nodo.expresion, nodos, conexiones);
      conexiones.push(`${exprNode} -> ${exprValNode}`);
      
      for (let i = 0; i < nodo.casos.length; i++) {
        const casoNode = nuevoNodo(`CASO_${i + 1}`, nodos);
        conexiones.push(`${raiz} -> ${casoNode}`);
        
        const valorCasoNode = nuevoNodo("VALOR_CASO", nodos);
        conexiones.push(`${casoNode} -> ${valorCasoNode}`);
        const valorCasoValNode = procesarNodo(nodo.casos[i], nodos, conexiones);
        conexiones.push(`${valorCasoNode} -> ${valorCasoValNode}`);
        
        const instrCasoNode = nuevoNodo("INSTRUCCIONES_CASO", nodos);
        conexiones.push(`${casoNode} -> ${instrCasoNode}`);
        for (const instr of nodo.valores[i]) {
          const instrNode = procesarNodo(instr, nodos, conexiones);
          if (instrNode) {
            conexiones.push(`${instrCasoNode} -> ${instrNode}`);
          }
        }
      }
      
      if (nodo.caso_contrario) {
        const defaultNode = nuevoNodo("CASO_CONTRARIO", nodos);
        conexiones.push(`${raiz} -> ${defaultNode}`);
        for (const instr of nodo.caso_contrario) {
          const instrNode = procesarNodo(instr, nodos, conexiones);
          if (instrNode) {
            conexiones.push(`${defaultNode} -> ${instrNode}`);
          }
        }
      }
      return raiz;
    }
    
    case "CASTEO": {
      const raiz = nuevoNodo(`CASTEO: ${nodo.tipoDato}`, nodos);
      const valNode = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${valNode}`);
      return raiz;
    }

    // Nuevas implementaciones para las estructuras faltantes
    case "CICLO_PARA": {
      const raiz = nuevoNodo("CICLO_PARA", nodos);
      
      const varNode = nuevoNodo(`VARIABLE: ${nodo.variable}`, nodos);
      conexiones.push(`${raiz} -> ${varNode}`);
      
      const valorInicialNode = nuevoNodo("VALOR_INICIAL", nodos);
      conexiones.push(`${raiz} -> ${valorInicialNode}`);
      const valorInicialValNode = procesarNodo(nodo.valorInicial, nodos, conexiones);
      conexiones.push(`${valorInicialNode} -> ${valorInicialValNode}`);
      
      const valorFinalNode = nuevoNodo("VALOR_FINAL", nodos);
      conexiones.push(`${raiz} -> ${valorFinalNode}`);
      const valorFinalValNode = procesarNodo(nodo.valorFinal, nodos, conexiones);
      conexiones.push(`${valorFinalNode} -> ${valorFinalValNode}`);
      
      const incrementoNode = nuevoNodo(`INCREMENTO: ${nodo.incremento.tipo}`, nodos);
      conexiones.push(`${raiz} -> ${incrementoNode}`);
      const incrementoIdNode = nuevoNodo(`ID: ${nodo.incremento.id}`, nodos);
      conexiones.push(`${incrementoNode} -> ${incrementoIdNode}`);
      
      const instrNode = nuevoNodo("INSTRUCCIONES", nodos);
      conexiones.push(`${raiz} -> ${instrNode}`);
      for (const instr of nodo.instrucciones) {
        const instrItemNode = procesarNodo(instr, nodos, conexiones);
        if (instrItemNode) {
          conexiones.push(`${instrNode} -> ${instrItemNode}`);
        }
      }
      
      return raiz;
    }
    
    case "CICLO_MIENTRAS": {
      const raiz = nuevoNodo("CICLO_MIENTRAS", nodos);
      
      const condNode = nuevoNodo("CONDICION", nodos);
      conexiones.push(`${raiz} -> ${condNode}`);
      const condValNode = procesarNodo(nodo.condicion, nodos, conexiones);
      conexiones.push(`${condNode} -> ${condValNode}`);
      
      const instrNode = nuevoNodo("INSTRUCCIONES", nodos);
      conexiones.push(`${raiz} -> ${instrNode}`);
      for (const instr of nodo.instrucciones) {
        const instrItemNode = procesarNodo(instr, nodos, conexiones);
        if (instrItemNode) {
          conexiones.push(`${instrNode} -> ${instrItemNode}`);
        }
      }
      
      return raiz;
    }
    
    case "CICLO_REPETIR": {
      const raiz = nuevoNodo("CICLO_REPETIR", nodos);
      
      const instrNode = nuevoNodo("INSTRUCCIONES", nodos);
      conexiones.push(`${raiz} -> ${instrNode}`);
      for (const instr of nodo.instrucciones) {
        const instrItemNode = procesarNodo(instr, nodos, conexiones);
        if (instrItemNode) {
          conexiones.push(`${instrNode} -> ${instrItemNode}`);
        }
      }
      
      const condNode = nuevoNodo("CONDICION", nodos);
      conexiones.push(`${raiz} -> ${condNode}`);
      const condValNode = procesarNodo(nodo.condicion, nodos, conexiones);
      conexiones.push(`${condNode} -> ${condValNode}`);
      
      return raiz;
    }
    
    case "DETENER": {
      return nuevoNodo("DETENER", nodos);
    }
    
    case "CONTINUAR": {
      return nuevoNodo("CONTINUAR", nodos);
    }
    
    case "LISTA_ANIDADA": {
      const raiz = nuevoNodo("LISTA_ANIDADA", nodos);
      
      // Procesamiento recursivo para estructuras anidadas de hasta 3 niveles
      function procesarNivel(valores, nodoActual, nivel) {
        const nodoNivel = nuevoNodo(`NIVEL ${nivel}`, nodos);
        conexiones.push(`${nodoActual} -> ${nodoNivel}`);
        
        for (const valor of valores) {
          if (valor && valor.tipo === 'LISTA_ANIDADA') {
            const nodoAnidado = nuevoNodo("LISTA_ANIDADA", nodos);
            conexiones.push(`${nodoNivel} -> ${nodoAnidado}`);
            procesarNivel(valor.valores, nodoAnidado, nivel + 1);
          } else {
            const nodoValor = procesarNodo(valor, nodos, conexiones);
            conexiones.push(`${nodoNivel} -> ${nodoValor}`);
          }
        }
      }
      
      if (nodo.valores && nodo.valores.length > 0) {
        procesarNivel(nodo.valores, raiz, 1);
      }
      
      return raiz;
    }
    
    case "ACCESO_LISTA": {
      const raiz = nuevoNodo("ACCESO_LISTA", nodos);
      
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      
      const indicesNode = nuevoNodo("INDICES", nodos);
      conexiones.push(`${raiz} -> ${indicesNode}`);
      
      // Procesar cada índice en la estructura multidimensional
      for (let i = 0; i < nodo.indices.length; i++) {
        const indiceNode = nuevoNodo(`INDICE ${i+1}`, nodos);
        conexiones.push(`${indicesNode} -> ${indiceNode}`);
        
        const indiceValNode = procesarNodo(nodo.indices[i], nodos, conexiones);
        conexiones.push(`${indiceNode} -> ${indiceValNode}`);
      }
      
      return raiz;
    }
    
    // Operadores binarios, relacionales y lógicos
    case "SUMA":
    case "RESTA":
    case "MULTIPLICACION":
    case "DIVISION":
    case "POTENCIA":
    case "MODULO":
    case "IGUAL":
    case "DIFERENTE":
    case "MENOR_QUE":
    case "MENOR_IGUAL":
    case "MAYOR_QUE":
    case "MAYOR_IGUAL": {
      const raiz = nuevoNodo(nodo.tipo, nodos);
      const izq = procesarNodo(nodo.izquierda, nodos, conexiones);
      const der = procesarNodo(nodo.derecha, nodos, conexiones);
      conexiones.push(`${raiz} -> ${izq}`);
      conexiones.push(`${raiz} -> ${der}`);
      return raiz;
    }
    
    case "AND":
    case "OR": {
      const raiz = nuevoNodo(nodo.tipo, nodos);
      const izq = procesarNodo(nodo.izquierda, nodos, conexiones);
      const der = procesarNodo(nodo.derecha, nodos, conexiones);
      conexiones.push(`${raiz} -> ${izq}`);
      conexiones.push(`${raiz} -> ${der}`);
      return raiz;
    }
    
    case "NOT": {
      const raiz = nuevoNodo(nodo.tipo, nodos);
      const sub = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${sub}`);
      return raiz;
    }
    
    case "NEGACION": {
      const raiz = nuevoNodo("NEGACION", nodos);
      const sub = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${sub}`);
      return raiz;
    }
    
    // Literales y variables
    case "NUMERO":
      return nuevoNodo(`NUM: ${nodo.valor}`, nodos);
    
    case "DECIMAL":
      return nuevoNodo(`DEC: ${nodo.valor}`, nodos);
    
    case "BOOLEANO":
      return nuevoNodo(`BOOL: ${nodo.valor}`, nodos);
    
    case "CADENA":
      return nuevoNodo(`CAD: ${nodo.valor}`, nodos);
    
    case "CARACTER":
      return nuevoNodo(`CAR: ${nodo.valor}`, nodos);
    
    case "ID":
      return nuevoNodo(`ID: ${nodo.nombre}`, nodos);
    
    case "RETORNAR": {
      const raiz = nuevoNodo("RETORNAR", nodos);
      if (nodo.valor) {
        const valorNode = procesarNodo(nodo.valor, nodos, conexiones);
        conexiones.push(`${raiz} -> ${valorNode}`);
      }
      return raiz;
    }
    
    case "FUNCION": {
      const raiz = nuevoNodo("FUNCION", nodos);
      
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      
      const tipoRetornoNode = nuevoNodo(`TIPO_RETORNO: ${nodo.tipoRetorno}`, nodos);
      conexiones.push(`${raiz} -> ${tipoRetornoNode}`);
      
      // Parámetros
      if (nodo.parametros && nodo.parametros.length > 0) {
        const paramsNode = nuevoNodo("PARAMETROS", nodos);
        conexiones.push(`${raiz} -> ${paramsNode}`);
        
        for (const param of nodo.parametros) {
          const paramNode = nuevoNodo(`PARAM: ${param.id} (${param.tipo})`, nodos);
          conexiones.push(`${paramsNode} -> ${paramNode}`);
        }
      }
      
      // Instrucciones
      const instrNode = nuevoNodo("INSTRUCCIONES", nodos);
      conexiones.push(`${raiz} -> ${instrNode}`);
      
      for (const instr of nodo.instrucciones) {
        const instrItemNode = procesarNodo(instr, nodos, conexiones);
        if (instrItemNode) {
          conexiones.push(`${instrNode} -> ${instrItemNode}`);
        }
      }
      
      return raiz;
    }
    
    case "PROCEDIMIENTO": {
      const raiz = nuevoNodo("PROCEDIMIENTO", nodos);
      
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      
      // Parámetros
      if (nodo.parametros && nodo.parametros.length > 0) {
        const paramsNode = nuevoNodo("PARAMETROS", nodos);
        conexiones.push(`${raiz} -> ${paramsNode}`);
        
        for (const param of nodo.parametros) {
          const paramNode = nuevoNodo(`PARAM: ${param.id} (${param.tipo})`, nodos);
          conexiones.push(`${paramsNode} -> ${paramNode}`);
        }
      }
      
      // Instrucciones
      const instrNode = nuevoNodo("INSTRUCCIONES", nodos);
      conexiones.push(`${raiz} -> ${instrNode}`);
      
      for (const instr of nodo.instrucciones) {
        const instrItemNode = procesarNodo(instr, nodos, conexiones);
        if (instrItemNode) {
          conexiones.push(`${instrNode} -> ${instrItemNode}`);
        }
      }
      
      return raiz;
    }
    
    case "LLAMADA": {
      const raiz = nuevoNodo("LLAMADA", nodos);
      
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      
      if (nodo.parametros && nodo.parametros.length > 0) {
        const paramsNode = nuevoNodo("ARGUMENTOS", nodos);
        conexiones.push(`${raiz} -> ${paramsNode}`);
        
        for (const param of nodo.parametros) {
          const paramValNode = procesarNodo(param, nodos, conexiones);
          conexiones.push(`${paramsNode} -> ${paramValNode}`);
        }
      }
      
      return raiz;
    }
    
    case "LLAMADA_EXPR": {
      const raiz = nuevoNodo("LLAMADA_EXPR", nodos);
      
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      
      if (nodo.parametros && nodo.parametros.length > 0) {
        const paramsNode = nuevoNodo("ARGUMENTOS", nodos);
        conexiones.push(`${raiz} -> ${paramsNode}`);
        
        for (const param of nodo.parametros) {
          const paramValNode = procesarNodo(param, nodos, conexiones);
          conexiones.push(`${paramsNode} -> ${paramValNode}`);
        }
      }
      
      return raiz;
    }

    case "DEFINICION_OBJETO": {
      const raiz = nuevoNodo("DEFINICION_OBJETO", nodos);
      
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      
      if (nodo.atributos && nodo.atributos.length > 0) {
        const atributosNode = nuevoNodo("ATRIBUTOS", nodos);
        conexiones.push(`${raiz} -> ${atributosNode}`);
        
        for (const atributo of nodo.atributos) {
          const atributoNode = nuevoNodo(`${atributo.id}: ${atributo.tipo}`, nodos);
          conexiones.push(`${atributosNode} -> ${atributoNode}`);
        }
      }
      
      return raiz;
    }

    case "DEFINICION_METODO": {
      const raiz = nuevoNodo("DEFINICION_METODO", nodos);
      
      const objetoNode = nuevoNodo(`OBJETO: ${nodo.objeto}`, nodos);
      conexiones.push(`${raiz} -> ${objetoNode}`);
      
      const metodoNode = nuevoNodo(`METODO: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${metodoNode}`);
      
      if (nodo.parametros && nodo.parametros.length > 0) {
        const paramsNode = nuevoNodo("PARAMETROS", nodos);
        conexiones.push(`${raiz} -> ${paramsNode}`);
        
        for (const param of nodo.parametros) {
          const paramNode = nuevoNodo(`${param.id}: ${param.tipo}`, nodos);
          conexiones.push(`${paramsNode} -> ${paramNode}`);
        }
      }
      
      const instrNode = nuevoNodo("INSTRUCCIONES", nodos);
      conexiones.push(`${raiz} -> ${instrNode}`);
      
      for (const instr of nodo.instrucciones) {
        const instrItemNode = procesarNodo(instr, nodos, conexiones);
        if (instrItemNode) {
          conexiones.push(`${instrNode} -> ${instrItemNode}`);
        }
      }
      
      return raiz;
    }

    case "INSTANCIACION_OBJETO": {
      const raiz = nuevoNodo("INSTANCIACION_OBJETO", nodos);
      
      const tipoNode = nuevoNodo(`TIPO: ${nodo.tipoObjeto}`, nodos);
      conexiones.push(`${raiz} -> ${tipoNode}`);
      
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      conexiones.push(`${raiz} -> ${idNode}`);
      
      if (nodo.valores && nodo.valores.length > 0) {
        const valoresNode = nuevoNodo("VALORES", nodos);
        conexiones.push(`${raiz} -> ${valoresNode}`);
        
        for (const valor of nodo.valores) {
          const valorNode = procesarNodo(valor, nodos, conexiones);
          conexiones.push(`${valoresNode} -> ${valorNode}`);
        }
      }
      
      return raiz;
    }

    case "LLAMADA_METODO": {
      const raiz = nuevoNodo("LLAMADA_METODO", nodos);
      
      const objetoNode = nuevoNodo(`OBJETO: ${nodo.objeto}`, nodos);
      conexiones.push(`${raiz} -> ${objetoNode}`);
      
      const metodoNode = nuevoNodo(`METODO: ${nodo.metodo}`, nodos);
      conexiones.push(`${raiz} -> ${metodoNode}`);
      
      if (nodo.parametros && nodo.parametros.length > 0) {
        const paramsNode = nuevoNodo("PARAMETROS", nodos);
        conexiones.push(`${raiz} -> ${paramsNode}`);
        
        for (const param of nodo.parametros) {
          const paramNode = procesarNodo(param, nodos, conexiones);
          conexiones.push(`${paramsNode} -> ${paramNode}`);
        }
      }
      
      return raiz;
    }

    case "LLAMADA_METODO_EXPR": {
      const raiz = nuevoNodo("LLAMADA_METODO_EXPR", nodos);
      
      const objetoNode = nuevoNodo(`OBJETO: ${nodo.objeto}`, nodos);
      conexiones.push(`${raiz} -> ${objetoNode}`);
      
      const metodoNode = nuevoNodo(`METODO: ${nodo.metodo}`, nodos);
      conexiones.push(`${raiz} -> ${metodoNode}`);
      
      if (nodo.parametros && nodo.parametros.length > 0) {
        const paramsNode = nuevoNodo("PARAMETROS", nodos);
        conexiones.push(`${raiz} -> ${paramsNode}`);
        
        for (const param of nodo.parametros) {
          const paramNode = procesarNodo(param, nodos, conexiones);
          conexiones.push(`${paramsNode} -> ${paramNode}`);
        }
      }
      
      return raiz;
    }

    case "ACCESO_ATRIBUTO": {
      const raiz = nuevoNodo("ACCESO_ATRIBUTO", nodos);
      
      const objetoNode = nuevoNodo(`OBJETO: ${nodo.objeto}`, nodos);
      conexiones.push(`${raiz} -> ${objetoNode}`);
      
      const atributoNode = nuevoNodo(`ATRIBUTO: ${nodo.atributo}`, nodos);
      conexiones.push(`${raiz} -> ${atributoNode}`);
      
      return raiz;
    }
    
    case "FUNCION_NATIVA": {
      const raiz = nuevoNodo(`FUNCIÓN NATIVA: ${nodo.nombre}`, nodos);
      
      if (nodo.argumentos && nodo.argumentos.length > 0) {
        const argsNode = nuevoNodo("ARGUMENTOS", nodos);
        conexiones.push(`${raiz} -> ${argsNode}`);
        
        for (const arg of nodo.argumentos) {
          const argNode = procesarNodo(arg, nodos, conexiones);
          conexiones.push(`${argsNode} -> ${argNode}`);
        }
      }
      
      return raiz;
    }
    
    default:
      return nuevoNodo(`Desconocido: ${JSON.stringify(nodo)}`, nodos);
  }
}

module.exports = { generarAST };
