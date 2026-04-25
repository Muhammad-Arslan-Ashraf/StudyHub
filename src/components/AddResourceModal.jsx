import React, { useState } from 'react'
import { X, Link, BookOpen, FileText, Scroll, Tag, User } from 'lucide-react'

const inputCls = "w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#e8c77d] transition-colors"
const labelCls = "block text-[11px] font-bold tracking-widest text-white/40 mb-2 uppercase font-syne"

export default function AddResourceModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', type: 'book', subject: '', description: '', driveLink: '', addedBy: '', tags: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.title.trim())     return setError('Title is required')
    if (!form.subject.trim())   return setError('Subject is required')
    if (!form.driveLink.trim()) return setError('Google Drive link is required')
    if (!form.driveLink.startsWith('http')) return setError('Please enter a valid URL')
    if (!form.addedBy.trim())   return setError('Your name is required')
    const tags = form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    onAdd({ ...form, tags })
    setSuccess(true)
    setTimeout(onClose, 1200)
  }

  const TYPES = [
    { val: 'book',  icon: BookOpen, label: 'Book'  },
    { val: 'notes', icon: FileText, label: 'Notes' },
    { val: 'paper', icon: Scroll,   label: 'Paper' },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-5">
      <div className="bg-[#1e1e38] border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-[#e8c77d]">Add Resource</h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            ✓ Resource added successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* type */}
          <div>
            <label className={labelCls}>Type</label>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map(({ val, icon: Icon, label }) => (
                <button key={val} onClick={() => set('type', val)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border
                    ${form.type === val
                      ? 'bg-[#e8c77d] border-[#e8c77d] text-[#1a1410]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'}`}>
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* title */}
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} placeholder="e.g. Physics Part 2 Notes"
              value={form.title} onChange={e => { set('title', e.target.value); setError('') }} />
          </div>

          {/* subject */}
          <div>
            <label className={labelCls}>Subject</label>
            <input className={inputCls} placeholder="e.g. Physics, Chemistry, Math..."
              value={form.subject} onChange={e => { set('subject', e.target.value); setError('') }} />
          </div>

          {/* drive link */}
          <div>
            <label className={labelCls}>Google Drive Link</label>
            <div className="relative">
              <Link size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={`${inputCls} pl-10`} placeholder="https://drive.google.com/..."
                value={form.driveLink} onChange={e => { set('driveLink', e.target.value); setError('') }} />
            </div>
            <p className="text-[11px] text-white/25 mt-1.5">Set file sharing to "Anyone with the link" in Drive</p>
          </div>

          {/* description */}
          <div>
            <label className={labelCls}>Description <span className="normal-case text-white/20">(optional)</span></label>
            <textarea className={`${inputCls} min-h-[80px] resize-none`} placeholder="Brief description of this resource..."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          {/* tags */}
          <div>
            <label className={labelCls}>Tags <span className="normal-case text-white/20">(comma separated)</span></label>
            <div className="relative">
              <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={`${inputCls} pl-10`} placeholder="fsc, notes, physics, part2"
                value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>
          </div>

          {/* name */}
          <div>
            <label className={labelCls}>Your Name</label>
            <div className="relative">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={`${inputCls} pl-10`} placeholder="e.g. Ali, Sara..."
                value={form.addedBy} onChange={e => { set('addedBy', e.target.value); setError('') }} />
            </div>
          </div>

          <button onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-[#e8c77d] hover:bg-[#f5d898] text-[#1a1410] font-extrabold text-base transition-colors mt-1">
            Share Resource ✦
          </button>
        </div>
      </div>
    </div>
  )
}
