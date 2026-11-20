import { experienceEntries } from '../portfolio.data';
import { SectionHeading } from './SectionPieces';

export function ExperienceSection() {
  return (
    <div className="max-w-[780px]">
      <SectionHeading file="experience.ino" title="Experience" />
      <div className="flex flex-col">
        {experienceEntries.map((entry, index) => (
          <div key={`${entry.company}-${entry.dates}`} className="grid grid-cols-[24px_1fr] gap-5">
            <div className="flex flex-col items-center">
              <span
                className={`mt-[6px] size-[11px] border-2 ${index === 0 ? 'border-arduino-teal bg-arduino-teal' : index === 1 ? 'border-arduino-teal bg-arduino-bg' : 'border-[#3d3d3d] bg-arduino-bg'}`}
              />
              <span className="w-px flex-1 bg-arduino-border" />
            </div>
            <div className="pb-[34px]">
              <div className="text-[18px] font-semibold text-[#f2f2f2]">{entry.role}</div>
              <div className="mt-1 font-arduino-code text-[12.5px] text-arduino-teal">
                {entry.company}
              </div>
              <div className="mt-1 font-arduino-code text-[12px] text-arduino-muted">
                {entry.dates}
              </div>
              <ul className="mt-[14px] list-disc pl-[18px] text-[15px] leading-[1.8]">
                {entry.bullets.map((bullet) => (
                  <li key={bullet} className="text-pretty">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
