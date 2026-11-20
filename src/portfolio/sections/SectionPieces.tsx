import type { ArchitectureNode } from '../portfolio.types';

export function SectionHeading({ file, title }: { file: string; title: string }) {
  return (
    <>
      <div className="font-arduino-code text-[12px] text-[#6a9955]">// {file}</div>
      <h2 className="mb-[22px] mt-[14px] text-[30px] font-bold tracking-[-0.02em] text-[#f2f2f2]">
        {title}
      </h2>
    </>
  );
}

export function Eyebrow({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`mb-3 font-arduino-code text-[11px] tracking-[0.14em] ${accent ? 'text-arduino-teal' : 'text-arduino-muted'}`}
    >
      {children}
    </div>
  );
}

export function ProjectHeading({
  file,
  name,
  category,
  description,
  work = false,
}: {
  file: string;
  name: string;
  category: string;
  description: string;
  work?: boolean;
}) {
  return (
    <>
      <div className="font-arduino-code text-[12px] text-[#6a9955]">// projects/{file}</div>
      <div className="mb-[10px] mt-[14px] flex flex-wrap items-center gap-4">
        <h2 className="text-[34px] font-bold tracking-[-0.02em] text-[#f2f2f2]">{name}</h2>
        <span
          className={`border px-[10px] py-[5px] font-arduino-code text-[11px] tracking-[0.12em] ${work ? 'border-[#6b512f] bg-[#d19a6614] text-[#d19a66]' : 'border-[#2c4a48] bg-[#4ec9b010] text-[#4ec9b0]'}`}
        >
          {category}
        </span>
      </div>
      <p className="mb-8 text-[17px] text-arduino-muted">{description}</p>
    </>
  );
}

export function PairCards({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-px border border-arduino-border bg-arduino-border max-[759px]:grid-cols-1">
      {items.map((item) => (
        <div key={item.title} className="bg-arduino-panel p-6">
          <Eyebrow accent>{item.title}</Eyebrow>
          <p className="text-pretty text-[15.5px] leading-[1.7]">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Architecture({ nodes }: { nodes: ArchitectureNode[] }) {
  return (
    <div className="mb-9">
      <Eyebrow>SYSTEM ARCHITECTURE</Eyebrow>
      <div className="flex flex-col items-center border border-arduino-border bg-arduino-panel px-5 py-6">
        {nodes.map((node, index) => (
          <div key={node.label} className="flex w-full flex-col items-center">
            <div
              className={`w-full border bg-arduino-bg px-[10px] py-[11px] text-center font-arduino-code ${index === 0 || index === nodes.length - 1 ? 'border-arduino-teal' : 'border-arduino-border'}`}
            >
              <div className="text-[12.5px] leading-[1.35]">{node.label}</div>
              <div className="mt-1 text-[10.5px] leading-[1.45] text-arduino-muted">
                {node.detail}
              </div>
            </div>
            {node.relation && (
              <>
                <div className="h-[18px] w-px bg-arduino-teal" />
                <div className="my-[3px] font-arduino-code text-[10px] text-arduino-muted">
                  {node.relation}
                </div>
                <div className="mb-[6px] text-[11px] leading-[0.6] text-arduino-teal">▼</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechChips({ items }: { items: string[] }) {
  return (
    <div>
      <Eyebrow>TECHNOLOGIES</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="border border-[#2c4a48] bg-[#4ec9b010] px-[11px] py-[6px] font-arduino-code text-[12px] text-[#4ec9b0]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CodePreview({ lines }: { lines: React.ReactNode[] }) {
  return (
    <div className="flex overflow-x-auto border border-arduino-border bg-arduino-bg font-arduino-code text-[13px] leading-[1.5]">
      <pre
        aria-hidden="true"
        className="m-0 border-r border-arduino-border py-[18px] pl-4 pr-3 text-right text-arduino-muted"
      >
        {lines.map((_, index) => index + 1).join('\n')}
      </pre>
      <pre className="m-0 px-5 py-[18px]">
        {lines.map((line, index) => (
          <span key={index} className="block whitespace-pre">
            {line || '\u00a0'}
          </span>
        ))}
      </pre>
    </div>
  );
}
