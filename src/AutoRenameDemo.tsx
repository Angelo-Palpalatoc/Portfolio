import { useEffect, useRef, useState } from 'react';
import './AutoRenameDemo.css';

type Screen = 'home' | 'single' | 'batch';
type Stage = 'empty' | 'selected' | 'review' | 'saved';
type Dialog =
  | 'none'
  | 'confirm'
  | 'preview'
  | 'batch-confirm'
  | 'batch-preview'
  | 'history'
  | 'about'
  | 'evidence';

type BatchRow = { id: number; source: string; company: string; savedName?: string };

const sampleFile = 'sample-certificate.pdf';
const suggestedCompany = 'Aurora Community Services Inc.';
const sampleBatch: BatchRow[] = [
  { id: 1, source: 'sample-001.pdf', company: suggestedCompany },
  { id: 2, source: 'sample-002.pdf', company: 'Pine Harbor Trading Corp.' },
  { id: 3, source: 'sample-003.pdf', company: 'Bright Valley Cooperative' },
];

const renamedFile = (name: string) => `${name.trim().replace(/[. ]+$/, '')}.pdf`;

function AppMark() {
  return (
    <svg className="rename-mark" viewBox="0 0 108 108" role="img" aria-label="SEC Rename icon">
      <rect width="108" height="108" fill="#0054a4" />
      <path d="M30 20h33l15 15v53H30Z" fill="#fff" />
      <path d="M30 20h7v68h-7Z" fill="#b51f32" />
      <path d="M45 47h24v4H45Zm0 11h24v4H45Zm0 11h17v4H45Z" fill="#0054a4" />
    </svg>
  );
}

