function TaggedPoint({ tag, text }) {
  return (
    <div className="ml-auto flex h-full w-[92%] items-center border-l-4 border-cyan-300/45 bg-black/20 px-6 py-6">
      <div className="space-y-4">
        <span className="inline-flex rounded-full border border-cyan-300/45 bg-cyan-300/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-100/70">
          {tag}
        </span>
        <p className="text-base leading-8 text-slate-300">{text}</p>
      </div>
    </div>
  )
}

export default TaggedPoint