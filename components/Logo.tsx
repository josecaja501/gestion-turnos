interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

export default function Logo({ size = 'medium', showText = true }: LogoProps) {
  const sizes = {
    small: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-lg' },
    medium: { box: 'w-16 h-16', icon: 'w-10 h-10', text: 'text-2xl' },
    large: { box: 'w-24 h-24', icon: 'w-14 h-14', text: 'text-3xl' },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      <div className={`${s.box} bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg`}>
        <svg className={`${s.icon} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      {showText && (
        <div>
          <h1 className={`${s.text} font-bold text-white`}>Gestión Turnos</h1>
          <p className="text-xs text-blue-200">Sistema de gestión</p>
        </div>
      )}
    </div>
  )
}