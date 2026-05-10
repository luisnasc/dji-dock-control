import { useEffect, useMemo, useState } from "react";
import disjuntoresImg from "./assets/missions/disjuntores.jpeg";
import seccionadorasImg from "./assets/missions/seccionadoras.jpg";
import transformadoresImg from "./assets/missions/transformadores.jpeg";
import dock2Img from "./assets/docks/dock2.jpeg";
import dock3Img from "./assets/docks/dock3.jpeg";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
        <p className="rounded-3xl bg-slate-900/80 px-6 py-4 text-lg text-slate-200 shadow-lg shadow-slate-900/40">
          Carregando dados do sistema...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* LEFT SIDEBAR */}
        <aside className="border-r border-white/10 bg-slate-900/90 p-6 backdrop-blur-xl overflow-y-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Mission Control</p>
              <h1 className="mt-2 text-xl font-semibold text-white">DJI Dock Ops</h1>
            </div>
            <div className="rounded-2xl bg-slate-800/80 px-2 py-1 text-xs text-slate-200 shadow-sm shadow-slate-900/40">
              Live
            </div>
          </div>

          {/* PROJECTS LIST */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold px-2">Projetos</p>
            {projects.map((project) => (
              <div key={project.id}>
                <button
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                    project.id === selectedProject?.id
                      ? "border border-sky-400/40 bg-sky-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]"
                      : "border border-white/10 bg-slate-950/80 hover:border-slate-300/20 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{project.name}</p>
                      <p className="mt-1 text-xs text-slate-400 truncate">{project.type}</p>
                    </div>
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-1"></div>
                  </div>
                </button>

                {/* DOCK INFO - SHOWN WHEN PROJECT SELECTED */}
                {project.id === selectedProject?.id && selectedDock && (
                  <div className="mt-3 ml-2 rounded-2xl border border-white/10 bg-slate-950/80">
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold mb-3">
                        Dock Atrelada
                      </p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{selectedDock.name}</p>
                          <p className="mt-1 text-xs text-slate-400">{selectedDock.local}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`inline-flex px-2 py-1 rounded-full font-medium ${statusStyles[selectedDock.status] ?? "bg-slate-800 text-slate-200"}`}>
                            {selectedDock.status}
                          </span>
                        </div>
                        <div className="flex justify-center">
                          <div className="relative h-32 w-32 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/90 shadow-[0_12px_35px_-18px_rgba(15,23,42,0.9)]">
                            <img
                              src={getDockThumbnail(selectedDock.id)}
                              alt={`${selectedDock.name} thumbnail`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        {selectedDock.drone && (
                          <div className="rounded-lg bg-slate-900/80 p-3 space-y-2">
                            <p className="text-xs text-slate-400">
                              <span className="font-semibold">Drone:</span> {selectedDock.drone.model}
                            </p>
                            <p className="text-xs text-slate-400">
                              <span className="font-semibold">Bateria:</span> {selectedDock.drone.battery}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
              {error}
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="px-6 py-8 lg:px-8 overflow-y-auto">
          {/* HEADER */}
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Operational Control</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              {selectedProject?.name ?? "Selecione um projeto"}
            </h2>
            {selectedProject && (
              <p className="mt-2 text-sm text-slate-400">
                {selectedProject.description}
              </p>
            )}
          </div>

          {/* MISSIONS SECTION */}
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_40px_120px_-80px_rgba(15,23,42,0.8)] flex h-full min-h-[48vh] max-h-[75vh] flex-col overflow-hidden">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Missões</h3>
                <p className="mt-1 text-sm text-slate-400">Planeje e execute inspeções autônomas</p>
              </div>
              <button className="rounded-3xl bg-sky-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 whitespace-nowrap">
                + Nova Missão
              </button>
            </div>

            {/* FILTERS */}
            <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
              {missionFilterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setMissionFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                    missionFilter === filter
                      ? "bg-sky-500 text-slate-950"
                      : "border border-white/20 text-slate-200 hover:border-white/40"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
              <div className="h-full min-h-0 overflow-y-auto p-4 pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-slate-900/40">
                {loading.missions ? (
                  <div className="py-8 text-center text-slate-300">Carregando missions...</div>
                ) : filteredMissions.length ? (
                  filteredMissions.map((mission) => {
                  const currentStatus = missionStatus[mission.id] ?? mission.status;
                  return (
                    <div
                      key={mission.id}
                      className="group rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/60 to-slate-950/40 p-4 transition hover:border-white/20 hover:bg-gradient-to-r hover:from-slate-900/80 hover:to-slate-950/60 shadow-lg shadow-slate-950/30"
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
              <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-950/80 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total Missions</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{missions.length}</p>
                </div>
                <div className="rounded-lg bg-slate-950/80 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Agendadas</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {missions.filter((m) => (missionStatus[m.id] ?? m.status) === "Agendada").length}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950/80 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Concluídas</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
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
