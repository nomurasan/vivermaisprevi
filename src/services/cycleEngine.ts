import { DevelopmentCycle } from '../types';
export const currentCycle = (cycles: DevelopmentCycle[]) => cycles.find((cycle) => new Date(cycle.endDate) >= new Date()) ?? cycles[0];
