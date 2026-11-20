import headshot from '../assets/headshot.webp';
import { aboutProjects } from '../portfolio.data';
import { Eyebrow, SectionHeading } from './SectionPieces';

export function AboutSection() {
  return (
    <div className="max-w-[720px]">
      <SectionHeading file="about.ino" title="About" />
      <div className="mb-[26px] grid grid-cols-[132px_1fr] items-start gap-[22px] max-[619px]:grid-cols-1">
        <div className="w-[120px] border border-arduino-border bg-arduino-panel p-[5px]">
          <img
            src={headshot}
            alt="Angelo Palpalatoc"
            className="h-[110px] w-[110px] object-cover"
          />
          <div className="px-[2px] pb-[1px] pt-[6px] font-arduino-code text-[9.5px] tracking-[0.1em] text-arduino-muted">
            A. PALPALATOC
          </div>
        </div>
        <p className="text-pretty text-[16.5px] leading-[1.7]">
          My interest in technology began with computer games. At ten, I started exploring computers
          on my own; by high school, I was installing software, troubleshooting systems, and
          becoming curious about both hardware and software.
          <br />
          <br />
          College introduced me to programming and robotics. Seeing sensors collect data and code
          turn it into useful action made me want to build things myself. I committed long study
          days to web fundamentals: HTML, CSS, JavaScript, React, and TypeScript, and grew that
          curiosity into full-stack web and mobile projects.
          <br />
          <br />
          Outside software, I enjoy training in my home gym, playing volleyball, badminton, and
          basketball, and working on woodcraft and room design. I designed and built my own room,
          the setting for this portfolio.
        </p>
      </div>
      <div className="mb-[30px] border-l-2 border-arduino-teal pl-5">
        <Eyebrow accent>HOW I WORK</Eyebrow>
        <p className="text-pretty text-[16.5px] leading-[1.7]">
          Before I build, I put myself in the user's place: what are they trying to accomplish, what
          could confuse them, and what is the simplest path forward? I use that understanding to
          create interfaces that guide people without making them feel lost. It is the same approach
          I brought to Lighthouse, where clear navigation, responsive layouts, and visible
          document-processing status helped users understand what was happening behind the scenes.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px border border-arduino-border bg-arduino-border">
        {aboutProjects.map((item) => (
          <div key={item.title} className="bg-arduino-panel p-5">
            <div className="mb-[10px] font-arduino-code text-[11px] tracking-[0.12em] text-arduino-muted">
              {item.title}
            </div>
            <p className="text-[15px] leading-[1.6]">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
