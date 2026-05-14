import arcDummy from '@/assets/data/arc-dummy.json';

import type { ArcDataset, ArcRepository } from './types';

const dataset = arcDummy as ArcDataset;

export const bundledArcRepository: ArcRepository = {
  async loadAll() {
    return dataset;
  },
};
