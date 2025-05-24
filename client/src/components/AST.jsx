import React, { useEffect, useState, useRef } from "react";
import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";

export default function AST({ dot }) {
  const [svg, setSvg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const svgRef = useRef(null);
  const [svgString, setSvgString] = useState("");

  useEffect(() => {
    if (!dot || typeof dot !== "string") {
      setSvg("<p>No se generó ningún AST.</p>");
      return;
    }

    setIsLoading(true);
    const viz = new Viz({ Module, render });

    // Agregar opciones para generar SVG de alta calidad
    const options = {
      engine: "dot",
      format: "svg",
      scale: 2, // Factor de escalado para mejor calidad
    };

    viz.renderString(dot, options)
      .then((result) => {
        setSvg(result);
        setSvgString(result); // Guardar el string SVG completo
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al generar AST:", err);
        setSvg("<p>Error al generar AST.</p>");
        setIsLoading(false);
      });
  }, [dot]);

  // Función para descargar SVG original completo
  const downloadAsSVG = () => {
    if (!svgString) return;
    
    // Crear un Blob con el SVG completo
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    
    // Crear URL para el blob
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);
    
    // Crear enlace de descarga
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "AST_SimpliCode.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Liberar la URL
    setTimeout(() => {
      DOMURL.revokeObjectURL(url);
    }, 100);
  };

  // Función para abrir SVG en una nueva ventana (para zoom)
  const openSVGInNewWindow = () => {
    if (!svgString) return;
    
    // Abrir nueva ventana con el SVG
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      alert("El navegador ha bloqueado la apertura de una nueva ventana. Por favor, permite ventanas emergentes para esta página.");
      return;
    }
    
    // Contenido HTML para la nueva ventana
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AST SimpliCode - Visualización Completa</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f5f5f5;
            }
            .controls {
              position: fixed;
              top: 10px;
              left: 10px;
              z-index: 1000;
              background: rgba(255,255,255,0.9);
              padding: 10px;
              border-radius: 5px;
              box-shadow: 0 0 5px rgba(0,0,0,0.2);
            }
            .svg-container {
              min-width: 100%;
              min-height: 100vh;
            }
            button {
              background-color: #4CAF50;
              border: none;
              color: white;
              padding: 5px 10px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 14px;
              margin: 2px;
              cursor: pointer;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="controls">
            <button id="zoomIn">Zoom In (+)</button>
            <button id="zoomOut">Zoom Out (-)</button>
            <button id="resetZoom">Restablecer Zoom</button>
            <button id="download">Descargar SVG</button>
          </div>
          <div class="svg-container">${svgString}</div>
          <script>
            // Añadir funcionalidad de zoom
            let scale = 1;
            const svgElement = document.querySelector('svg');
            
            document.getElementById('zoomIn').addEventListener('click', () => {
              scale *= 1.2;
              svgElement.style.transform = 'scale(' + scale + ')';
              svgElement.style.transformOrigin = '0 0';
            });
            
            document.getElementById('zoomOut').addEventListener('click', () => {
              scale /= 1.2;
              svgElement.style.transform = 'scale(' + scale + ')';
              svgElement.style.transformOrigin = '0 0';
            });
            
            document.getElementById('resetZoom').addEventListener('click', () => {
              scale = 1;
              svgElement.style.transform = 'scale(1)';
            });
            
            document.getElementById('download').addEventListener('click', () => {
              const svgString = new XMLSerializer().serializeToString(svgElement);
              const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
              const url = URL.createObjectURL(svgBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'AST_SimpliCode.svg';
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 100);
            });
            
            // Permitir zoom con la rueda del mouse
            document.addEventListener('wheel', (e) => {
              if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                  scale *= 1.1;
                } else {
                  scale /= 1.1;
                }
                svgElement.style.transform = 'scale(' + scale + ')';
                svgElement.style.transformOrigin = '0 0';
              }
            }, { passive: false });
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  // Estilos para botones
  const buttonStyle = {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "10px 5px 10px 0",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.3s"
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2196F3"
  };

  return (
    <div className="seccion">
      <h3>Árbol de Sintaxis (AST)</h3>
      {isLoading ? (
        <p>Generando AST...</p>
      ) : (
        <>
          {svg && (
            <div>
              <button 
                style={buttonStyle} 
                onClick={downloadAsSVG}
              >
                Descargar como SVG
              </button>
              <button 
                style={secondaryButtonStyle} 
                onClick={openSVGInNewWindow}
              >
                Ver en pantalla completa
              </button>
            </div>
          )}
          <div ref={svgRef} dangerouslySetInnerHTML={{ __html: svg }} />
        </>
      )}
    </div>
  );
}