export default function AutoRenameDemo() {
  const [screen, setScreen] = useState<Screen>('home');
  const [stage, setStage] = useState<Stage>('empty');
  const [dialog, setDialog] = useState<Dialog>('none');
  const [company, setCompany] = useState(suggestedCompany);
  const [notice, setNotice] = useState('');
  const [batchSourceChosen, setBatchSourceChosen] = useState(false);
  const [batchOutputChosen, setBatchOutputChosen] = useState(false);
  const [batchStarted, setBatchStarted] = useState(false);
  const [batchRows, setBatchRows] = useState<BatchRow[]>(() =>
    sampleBatch.map((row) => ({ ...row })),
  );
  const [activeBatchId, setActiveBatchId] = useState<number | null>(null);
  const fileName = `${company.trim().replace(/[. ]+$/, '') || 'Enter a company name'}.pdf`;
  const activeBatchRow = batchRows.find((row) => row.id === activeBatchId);
  const savedBatchRows = batchRows.filter((row) => row.savedName);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dialog !== 'none') dialogRef.current?.focus();
  }, [dialog]);

  const selectSample = () => {
    setStage('selected');
    setCompany(suggestedCompany);
    setNotice('Fictional sample loaded. No device files were accessed.');
  };

  const reset = () => {
    setScreen('home');
    setStage('empty');
    setDialog('none');
    setCompany(suggestedCompany);
    setNotice('');
    setBatchSourceChosen(false);
    setBatchOutputChosen(false);
    setBatchStarted(false);
    setBatchRows(sampleBatch.map((row) => ({ ...row })));
    setActiveBatchId(null);
  };

  return (
    <div className="rename-demo">
      <div className="rename-demo-aside">
        <span className="rename-demo-label">INTERACTIVE MOBILE DEMO</span>
        <h2>See Sec Rename in action</h2>
        <p>
          Try the single-document or batch flow with fictional certificates. The screens mirror the
          Android app; the results and saved copies are simulated.
        </p>
        <ol>
          <li>Choose Single Document or Batch files</li>
          <li>Load the prepared sample documents</li>
          <li>Review each name and save a copy</li>
        </ol>
        <button className="rename-demo-reset" type="button" onClick={reset}>
          Start again
        </button>
      </div>

      <div className="rename-phone" aria-label="Sec Rename Android app demo">
        <div className="rename-phone-status" aria-hidden="true">
          <span>9:41</span>
          <span>●●● ▰</span>
        </div>
        <div className="rename-app-header">
          {screen !== 'home' && (
            <button
              className="rename-home-button"
              type="button"
              aria-label="Home"
              onClick={() => setScreen('home')}
            >
              ⌂
            </button>
          )}
          <AppMark />
          <div className="rename-app-heading">
            <strong>SEC Rename</strong>
            <span>Scan · Review · Save a copy</span>
          </div>
          <span className="rename-demo-tag">DEMO</span>
        </div>

        <div className="rename-app-body">
          {notice && (
            <p className="rename-notice" role="status">
              {notice}
            </p>
          )}
          {screen === 'home' && (
            <>
              <h3>How would you like to start?</h3>
              <div className="rename-panel">
                <button
                  className="rename-primary"
                  type="button"
                  onClick={() => setScreen('single')}
                >
                  Single Document
                </button>
                <small>Camera, photo or file</small>
              </div>
              <div className="rename-panel">
                <button className="rename-outline" type="button" onClick={() => setScreen('batch')}>
                  Batch files
                </button>
              </div>
            </>
          )}
          {screen === 'batch' && (
            <>
              <h3>Batch files</h3>
              <div className="rename-batch-setup">
                <div className="rename-batch-folder">
                  <span>
                    {batchSourceChosen ? 'Fictional certificates · 3 files' : 'No source folder'}
                  </span>
                  <button
                    className="rename-text-button"
                    type="button"
                    onClick={() => {
                      setBatchSourceChosen(true);
                      setNotice('Fictional source folder selected. No device files were accessed.');
                    }}
                  >
                    Choose source folder
                  </button>
                </div>
                <div className="rename-batch-folder">
                  <span>{batchOutputChosen ? 'Demo exports' : 'No output folder'}</span>
                  <button
                    className="rename-text-button"
                    type="button"
                    onClick={() => {
                      setBatchOutputChosen(true);
                      setNotice('Demo exports selected. No files will be written.');
                    }}
                  >
                    Save renamed files to
                  </button>
                </div>
                <div className="rename-output">
                  <span>Company list</span>
                  <strong>Not imported</strong>
                </div>
                <button
                  className="rename-primary"
                  type="button"
                  disabled={!batchSourceChosen || !batchOutputChosen || batchStarted}
                  onClick={() => {
                    setBatchStarted(true);
                    setNotice('Prepared company names loaded from three fictional documents.');
                  }}
                >
                  Start batch rename
                </button>
              </div>
              {batchStarted && (
                <div className="rename-batch-results">
                  <p className="rename-batch-progress" role="status">
                    {savedBatchRows.length} of {batchRows.length} complete
                  </p>
                  {batchRows
                    .filter((row) => !row.savedName)
                    .map((row) => (
                      <div className="rename-batch-row" key={row.id}>
                        <button
                          className="rename-text-button rename-batch-preview"
                          type="button"
                          onClick={() => {
                            setActiveBatchId(row.id);
                            setDialog('batch-preview');
                          }}
                        >
                          {row.source}
                        </button>
                        <div className="rename-batch-review">
                          <div className="rename-batch-field">
                            <label htmlFor={`rename-batch-company-${row.id}`}>Company name</label>
                            <input
                              id={`rename-batch-company-${row.id}`}
                              value={row.company}
                              onChange={(event) =>
                                setBatchRows((rows) =>
                                  rows.map((item) =>
                                    item.id === row.id
                                      ? { ...item, company: event.target.value }
                                      : item,
                                  ),
                                )
                              }
                            />
                          </div>
                          <button
                            className="rename-primary"
                            type="button"
                            disabled={!row.company.trim()}
                            onClick={() => {
                              setActiveBatchId(row.id);
                              setDialog('batch-confirm');
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ))}
                  {savedBatchRows.length === batchRows.length && (
                    <div className="rename-success" role="status">
                      <strong>All sample files saved</strong>
                      <small>Simulated copies in Demo exports · originals unchanged</small>
                      <button
                        className="rename-text-button"
                        type="button"
                        onClick={() => setDialog('history')}
                      >
                        Export history
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {screen === 'single' && (
            <>
              <div className="rename-output">
                <span>Save copies to</span>
                <strong>Demo exports</strong>
              </div>
              <div className="rename-output">
                <span>Company list</span>
                <strong>Not imported</strong>
              </div>
              {stage !== 'empty' && (
                <button className="rename-file" type="button" onClick={() => setDialog('preview')}>
                  <span className="rename-file-icon">PDF</span>
                  <span>
                    <strong>{sampleFile}</strong>
                    <small>PDF · Preview document</small>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>
              )}
              {stage === 'selected' && (
                <button
                  className="rename-primary"
                  type="button"
                  onClick={() => {
                    setStage('review');
                    setNotice('Company name suggested from the fictional sample.');
                  }}
                >
                  Read company name
                </button>
              )}
              {stage === 'review' && (
                <div className="rename-review">
                  <label htmlFor="rename-company">Company name</label>
                  <input
                    id="rename-company"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                  <div className="rename-filename">
                    <span>File name</span>
                    <strong>{fileName}</strong>
                  </div>
                  <button
                    className="rename-text-button"
                    type="button"
                    onClick={() => setDialog('evidence')}
                  >
                    OCR evidence
                  </button>
                  <button
                    className="rename-primary"
                    type="button"
                    disabled={!company.trim()}
                    onClick={() => setDialog('confirm')}
                  >
                    Save renamed copy
                  </button>
                </div>
              )}
              {stage === 'saved' && (
                <div className="rename-success" role="status">
                  <strong>✓ File saved</strong>
                  <span>{fileName}</span>
                  <small>Demo exports · original sample unchanged</small>
                  <button
                    className="rename-text-button"
                    type="button"
                    onClick={() => setDialog('history')}
                  >
                    Export history
                  </button>
                </div>
              )}
              <div className="rename-input-actions">
                <button className="rename-primary" type="button" onClick={selectSample}>
                  Scan with camera
                </button>
                <button className="rename-outline" type="button" onClick={selectSample}>
                  Open file
                </button>
              </div>
            </>
          )}
        </div>

        <div className="rename-app-footer">
          <button type="button" onClick={() => setDialog('history')}>
            Export history
          </button>
          <button type="button" onClick={() => setDialog('about')}>
            About
          </button>
        </div>
        <div className="rename-phone-nav" aria-hidden="true">
          <span />
        </div>

        {dialog !== 'none' && (
          <div className="rename-dialog-backdrop">
            <div
              className="rename-dialog"
              role="dialog"
              aria-modal="true"
              aria-label={dialog === 'confirm' ? 'Confirm saved copy' : dialog}
              tabIndex={-1}
              ref={dialogRef}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.stopPropagation();
                  setDialog('none');
                }
              }}
            >
              {dialog === 'confirm' && (
                <>
                  <h3>Is the company name correct?</h3>
                  <strong>{company}</strong>
                  <span>File name</span>
                  <p>{fileName}</p>
                  <span>Save copies to</span>
                  <p>Demo exports</p>
                  <div className="rename-dialog-actions">
                    <button type="button" onClick={() => setDialog('none')}>
                      Edit name
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStage('saved');
                        setDialog('none');
                        setNotice('Simulated copy saved. No file was changed.');
                      }}
                    >
                      Yes, save
                    </button>
                  </div>
                </>
              )}
              {dialog === 'batch-confirm' && activeBatchRow && (
                <>
                  <h3>Is the company name correct?</h3>
                  <strong>{activeBatchRow.company}</strong>
                  <span>File name</span>
                  <p>{renamedFile(activeBatchRow.company)}</p>
                  <span>Save renamed files to</span>
                  <p>Demo exports</p>
                  <div className="rename-dialog-actions">
                    <button type="button" onClick={() => setDialog('none')}>
                      Edit name
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBatchRows((rows) =>
                          rows.map((row) =>
                            row.id === activeBatchId
                              ? { ...row, savedName: renamedFile(row.company) }
                              : row,
                          ),
                        );
                        setDialog('none');
                        setNotice('Simulated copy saved. No file was changed.');
                      }}
                    >
                      Yes, save
                    </button>
                  </div>
                </>
              )}
              {dialog === 'batch-preview' && activeBatchRow && (
                <>
                  <h3>{activeBatchRow.source}</h3>
                  <div className="rename-paper">
                    <small>FICTIONAL SAMPLE</small>
                    <strong>Certificate of Incorporation</strong>
                    <p>This is to certify that</p>
                    <b>{sampleBatch.find((row) => row.id === activeBatchId)?.company}</b>
                  </div>
                  <div className="rename-dialog-actions">
                    <button type="button" onClick={() => setDialog('none')}>
                      Close
                    </button>
                  </div>
                </>
              )}
              {dialog === 'preview' && (
                <>
                  <h3>{sampleFile}</h3>
                  <div className="rename-paper">
                    <small>FICTIONAL SAMPLE</small>
                    <strong>Certificate of Incorporation</strong>
                    <p>This is to certify that</p>
                    <b>{suggestedCompany}</b>
                  </div>
                  <div className="rename-dialog-actions">
                    <button type="button" onClick={() => setDialog('none')}>
                      Close
                    </button>
                  </div>
                </>
              )}
              {dialog === 'history' && (
                <>
                  <h3>Export history</h3>
                  {stage === 'saved' && <p>{fileName}</p>}
                  {savedBatchRows.map((row) => (
                    <p key={row.id}>{row.savedName}</p>
                  ))}
                  {stage !== 'saved' && savedBatchRows.length === 0 && <p>No exports yet.</p>}
                  <div className="rename-dialog-actions">
                    <button type="button" onClick={() => setDialog('none')}>
                      Close
                    </button>
                  </div>
                </>
              )}
              {dialog === 'evidence' && (
                <>
                  <h3>OCR evidence</h3>
                  <p>Certificate of Incorporation · {suggestedCompany}</p>
                  <small>Prepared text from the fictional sample.</small>
                  <div className="rename-dialog-actions">
                    <button type="button" onClick={() => setDialog('none')}>
                      Close
                    </button>
                  </div>
                </>
              )}
              {dialog === 'about' && (
                <>
                  <h3>About this demo</h3>
                  <p>
                    This portfolio simulation uses fictional data. It does not open files, scan with
                    a camera, run OCR, or save anything to your device.
                  </p>
                  <div className="rename-dialog-actions">
                    <button type="button" onClick={() => setDialog('none')}>
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
