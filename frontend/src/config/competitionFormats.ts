import type { CompetitionType, DayFormat } from '@/types'

export const COMPETITION_FORMATS: Record<CompetitionType, DayFormat[]> = {
  worlds: [
    { day: 1, weightIds: [8, 1]  },
    { day: 2, weightIds: [9, 2]  },
    { day: 3, weightIds: [10, 3] },
    { day: 4, weightIds: [11, 4] },
    { day: 5, weightIds: [12, 5] },
    { day: 6, weightIds: [13, 6] },
    { day: 7, weightIds: [14, 7] },
  ],
  euros: [
    { day: 1, weightIds: [1, 2, 8, 9]   },
    { day: 2, weightIds: [3, 10, 11]    },
    { day: 3, weightIds: [4, 5, 12]     },
    { day: 4, weightIds: [6, 7, 13, 14] },
  ],
  'grand-slam': [
    { day: 1, weightIds: [1, 2, 3, 8, 9, 10, 11]  },
    { day: 2, weightIds: [4, 5, 6, 7, 12, 13, 14] },
  ],
}