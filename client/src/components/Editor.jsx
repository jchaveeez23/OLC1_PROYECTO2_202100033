import { useState } from "react";
import axios from "axios";
import Split from "react-split";
import Consola from "./Consola";
import Simbolos from "./Simbolos";
import Errores from "./Errores";
import AST from "./AST";

export default function Editor() {
  const [tabs, setTabs] = useState([
    { id: "tab1", name: "nuevo_archivo.ci", content: "", active: true }
  ]);
  const [astDot, setAstDot] = useState("");
  const [consola, setConsola] = useState("");
  const [errores, setErrores] = useState([]);
  const [simbolos, setSimbolos] = useState([]);
  const [activeResultTab, setActiveResultTab] = useState("consola");

  const getActiveTab = () => tabs.find(tab => tab.active) || tabs[0];
  const getActiveCode = () => getActiveTab().content;

  const updateActiveTabContent = (content) => {
    setTabs(tabs.map(tab => 
      tab.active ? { ...tab, content } : tab
    ));
  };

  const ejecutar = async () => {
    try {
      const res = await axios.post("http://localhost:3001/interpretar", { 
        codigo: getActiveCode() 
      });

      setConsola(res.data.consola);
      setErrores(res.data.errores);
      setSimbolos(res.data.simbolos);
      setAstDot(res.data.ast);

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

  const changeTab = (id) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      active: tab.id === id
    })));
  };

  const closeTab = (id, e) => {
    e.stopPropagation();

    if (tabs.length === 1) {
      crearNuevo();
      return;
    }

    const isActive = tabs.find(tab => tab.id === id).active;
    let newTabs = tabs.filter(tab => tab.id !== id);

    if (isActive && newTabs.length > 0) {
      newTabs[newTabs.length - 1].active = true;
    }

    setTabs(newTabs);
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-logo">SimpliCode</div>
        <div className="tools-container">
          <button className="tool-button" onClick={crearNuevo}>Nuevo</button>
          <button className="tool-button" onClick={abrirArchivo}>Abrir</button>
          <button className="tool-button" onClick={guardarArchivo}>Guardar</button>
          <button className="tool-button primary" onClick={ejecutar}>Ejecutar</button>
        </div>
      </div>

      <div className="app-content" style={{ height: 'calc(100vh - 51px)' }}>
        <Split
          className="split"
          direction="vertical"
          sizes={[70, 30]}
          minSize={100}
          gutterSize={5}
          style={{ height: '100%' }}
        >
          {/* Editor Panel */}
          <div className="editor-container">
            <div className="tabs-container">
              {tabs.map(tab => (
                <div 
                  key={tab.id}
                  className={`tab ${tab.active ? 'active' : ''}`}
                  onClick={() => changeTab(tab.id)}
                >
                  {tab.name}
                  <span className="close-icon" onClick={(e) => closeTab(tab.id, e)}>✖</span>
                </div>
              ))}
            </div>
            <textarea
              className="editor-textarea"
              value={getActiveCode()}
              onChange={(e) => updateActiveTabContent(e.target.value)}
              placeholder="Escribe tu código aquí..."
              style={{ height: 'calc(100% - 32px)' }}
            />
          </div>

          {/* Result Panel */}
          <div className="results-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="results-tabs">
              <button className={`result-tab ${activeResultTab === 'consola' ? 'active' : ''}`} onClick={() => setActiveResultTab('consola')}>Consola</button>
              <button className={`result-tab ${activeResultTab === 'simbolos' ? 'active' : ''}`} onClick={() => setActiveResultTab('simbolos')}>Tabla de Símbolos</button>
              <button className={`result-tab ${activeResultTab === 'errores' ? 'active' : ''}`} onClick={() => setActiveResultTab('errores')}>
                Errores
                {errores.length > 0 && <span className="error-badge">{errores.length}</span>}
              </button>
              <button className={`result-tab ${activeResultTab === 'ast' ? 'active' : ''}`} onClick={() => setActiveResultTab('ast')}>AST</button>
            </div>

            <div className="result-content" style={{ height: 'calc(100% - 40px)', overflow: 'hidden' }}>
              {activeResultTab === "consola" && <Consola texto={consola} />}
              {activeResultTab === "simbolos" && <Simbolos data={simbolos} />}
              {activeResultTab === "errores" && <Errores data={errores} />}
              {activeResultTab === "ast" && <AST dot={astDot} />}
            </div>
          </div>
        </Split>
      </div>
    </div>
  );
}
