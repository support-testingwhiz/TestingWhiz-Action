import { Input } from '@/types/input.js'

export interface InputProvider {
  fetchInput(): Input
}
