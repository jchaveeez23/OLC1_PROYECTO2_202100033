export default function Simbolos({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-message" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        No hay símbolos disponibles.
      </div>
    );
  }

  // Función para formatear el valor según su tipo
  const formatSymbolValue = (valor, tipo) => {
    if (valor === null || valor === undefined) {
      return "null";
    }
    
    // Para objetos (incluyendo arrays)
    if (typeof valor === 'object') {
      return JSON.stringify(valor);
    }
    
    // Para cadenas: mostrar representación y valor original
    if (tipo === 'cadena') {
      const numericValues = Array.from(valor).map(char => char.charCodeAt(0));
      return `${JSON.stringify(valor)} (${numericValues.join(',')})`;
    }
    
    // Para caracteres: mostrar carácter entre comillas simples y su código ASCII/Unicode
    if (tipo === 'caracter' && typeof valor === 'string') {
      return `'${valor}' (${valor.charCodeAt(0)})`;
    }
    
    // Para valores decimales: asegurar que se muestre con punto decimal
    if (tipo === 'decimal') {
      const num = parseFloat(valor);
      return Number.isInteger(num) ? `${num}.0` : num.toString();
    }
    
    // Para booleanos: mostrar Verdadero/Falso en español
    if (tipo === 'booleano') {
      return valor ? "Verdadero" : "Falso";
    }
    
    // Para cualquier otro tipo
    return String(valor);
  };

  return (
    <div className="tabla-simbolos" style={{ height: '100%', overflowY: 'auto' }}>
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
                {formatSymbolValue(s.valor, s.tipo)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
