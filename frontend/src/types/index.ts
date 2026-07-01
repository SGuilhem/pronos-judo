// ── Categories ─────────────────────────────────────────────────────────────
export type Gender = 'men' | 'women'

export interface Category {
  weightId: number
  gender:   Gender
  label:    string
}

// ── Competition config ─────────────────────────────────────────────────────
export type CompetitionType = 'worlds' | 'euros' | 'grand-slam'

export interface DayFormat {
  day:       number
  weightIds: number[]
}

export interface CurrentCompetition {
  id:             number
  type:           CompetitionType
  fightStartHour: number
}

// ── Leaderboard ────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  username: string
  points:   number
}

// ── Archives ───────────────────────────────────────────────────────────────
export interface ArchivedCompetition {
  competitionId: string
  title:         string
  date_from:     string
  date_to:       string
  leaderboard:   LeaderboardEntry[]
}

// ── Predictions ────────────────────────────────────────────────────────────
export interface PredictionSelect {
  label:   string
  value:   string
  options: string[]
}

export interface DayPredictions {
  women: PredictionSelect[]
  men:   PredictionSelect[]
}

export interface PredictionResult {
  predictions?: {
    menFirstPlace?:    string
    menSecondPlace?:   string
    menThirdPlace1?:   string
    menThirdPlace2?:   string
    womenFirstPlace?:  string
    womenSecondPlace?: string
    womenThirdPlace1?: string
    womenThirdPlace2?: string
  }
}

export interface UserPrediction {
  event:       string
  firstPlace:  string
  secondPlace: string
  thirdPlace1: string
  thirdPlace2: string
}

export interface User {
  username:    string
  predictions: UserPrediction[]
}

export interface RawPrediction {
  username:       string
  competitionDay: number
  predictions:    Record<string, string>
}

// ── IJF API ────────────────────────────────────────────────────────────────
export interface Competitor {
  family_name:    string
  given_name:     string
  country_short:  string
  ranking_place?: number
  place?:         string
  id?:            string
  country?:       string
}

export interface IJFCategoryData {
  persons: Record<string, Competitor>
}

export interface IJFResponse {
  categories: Record<number, Record<number, IJFCategoryData>>
}