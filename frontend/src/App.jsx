import { useEffect, useMemo, useState } from "react";
import disjuntoresImg from "./assets/missions/disjuntores.jpeg";
import seccionadorasImg from "./assets/missions/seccionadoras.jpg";
import transformadoresImg from "./assets/missions/transformadores.jpeg";
import dock2Img from "./assets/docks/dock2.jpeg";
import dock3Img from "./assets/docks/dock3.jpeg";
import { api } from "./services/api";
import Sidebar from "./components/Sidebar";

//const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://dji-dock-control-ws.onrender.com";



const statusStyles = {
  Salva: "bg-yellow-500/20 text-yellow-300",
  Agendada: "bg-blue-500/20 text-blue-300",
  Executada: "bg-emerald-500/20 text-emerald-300",
  Online: "bg-sky-500/20 text-sky-300",
  Disponível: "bg-emerald-500/20 text-emerald-300",
  "Em carregamento": "bg-violet-500/20 text-violet-300",
  "Em execução": "bg-blue-500/20 text-blue-300",
  Pendente: "bg-yellow-500/20 text-yellow-300",
  Concluída: "bg-emerald-500/20 text-emerald-300",
};

function App() {
  const [projects, setProjects] = useState([]);
  const [docks, setDocks] = useState([]);
  const [missions, setMissions] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [missionStatus, setMissionStatus] = useState({});
  const [loading, setLoading] = useState({ projects: false, missions: false });
  const [error, setError] = useState("");
  const [missionFilter, setMissionFilter] = useState("Todas");

  const missionFilterOptions = ["Todas", "Agendadas", "Pendente", "Em execução", "Concluídas"];
  const [theme, setTheme] = useState("dark");
  const isDark = theme === "dark";

  const surface = isDark ? "bg-slate-900/90 border-white/10 text-slate-100" : "bg-white border-slate-200 text-slate-900";
  const panel = isDark ? "bg-slate-950/80 border-white/10" : "bg-slate-50 border-slate-200";
  const missionCard = isDark
    ? "bg-gradient-to-r from-slate-900/60 to-slate-950/40 border border-white/10 shadow-lg shadow-slate-950/30"
    : "bg-white border border-slate-200 shadow-lg shadow-slate-900/10";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const toggleButton = isDark
    ? "bg-slate-800/80 border border-white/10 text-slate-100 hover:bg-slate-700/90"
    : "bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-50";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

  async function testApi() {
    try {
      const response = await api.get("/projects");

      console.log("API FUNCIONANDO OK:", response.data);
    } catch (error) {
      console.error("Erro API:", error);
    }
  }

  testApi();

  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme, isDark]);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading((current) => ({ ...current, projects: true }));
      setError("");

      try {
        const response = await fetch(`${API_BASE}/projects`);
        const data = await response.json();
        setProjects(data);
        if (data.length) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        setError("Não foi possível carregar os projects.");
      } finally {
        setLoading((current) => ({ ...current, projects: false }));
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId === null) return;

    const loadDocks = async () => {
      try {
        const response = await fetch(`${API_BASE}/docks/projects/${selectedProjectId}/docks`);
        const data = await response.json();
        setDocks(data);
      } catch (err) {
        setError("Não foi possível carregar os docks.");
      }
    };

    const loadMissions = async () => {
      setLoading((current) => ({ ...current, missions: true }));
      setError("");

      try {
        const response = await fetch(`${API_BASE}/missions/projects/${selectedProjectId}/missions`);
        const data = await response.json();
        setMissions(data);
      } catch (err) {
        setError("Não foi possível carregar as missions.");
      } finally {
        setLoading((current) => ({ ...current, missions: false }));
      }
    };

    loadDocks();
    loadMissions();
  }, [selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const selectedDock = useMemo(() => {
    return docks.length ? docks[0] : null;
  }, [docks]);

  const filteredMissions = useMemo(() => {
    if (missionFilter === "Todas") return missions;
    const statusMap = {
      Agendadas: "Agendada",
      Pendente: "Salva",
      "Em execução": "Em execução",
      Concluídas: "Executada",
    };
    return missions.filter((mission) => {
      const currentStatus = missionStatus[mission.id] ?? mission.status;
      return currentStatus === statusMap[missionFilter];
    });
  }, [missions, missionFilter, missionStatus]);

  const getMissionImage = (missionId) => {
    const imageMap = {
      1: transformadoresImg,
      2: disjuntoresImg,
      3: seccionadorasImg,
      4: transformadoresImg,
      5: disjuntoresImg,
    };
    return imageMap[missionId] || transformadoresImg;
  };

  const getDockThumbnail = (dockId) => {
    const thumbnailMap = {
      1: dock2Img,
      2: dock3Img,
    };
    return thumbnailMap[dockId] || dock2Img;
  };


  const handleExecute = (missionId) => {
    setMissionStatus((current) => ({
      ...current,
      [missionId]: current[missionId] === "Executada" ? "Agendada" : "Executada",
    }));
  };

  if (loading.projects && !projects.length) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-500 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
        <p className={`rounded-3xl px-6 py-4 text-lg transition-colors duration-500 ${isDark ? "bg-slate-900/80 text-slate-200 shadow-slate-900/40" : "bg-white shadow-slate-900/10 text-slate-900"}`}>
          Carregando dados do sistema...
        </p>
      </div>
    );
  }

  return (




    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* LEFT SIDEBAR */}
        <Sidebar 
          isDark={isDark} 
          error={error} 
          projects={projects} 
          docks={docks}
          mutedText={mutedText}
          panel={panel}
          statusStyles={statusStyles}
          surface={surface}
          selectedProject={selectedProject}
          selectedDock={selectedDock}
          getDockThumbnail={getDockThumbnail}
          setSelectedProjectId={setSelectedProjectId}
        />



        {/* MAIN CONTENT */}
        <main className="px-6 py-8 lg:px-8 overflow-y-auto">
          {/* HEADER */}
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Operational Control</p>
            <h2 className={`mt-2 text-3xl font-semibold transition-colors duration-500 ${isDark ? "text-white" : "text-slate-900"}`}>
              {selectedProject?.name ?? "Selecione um projeto"}
            </h2>
            {selectedProject && (
              <p className={`mt-2 text-sm transition-colors duration-500 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {selectedProject.description}
              </p>
            )}
          </div>




          {/* DIREITA */}
          <div className="fixed right-6 top-6 z-50 flex items-center gap-2">

            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${toggleButton}`}
            >
              {isDark ? "☀️ Claro" : "🌙 Escuro"}
            </button>

          </div>







          {/* MISSIONS SECTION */}
          <div className={`rounded-[2rem] p-6 shadow-[0_40px_120px_-80px_rgba(15,23,42,0.8)] flex h-full min-h-[48vh] max-h-[75vh] flex-col overflow-hidden transition-colors duration-500 ${panel}`}>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className={`text-xl font-semibold transition-colors duration-500 ${isDark ? "text-white" : "text-slate-900"}`}>Missões</h3>
                <p className={`mt-1 text-sm transition-colors duration-500 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Planeje e execute inspeções autônomas</p>
              </div>
              <button className="rounded-3xl bg-sky-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 whitespace-nowrap">
                + Nova Missão
              </button>
            </div>

            {/* FILTERS */}
            <div className={`mb-6 flex flex-wrap gap-2 pb-4 transition-colors duration-500 ${isDark ? "border-b border-white/10" : "border-b border-slate-200"}`}>
              {missionFilterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setMissionFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition ${missionFilter === filter
                    ? "bg-sky-500 text-slate-950"
                    : isDark
                      ? "border border-white/20 text-slate-200 hover:border-white/40"
                      : "border border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className={`flex-1 min-h-0 overflow-hidden rounded-3xl transition-colors duration-500 ${isDark ? "border border-white/10 bg-slate-950/70" : "border border-slate-200 bg-slate-50"}`}>
              <div className="h-full min-h-0 overflow-y-auto p-4 pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-slate-900/40">
                {loading.missions ? (
                  <div className="py-8 text-center text-slate-300">Carregando missions...</div>
                ) : filteredMissions.length ? (
                  filteredMissions.map((mission) => {
                    const currentStatus = missionStatus[mission.id] ?? mission.status;
                    return (
                      <div
                        key={mission.id}
                        className={`group rounded-2xl p-4 transition ${missionCard}`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                          {/* THUMBNAIL */}
                          <div className="flex-shrink-0 w-full md:w-32 h-24 rounded-xl overflow-hidden border border-white/10 bg-slate-950 shadow-md">
                            <img
                              src={getMissionImage(mission.id)}
                              alt={mission.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                //.target.nextElementSibling?.style.display = "flex";
                              }}
                            />
                            <div
                              className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"
                              style={{ display: "none" }}
                            >
                              <div className="text-3xl">🏗️</div>
                            </div>
                          </div>

                          {/* MISSION DETAILS */}
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-6">
                              {/* NAME */}
                              <div className="col-span-2">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Missão</p>
                                <p className="mt-1 text-sm font-semibold text-white truncate">{mission.name}</p>
                              </div>

                              {/* TYPE */}
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Tipo</p>
                                <p className="mt-1 text-sm text-slate-200">Inspeção</p>
                              </div>

                              {/* DURATION */}
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Duração</p>
                                <p className="mt-1 text-sm text-slate-200 flex items-center gap-1">
                                  <span>⏱️</span> {mission.duracao}
                                </p>
                              </div>

                              {/* STATUS */}
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Status</p>
                                <p className="mt-1">
                                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[currentStatus] ?? "bg-slate-800 text-slate-200"}`}>
                                    {currentStatus}
                                  </span>
                                </p>
                              </div>

                              {/* DATE/SCHEDULE */}
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Agendada</p>
                                <p className="mt-1 text-sm text-slate-200">10/05/2026 08:00</p>
                              </div>
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex-shrink-0 flex gap-2 justify-end md:flex-col">
                            {currentStatus === "Agendada" || currentStatus === "Salva" ? (
                              <button
                                onClick={() => handleExecute(mission.id)}
                                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 shadow-lg shadow-sky-500/20 whitespace-nowrap flex items-center gap-2"
                              >
                                <span>Executar</span>
                                <span>▶</span>
                              </button>
                            ) : currentStatus === "Executada" ? (
                              <button
                                onClick={() => handleExecute(mission.id)}
                                className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30 whitespace-nowrap"
                              >
                                Reset
                              </button>
                            ) : (
                              <button className="rounded-xl bg-slate-800/50 border border-slate-700/50 px-4 py-2 text-sm font-semibold text-slate-500 whitespace-nowrap cursor-not-allowed">
                                Acompanhar
                              </button>
                            )}
                            <button className="rounded-xl border border-white/10 bg-slate-950/50 p-2 text-slate-400 transition hover:bg-slate-900 hover:text-slate-200">
                              <span>⋮</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-400">
                    {missionFilter === "Todas" ? "Nenhuma missão disponível" : `Nenhuma missão ${missionFilter.toLowerCase()}`}
                  </div>
                )}
              </div>
            </div>

            {/* SUMMARY STATS */}
            {filteredMissions.length > 0 && (
              <div className={`mt-6 grid gap-4 pt-6 sm:grid-cols-3 transition-colors duration-500 ${isDark ? "border-t border-white/10" : "border-t border-slate-200"}`}>
                <div className={`rounded-lg p-3 transition-colors duration-500 ${panel}`}>
                  <p className={`text-xs uppercase tracking-[0.25em] font-semibold ${mutedText}`}>Total Missions</p>
                  <p className={`mt-2 text-2xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{missions.length}</p>
                </div>
                <div className={`rounded-lg p-3 transition-colors duration-500 ${panel}`}>
                  <p className={`text-xs uppercase tracking-[0.25em] font-semibold ${mutedText}`}>Agendadas</p>
                  <p className={`mt-2 text-2xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {missions.filter((m) => (missionStatus[m.id] ?? m.status) === "Agendada").length}
                  </p>
                </div>
                <div className={`rounded-lg p-3 transition-colors duration-500 ${panel}`}>
                  <p className={`text-xs uppercase tracking-[0.25em] font-semibold ${mutedText}`}>Concluídas</p>
                  <p className={`mt-2 text-2xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {missions.filter((m) => (missionStatus[m.id] ?? m.status) === "Executada").length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

// 
