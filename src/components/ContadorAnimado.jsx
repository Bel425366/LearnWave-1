import { useEffect, useRef, useState } from 'react'

/**
 * Anima um número de 0 até o valor final ao montar/atualizar.
 * Suporta valores decimais (ex: média 8.5) via prop `decimais`.
 *
 * Props:
 *   valor     - número final
 *   decimais  - casas decimais (default 0)
 *   duracao   - duração da animação em ms (default 900)
 */
function ContadorAnimado({ valor = 0, decimais = 0, duracao = 900 }) {
  const alvo = Number(valor) || 0
  const [atual, setAtual] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const inicio = performance.now()
    const de = 0
    const anima = (agora) => {
      const t = Math.min((agora - inicio) / duracao, 1)
      // easing suave (ease-out cubic)
      const eased = 1 - Math.pow(1 - t, 3)
      setAtual(de + (alvo - de) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(anima)
      else setAtual(alvo)
    }
    rafRef.current = requestAnimationFrame(anima)
    return () => cancelAnimationFrame(rafRef.current)
  }, [alvo, duracao])

  return <>{atual.toFixed(decimais)}</>
}

export default ContadorAnimado
