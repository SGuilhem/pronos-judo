import type { CurrentCompetition } from '@/types'

// ← SEUL FICHIER À MODIFIER À CHAQUE NOUVELLE COMPÉTITION
export const currentCompetition: CurrentCompetition = {
  id:             2877,     // changer ici pour 3151 en octobre 2026
  type:           'worlds', // 'worlds' | 'euros' | 'grand-slam'
  fightStartHour: 10,       // heure locale de début des combats
}