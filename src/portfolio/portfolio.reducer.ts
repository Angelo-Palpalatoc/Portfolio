import type { PortfolioAction, PortfolioState, SectionId, SerialLine } from './portfolio.types';
import { fileEntries } from './portfolio.data';

export const initialPortfolioState: PortfolioState = {
  boot: 'loading',
  bootStep: 0,
  active: 'main',
  tabs: ['main'],
  drawerOpen: false,
  serialOpen: false,
  compile: 'idle',
  serial: [
    { time: '[01:24:32]', message: 'Portfolio initialized' },
    { time: '[01:24:33]', message: 'Projects loaded' },
    { time: '[01:24:34]', message: 'GitHub connection established', tone: 'success' },
  ],
};

function appendLog(lines: SerialLine[], line: SerialLine): SerialLine[] {
  return [...lines, line].slice(-40);
}

function includesTab(tabs: SectionId[], id: SectionId): boolean {
  return tabs.includes(id);
}

export function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'boot-step':
      return state.boot === 'loading'
        ? { ...state, bootStep: Math.min(4, state.bootStep + 1) }
        : state;
    case 'boot-wordmark':
      return state.boot === 'loading' ? { ...state, boot: 'wordmark' } : state;
    case 'boot-finish':
      return { ...state, boot: 'done' };
    case 'open-file': {
      const file = fileEntries.find((entry) => entry.id === action.id);
      if (!file) return state;
      return {
        ...state,
        active: action.id,
        tabs: includesTab(state.tabs, action.id) ? state.tabs : [...state.tabs, action.id],
        drawerOpen: false,
        serial: appendLog(state.serial, {
          time: action.time,
          message: `Opened ${file.path}`,
        }),
      };
    }
    case 'select-tab':
      return includesTab(state.tabs, action.id) ? { ...state, active: action.id } : state;
    case 'close-tab': {
      if (!includesTab(state.tabs, action.id)) return state;
      const remaining = state.tabs.filter((id) => id !== action.id);
      const tabs: SectionId[] = remaining.length > 0 ? remaining : ['main'];
      return {
        ...state,
        tabs,
        active: state.active === action.id ? tabs[tabs.length - 1] : state.active,
      };
    }
    case 'toggle-drawer':
      return { ...state, drawerOpen: !state.drawerOpen };
    case 'close-drawer':
      return { ...state, drawerOpen: false };
    case 'toggle-serial':
      return { ...state, serialOpen: !state.serialOpen };
    case 'compile-start':
      return {
        ...state,
        compile: 'compiling',
        serial: appendLog(state.serial, { time: action.time, message: 'Compiling sketch...' }),
      };
    case 'compile-success':
      return {
        ...state,
        compile: 'success',
        serial: appendLog(state.serial, {
          time: action.time,
          message: 'Success — 0 errors, 0 warnings',
          tone: 'success',
        }),
      };
    case 'compile-clear':
      return { ...state, compile: 'idle' };
  }
}
