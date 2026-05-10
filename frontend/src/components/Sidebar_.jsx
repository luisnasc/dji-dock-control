export default function Sidebar({ isDark }) {
    return (
        <aside className={`border-r p-6 backdrop-blur-xl overflow-y-auto transition-colors duration-500 ${isDark ? "border-white/10 bg-slate-900/90 text-slate-100" : "border-slate-200 bg-slate-100 text-slate-900"}`}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">

                    {/* ESQUERDA */}
                    <div className="flex flex-col items-center gap-3">

                        {/* LOGO */}
                        <img
                            src="/logo_axia.png"
                            alt="Axia logo"
                            className="h-16 object-contain"
                        />

                        {/* TÍTULO */}
                        <p className="mt-4 text-xs uppercase font-bold tracking-[0.5em] text-sky-400">
                            Missões de Voo
                        </p>
                    </div>

                </div>

            </div>



            {/* PROJECTS LIST */}
            <div className="space-y-3">
                <p className={`text-xs uppercase tracking-[0.25em] font-semibold px-2 ${mutedText}`}>Projetos</p>
                {projects.map((project) => (
                    <div key={project.id}>
                        <button
                            onClick={() => setSelectedProjectId(project.id)}
                            className={`w-full rounded-2xl px-4 py-3 text-left transition ${project.id === selectedProject?.id
                                ? "border border-sky-400/40 bg-sky-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]"
                                : `${surface} hover:border-slate-300/20 hover:bg-slate-50`
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
                            <div className={`mt-3 ml-2 rounded-2xl transition-colors duration-500 ${panel}`}>
                                <div className="p-4">
                                    <p className={`text-xs uppercase tracking-[0.25em] font-semibold mb-3 ${mutedText}`}>
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
                                            <div className={`rounded-lg p-3 space-y-2 transition-colors duration-500 ${panel}`}>
                                                <p className={`text-xs ${mutedText}`}>
                                                    <span className="font-semibold">Drone:</span> {selectedDock.drone.model}
                                                </p>
                                                <p className={`text-xs ${mutedText}`}>
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
    );
}
