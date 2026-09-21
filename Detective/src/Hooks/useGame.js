import { useContext } from 'react'
import { GameContext } from '../Context/GameContext'
export default function useGame() { return useContext(GameContext) }
