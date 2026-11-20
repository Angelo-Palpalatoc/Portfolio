import { practiceItems, productionSkills, workingKnowledge } from '../portfolio.data';
import { SectionHeading } from './SectionPieces';

export function SkillsSection() {
  return (
    <>
      <SectionHeading file="skills.ino" title="Skills" />
      <div className="mb-[26px] border border-arduino-teal">
        <div className="border-b border-arduino-teal bg-[#00979c1f] px-5 py-[14px]">
          <div className="font-arduino-code text-[13px] font-bold tracking-[0.14em] text-arduino-teal">
            CORE TOOLKIT
          </div>
          <div className="mt-1 text-[13.5px]">Applied across team work and personal projects.</div>
        </div>
        <div className="py-[6px]">
          {productionSkills.map((group) => (
            <div
              key={group.label}
              className="grid grid-cols-[150px_1fr] gap-[14px] border-b border-[#2a2a2a] px-5 py-3 max-[899px]:grid-cols-1"
            >
              <div className="pt-1 font-arduino-code text-[11.5px] tracking-[0.1em] text-arduino-muted">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-[7px] border border-arduino-border bg-arduino-panel px-[11px] py-[6px] font-arduino-code text-[12.5px]"
                  >
                    <span className="size-[7px] bg-arduino-teal" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="px-5 py-[14px] font-arduino-code text-[11.5px] text-[#6a9955]">
            // project examples: Lighthouse and AutoRename
          </div>
        </div>
      </div>
      <div className="mb-[26px] border border-[#3d3d3d]">
        <div className="border-b border-[#3d3d3d] bg-arduino-panel px-5 py-[14px]">
          <div className="font-arduino-code text-[13px] font-bold tracking-[0.14em] text-[#9c9c9c]">
            WORKING KNOWLEDGE
          </div>
          <div className="mt-1 text-[13.5px] text-arduino-muted">
            Comfortable building with, not yet shipped to production.
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-5 py-[18px]">
          {workingKnowledge.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-[7px] border border-[#3d3d3d] px-[11px] py-[6px] font-arduino-code text-[12.5px] text-[#9c9c9c]"
            >
              <span className="size-[7px] border border-arduino-muted" />
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="border border-arduino-border bg-arduino-panel p-6">
        <div className="font-arduino-code text-[13px] font-bold tracking-[0.14em]">PRACTICE</div>
        <div className="mb-5 mt-1 text-[13.5px] text-arduino-muted">How I work.</div>
        <div className="grid grid-cols-3 gap-5 max-[899px]:grid-cols-1">
          {practiceItems.map((item, index) => (
            <div
              key={item.title}
              className={`border-l-2 pl-4 ${index === 0 ? 'border-arduino-teal' : 'border-arduino-border'}`}
            >
              <div className="mb-2 text-[15px] font-semibold text-[#f2f2f2]">{item.title}</div>
              <p className="text-pretty text-[14.5px] leading-[1.7]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
