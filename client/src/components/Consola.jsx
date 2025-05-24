import { useEffect, useRef } from 'react';

export default function Consola({ texto }) {
  const consolaRef = useRef(null);
  
  useEffect(() => {
    if (consolaRef.current) {
      consolaRef.current.scrollTop = consolaRef.current.scrollHeight;
    }
  }, [texto]);

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <pre 
        className="consola" 
        ref={consolaRef}
        style={{
          backgroundColor: "#1e1e1e",
          color: "#a6e3a1",
          padding: "10px",
          margin: 0,
          height: "100%", // Cambiado para usar 100%
          width: "100%",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "14px",
          whiteSpace: "pre-wrap",
          boxSizing: "border-box"
        }}
      >
        {texto || "La consola está vacía. Ejecuta tu código para ver los resultados."}
      </pre>
    </div>
  );
}