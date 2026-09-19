const COR_PADRAO = 'linear-gradient(135deg, #667eea, #764ba2)'

/**
 * Avatar reutilizável de usuário.
 * Prioridade de exibição:
 *   1. fotoPerfil (imagem base64) -> mostra a foto
 *   2. emojiAvatar -> mostra o emoji com corAvatar (ou cor padrão) de fundo
 *   3. inicial do nome -> mostra a 1ª letra com corAvatar (ou cor padrão) de fundo
 *
 * Props:
 *   usuario  - objeto com { nome, fotoPerfil, corAvatar, emojiAvatar }
 *   size     - diâmetro em px (default 48)
 *   className - classe extra opcional
 */
function Avatar({ usuario = {}, size = 48, className = '' }) {
  const { nome, fotoPerfil, corAvatar, emojiAvatar } = usuario
  const fundo = corAvatar || COR_PADRAO
  const inicial = (nome || '?').trim().charAt(0).toUpperCase()

  const baseStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    color: '#fff',
    fontWeight: 700,
    fontSize: size * 0.42,
    lineHeight: 1,
    userSelect: 'none',
  }

  if (fotoPerfil) {
    return (
      <div className={className} style={baseStyle}>
        <img
          src={fotoPerfil}
          alt={nome ? `Foto de ${nome}` : 'Foto de perfil'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

  if (emojiAvatar) {
    return (
      <div className={className} style={{ ...baseStyle, background: fundo, fontSize: size * 0.5 }}>
        <span>{emojiAvatar}</span>
      </div>
    )
  }

  return (
    <div className={className} style={{ ...baseStyle, background: fundo }}>
      <span>{inicial}</span>
    </div>
  )
}

export default Avatar
