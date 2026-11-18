import type { CinemaDeck, CinemaScene } from '../types/cinema.types';

export function formatCinemaTime(sec: number): string;
export function estimateSceneDuration(speech: string, baseSec: number): number;
export function buildDeckTimeline(deck: CinemaDeck): {
  starts: number[];
  ends: number[];
  total: number;
};
export function resolveActiveSceneIndex(starts: number[], currentTime: number): number;
export function buildWebVttDataUri(
  scenes: CinemaScene[],
  starts: number[],
  ends: number[],
): string;
