'use client'
import { motion } from 'framer-motion'
import { TruckSvg } from './TruckSvg'
import styles from './tank.module.css'

interface TankProps {
  fuel: string
  fuelLevel: number
  fuelCapacity: number
  type: 'internal' | 'external'
}

export function Tank({ type, fuel, fuelLevel, fuelCapacity }: TankProps) {
  const fuelLevelPercent = (fuelLevel * 100) / fuelCapacity
  const background =
    fuelLevelPercent <= 33
      ? '#ef4444'
      : fuelLevelPercent > 33 && fuelLevelPercent < 66
        ? '#fde047'
        : '#10b981'

  return (
    <div className="flex flex-col gap-4">
      <div className={styles.fuelContainer}>
        <TruckSvg />
        <div className={styles.fuelPump}>
          <motion.div
            animate={{ height: `${fuelLevelPercent}%`, background }}
            className={styles.fuelLevel}
          />
        </div>
      </div>
      <p className="text-xl font-bold uppercase text-slate-600">{fuel}</p>
      <p className="text-xl text-slate-800">
        Capacidade máxima: {fuelCapacity} L
      </p>
      <p className="text-xl text-slate-800">Quantidade: {fuelLevel} L</p>
    </div>
  )
}
