/* Global testing helpers and environment declarations for EditArray tests */

import type { EditArrayItem } from './ck-edit-array';

type PerformanceExecutor = () => unknown | Promise<unknown>;

interface PerformanceMetrics {
  min: number;
  max: number;
  avg: number;
  times: number[];
}

interface CreateEditArrayOptions {
  data?: EditArrayItem[];
  arrayField?: string;
  theme?: string;
  displayTemplate?: string;
  editTemplate?: string;
}

declare namespace NodeJS {
  interface Global {
    setupCustomMatchers?: () => void;
    createEditArray?: (options?: CreateEditArrayOptions) => HTMLElement;
    waitForComponent?: (element: HTMLElement, timeout?: number) => Promise<HTMLElement>;
    generateTestData?: (count?: number) => EditArrayItem[];
    measurePerformance?: (fn: PerformanceExecutor, iterations?: number) => Promise<PerformanceMetrics>;
    getMemoryUsage?: () => { used: number; total: number; limit: number } | null;
    getAriaAttributes?: (element: Element) => Record<string, string>;
    simulateKeyboardNavigation?: (element: Element, keys: readonly string[]) => void;
    createConsoleSpy?: (method?: keyof Console) => jest.SpyInstance<unknown, unknown[]>;
    TEST_ENV?: string;
  }
}

// Also augment the GlobalThis interface so globalThis.setupCustomMatchers and global.setupCustomMatchers
// are both recognized in different environments/editors.
interface GlobalThis {
  setupCustomMatchers?: () => void;
  createEditArray?: (options?: CreateEditArrayOptions) => HTMLElement;
  waitForComponent?: (element: HTMLElement, timeout?: number) => Promise<HTMLElement>;
  generateTestData?: (count?: number) => EditArrayItem[];
  measurePerformance?: (fn: PerformanceExecutor, iterations?: number) => Promise<PerformanceMetrics>;
  getMemoryUsage?: () => { used: number; total: number; limit: number } | null;
  getAriaAttributes?: (element: Element) => Record<string, string>;
  simulateKeyboardNavigation?: (element: Element, keys: readonly string[]) => void;
  createConsoleSpy?: (method?: keyof Console) => jest.SpyInstance<unknown, unknown[]>;
  TEST_ENV?: string;
}

declare global {
  // Keep the global function/var declarations for code that references global.setupCustomMatchers or createEditArray.
  let setupCustomMatchers: (() => void) | undefined;
  function setupCustomMatchers(): void;
  function createEditArray(options?: CreateEditArrayOptions): HTMLElement;
  function waitForComponent(element: HTMLElement, timeout?: number): Promise<HTMLElement>;
  function generateTestData(count?: number): EditArrayItem[];
  function measurePerformance(fn: PerformanceExecutor, iterations?: number): Promise<PerformanceMetrics>;
  function getMemoryUsage(): { used: number; total: number; limit: number } | null;
  function getAriaAttributes(element: Element): Record<string, string>;
  function simulateKeyboardNavigation(element: Element, keys: readonly string[]): void;
  function createConsoleSpy(method?: keyof Console): jest.SpyInstance<unknown, unknown[]>;
  let TEST_ENV: string | undefined;
}

export {};
