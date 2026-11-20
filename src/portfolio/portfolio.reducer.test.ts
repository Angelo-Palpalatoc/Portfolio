import { describe, expect, it } from 'vitest';
import { featuredProjects, fileEntries, portfolioLinks, sectionInfo } from './portfolio.data';
import { initialPortfolioState, portfolioReducer } from './portfolio.reducer';

describe('portfolio state', () => {
  it('starts on the main file with the Serial Monitor collapsed', () => {
    expect(initialPortfolioState.active).toBe('main');
    expect(initialPortfolioState.tabs).toEqual(['main']);
    expect(initialPortfolioState.serialOpen).toBe(false);
    expect(initialPortfolioState.boot).toBe('loading');
  });

  it('opens each file once, closes the drawer, and logs navigation', () => {
    const fromDrawer = portfolioReducer(initialPortfolioState, { type: 'toggle-drawer' });
    const opened = portfolioReducer(fromDrawer, {
      type: 'open-file',
      id: 'lighthouse',
      time: '[12:00:00]',
    });
    const reopened = portfolioReducer(opened, {
      type: 'open-file',
      id: 'lighthouse',
      time: '[12:00:01]',
    });

    expect(reopened.active).toBe('lighthouse');
    expect(reopened.tabs).toEqual(['main', 'lighthouse']);
    expect(reopened.drawerOpen).toBe(false);
    expect(reopened.serial.at(-1)?.message).toBe('Opened projects/lighthouse.ino');
  });

  it('selects the latest remaining tab and restores main when the final tab closes', () => {
    const withAbout = portfolioReducer(initialPortfolioState, {
      type: 'open-file',
      id: 'about',
      time: '[12:00:00]',
    });
    const withSkills = portfolioReducer(withAbout, {
      type: 'open-file',
      id: 'skills',
      time: '[12:00:01]',
    });
    const afterSkills = portfolioReducer(withSkills, { type: 'close-tab', id: 'skills' });
    const afterAbout = portfolioReducer(afterSkills, { type: 'close-tab', id: 'about' });
    const afterMain = portfolioReducer(afterAbout, { type: 'close-tab', id: 'main' });

    expect(afterSkills.active).toBe('about');
    expect(afterAbout.active).toBe('main');
    expect(afterMain.tabs).toEqual(['main']);
    expect(afterMain.active).toBe('main');
  });

  it('keeps compile feedback and its serial log in sync', () => {
    const started = portfolioReducer(initialPortfolioState, {
      type: 'compile-start',
      time: '[12:00:00]',
    });
    const succeeded = portfolioReducer(started, {
      type: 'compile-success',
      time: '[12:00:01]',
    });
    const cleared = portfolioReducer(succeeded, { type: 'compile-clear' });

    expect(started.compile).toBe('compiling');
    expect(succeeded.compile).toBe('success');
    expect(succeeded.serial.at(-1)).toMatchObject({
      message: 'Success — 0 errors, 0 warnings',
      tone: 'success',
    });
    expect(cleared.compile).toBe('idle');
    expect(cleared.serial).toHaveLength(succeeded.serial.length);
  });

  it('has a typed Info panel entry for every navigable file', () => {
    expect(fileEntries).toHaveLength(8);
    expect(fileEntries.every((file) => sectionInfo[file.id].section === file.path)).toBe(true);
    expect(fileEntries.find((file) => file.id === 'autorename')?.path).toBe(
      'projects/sec_renamer.ino',
    );
  });

  it('keeps featured projects, CV link, and NDA metadata consistent', () => {
    const validIds = new Set(fileEntries.map((file) => file.id));
    expect(featuredProjects.every((project) => validIds.has(project.id))).toBe(true);
    expect(portfolioLinks.cv).toBe('/Angelo-Palpalatoc-CV.pdf');
    expect(sectionInfo.lighthouse.meta).toContainEqual(['links', 'Private (NDA)']);
  });
});
