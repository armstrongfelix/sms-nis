import { create } from 'zustand'
import { states as getStates, lgas as getLgas } from 'nigerian-states-and-lgas'

const useLocationStore = create(() => ({
  states: getStates(),
  getLgas: (state) => getLgas(state) || [],
}))

export default useLocationStore
