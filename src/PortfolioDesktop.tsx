import { useState } from 'react';

// Independent of the room camera, ready to mount on a different surface in phase two.
const projects = [
  { id: 'field-notes', number: '01', name: 'Field Notes', kind: 'Web concept', description: 'A calm space for collecting small ideas and finding them again.', tags: ['Interface', 'Writing'] },
  { id: 'signal-board', number: '02', name: 'Signal Board', kind: 'Dashboard concept', description: 'A compact dashboard that brings useful signals into focus.', tags: ['Data', 'Design'] },
] as const;

export default function PortfolioDesktop() {
  const [selectedId, setSelectedId] = useState<string>(projects[0].id);
  const selected = projects.find(project => project.id === selectedId) ?? projects[0];

  return (
    <section className="projects-app" aria-label="Sample projects window">
      <header className="app-bar">
        <div className="app-brand"><span className="brand-glyph" aria-hidden="true">✳</span> PORTFOLIO<span className="brand-dim">.EXE</span></div>
        <span className="app-status"><span className="status-dot" /> SAMPLE WORK</span>
      </header>
      <div className="app-body">
        <nav className="project-list" aria-label="Sample projects">
          <div className="list-heading">PROJECTS <span>02</span></div>
          {projects.map(project => (
            <button className="project-item" type="button" key={project.id} onClick={() => setSelectedId(project.id)} aria-pressed={selectedId === project.id}>
              <span className="item-number">{project.number}</span>
              <span className="item-name">{project.name}</span>
              <span className="item-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
          <span className="sample-note">DEMO CONTENT</span>
        </nav>
        <article className="project-detail" aria-live="polite">
          <div className="detail-top"><span className="detail-eyebrow">SELECTED PROJECT / {selected.number}</span><span className="detail-star" aria-hidden="true">✳</span></div>
          <div className="detail-content"><span className="detail-kind">{selected.kind}</span><h1>{selected.name}</h1><p>{selected.description}</p></div>
          <div className="detail-footer"><span>{selected.tags.join('  /  ')}</span><span aria-hidden="true">↗</span></div>
        </article>
      </div>
    </section>
  );
}
