import React from 'react';
import { 
    MousePointer2, ArrowRight, Activity, Target, 
    RotateCcw, Undo2, Redo2, Trash2, Save, Share2, 
    ChevronDown 
} from 'lucide-react';
import { FORMATION_CATALOG } from '../patterns/FormationStrategies';

export default function TacticToolbar({
    pitchFormat,
    onPitchFormatChange,
    selectedFormation,
    onFormationChange,
    activeTool,
    onToolChange,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onClearDrawings,
    onResetPositions,
    onSave,
    onOpenExportModal,
    isSaving
}) {
    const formations = FORMATION_CATALOG[pitchFormat] || FORMATION_CATALOG['5v5'];

    return (
        <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 sm:p-6 shadow-2xl mb-6 space-y-4">
            {/* Top Row: Pitch Format, Formations, and Export */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                {/* Pitch Format Tabs (5v5 / 7v7 / 11v11) */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-white/5">
                    {['5v5', '7v7', '11v11'].map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => onPitchFormatChange(fmt)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${pitchFormat === fmt ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'text-slate-400 hover:text-white'}`}
                        >
                            {fmt}
                        </button>
                    ))}
                </div>

                {/* Formation Picker Dropdown */}
                <div className="relative min-w-[200px]">
                    <select
                        value={selectedFormation}
                        onChange={(e) => onFormationChange(e.target.value)}
                        className="w-full appearance-none bg-slate-950 border border-white/10 rounded-2xl px-4 py-2.5 pr-10 text-xs font-bold text-white focus:border-neon-green outline-none cursor-pointer"
                    >
                        {formations.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Save & Lineup Export Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 text-neon-blue" />
                        {isSaving ? 'Saving...' : 'Save Plan'}
                    </button>

                    <button
                        onClick={onOpenExportModal}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-neon-green via-emerald-400 to-teal-400 text-black text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                        <Share2 className="w-4 h-4 stroke-[2.5]" />
                        Match Lineup Card
                    </button>
                </div>
            </div>

            {/* Bottom Row: Drawing Tools, Undo / Redo & Canvas Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Tactical Tools Group */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1 hidden sm:inline">Tactical Tools:</span>
                    
                    {/* Select / Move Player */}
                    <button
                        onClick={() => onToolChange('select')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${activeTool === 'select' ? 'bg-white text-black border-white shadow-md' : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'}`}
                        title="Move Players"
                    >
                        <MousePointer2 className="w-3.5 h-3.5" />
                        <span>Move</span>
                    </button>

                    {/* Pass Arrow */}
                    <button
                        onClick={() => onToolChange('pass')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${activeTool === 'pass' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'}`}
                        title="Draw Passing Line (Cyan Arrow)"
                    >
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Pass</span>
                    </button>

                    {/* Run Trail */}
                    <button
                        onClick={() => onToolChange('run')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${activeTool === 'run' ? 'bg-amber-500/20 text-amber-400 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'}`}
                        title="Draw Off-The-Ball Run (Dashed Yellow)"
                    >
                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                        <span>Run</span>
                    </button>

                    {/* Press Zone */}
                    <button
                        onClick={() => onToolChange('press')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${activeTool === 'press' ? 'bg-rose-500/20 text-rose-400 border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'}`}
                        title="Draw Pressing Zone (Red Zone)"
                    >
                        <Target className="w-3.5 h-3.5 text-rose-400" />
                        <span>Press</span>
                    </button>
                </div>

                {/* History & Reset Group */}
                <div className="flex items-center gap-2">
                    {/* Undo */}
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="p-2 rounded-xl bg-slate-950 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 className="w-4 h-4" />
                    </button>

                    {/* Redo */}
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="p-2 rounded-xl bg-slate-950 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-5 bg-white/10 mx-1" />

                    {/* Clear Ink */}
                    <button
                        onClick={onClearDrawings}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-white/5 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-bold transition-all"
                        title="Clear Tactical Lines"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Clear Ink</span>
                    </button>

                    {/* Reset Formation */}
                    <button
                        onClick={onResetPositions}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-white/5 text-slate-400 hover:text-neon-green hover:border-neon-green/30 text-xs font-bold transition-all"
                        title="Reset Players to Formation Preset"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reset Form</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
