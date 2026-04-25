import React from 'react'
import { BookOpen, FileText, Scroll, ExternalLink, Trash2 } from 'lucide-react'

const TYPE_CONFIG = {
  book:  { icon: BookOpen, label: 'Book',       color: 'text-yellow-300', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', bar: 'from-yellow-400/40' },
  notes: { icon: FileText, label: 'Notes',      color: 'text-teal-300',  bg: 'bg-teal-400/10',  border: 'border-teal-400/20',  bar: 'from-teal-400/40'  },
  paper: { icon: Scroll,   label: 'Past Paper', color: 'text-violet-300',bg: 'bg-violet-400/10',border: 'border-violet-400/20',bar: 'from-violet-400/40'},
}

export default function ResourceCard({ resource, onDownload, onDelete, isAdmin }) {
  const cfg = TYPE_CONFIG[resource.type] || TYPE_CONFIG.notes
  const Icon = cfg.icon

  const handleOpen = () => {
    onDownload(resource.id)
    window.open(resource.driveLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="relative flex flex-col bg-[#1e1e38] border border-white/[0.07] rounded-2xl p-5 gap-3 transition-all duration-200 hover:bg-[#252545] hover:border-white/[0.15] hover:-translate-y-1 overflow-hidden">
      {/* top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.bar} to-transparent`} />

      {/* header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${cfg.bg} border ${cfg.border}`}>
          <Icon size={12} className={cfg.color} />
          <span className={`text-[10px] font-bold tracking-widest uppercase ${cfg.color} font-syne`}>{cfg.label}</span>
        </div>
        <span className="text-xs text-white/40 bg-white/5 px-2.5 py-1 rounded-full">{resource.subject}</span>
      </div>

      {/* title + desc */}
      <div>
        <h3 className="text-base font-bold text-white leading-snug mb-1.5">{resource.title}</h3>
        {resource.description && (
          <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{resource.description}</p>
        )}
      </div>

      {/* tags */}
      {resource.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.map(tag => (
            <span key={tag} className="text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded">#{tag}</span>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.07] mt-auto">
        <div>
          <p className="text-xs text-white/40">by <span className="text-white/60">{resource.addedBy}</span></p>
          <p className="text-[11px] text-white/25 mt-0.5">{resource.downloads} downloads</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <button
              onClick={() => onDelete(resource.id)}
              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={handleOpen}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#e8c77d] hover:bg-[#f5d898] text-[#1a1410] text-xs font-bold transition-colors"
          >
            <ExternalLink size={12} />
            Open
          </button>
        </div>
      </div>
    </div>
  )
}
