'use client'

import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  name: string
  options: SelectOption[]
  defaultValue?: string
  required?: boolean
  placeholder?: string
}

export default function Select({ name, options, defaultValue = '', required, placeholder = 'Selecciona una opción' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue)
  const [selectedLabel, setSelectedLabel] = useState(
    options.find(opt => opt.value === defaultValue)?.label || ''
  )
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value: string, label: string) => {
    setSelected(value)
    setSelectedLabel(label)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      {/* Input oculto para enviar el valor en el form */}
      <input type="hidden" name={name} value={selected} required={required} />

      {/* Botón que simula el select */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border-2 rounded-lg text-left font-medium flex items-center justify-between transition-all ${
          isOpen
            ? 'border-blue-600 bg-white shadow-md'
            : selected
              ? 'border-gray-400 bg-white hover:border-gray-600 text-gray-900'
              : 'border-gray-400 bg-white hover:border-gray-600 text-gray-500'
        }`}
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-500'}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-700 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value, option.label)}
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                selected === option.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}