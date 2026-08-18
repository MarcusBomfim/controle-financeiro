import { ChartNoAxesCombined } from 'lucide-react'

export function LoadingScreen() {
  return (
    <main className="loading-screen" aria-live="polite">
      <span className="brand__mark" aria-hidden="true">
        <ChartNoAxesCombined size={21} />
      </span>
      <p>Carregando seus dados...</p>
    </main>
  )
}
