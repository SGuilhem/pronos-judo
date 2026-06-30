export interface CompetitionDay {
  day: number
  events: [string, string]
}

export interface LeaderboardEntry {
  username: string
  points: number
}

export interface PredictionSelect {
  label: string
  value: string
  options: string[]
}

export interface DayPredictions {
  women: PredictionSelect[]
  men: PredictionSelect[]
}

export interface PredictionResult {
  predictions?: {
    menFirstPlace?: string
    menSecondPlace?: string
    menThirdPlace1?: string
    menThirdPlace2?: string
    womenFirstPlace?: string
    womenSecondPlace?: string
    womenThirdPlace1?: string
    womenThirdPlace2?: string
  }
}

export interface Competitor {
  family_name: string
  given_name: string
  country_short: string
  ranking_place?: number
  place?: string
}