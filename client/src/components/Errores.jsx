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
