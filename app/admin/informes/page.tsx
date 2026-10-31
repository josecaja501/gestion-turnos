'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default function InformesPage() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [loading, setLoading] = useState(false)

  // Función para obtener los datos (reutilizable para PDF y Excel)
  const obtenerDatos = async (tipo: 'tareas' | 'novedades') => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor, selecciona ambas fechas')
      return null
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/informes/${tipo}?inicio=${fechaInicio}&fin=${fechaFin}`)
      if (!response.ok) throw new Error('Error al obtener los datos')
      return await response.json()
    } catch (error) {
      console.error(error)
      alert('Error al obtener los datos')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Generar PDF
  const generarPDF = async (tipo: 'tareas' | 'novedades') => {
    const datos = await obtenerDatos(tipo)
    if (!datos) return

    const doc = new jsPDF()
    const titulo = tipo === 'tareas' ? 'Informe de Tareas' : 'Informe de Novedades'
    
    doc.setFontSize(18)
    doc.setTextColor(30, 58, 138)
    doc.text(titulo, 14, 20)
    
    doc.setFontSize(11)
    doc.setTextColor(100, 100, 100)
    doc.text(`Período: ${new Date(fechaInicio).toLocaleDateString('es-ES')} - ${new Date(fechaFin).toLocaleDateString('es-ES')}`, 14, 28)
    doc.setFontSize(9)
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 14, 34)

    const total = datos.length
    const realizadas = tipo === 'tareas' ? datos.filter((t: any) => t.estado === 'REALIZADA').length : 0
    const pendientes = tipo === 'tareas' ? datos.filter((t: any) => t.estado === 'PENDIENTE').length : 0

    doc.setFontSize(10)
    doc.setTextColor(30, 58, 138)
    doc.text('Resumen:', 14, 44)
    doc.setTextColor(50, 50, 50)
    doc.setFontSize(9)
    
    let resumenTexto = `Total: ${total}`
    if (tipo === 'tareas') {
      resumenTexto += ` | Realizadas: ${realizadas} | Pendientes: ${pendientes}`
    }
    doc.text(resumenTexto, 14, 50)

    let tableData: any[] = []
    let head: any[] = []
    let columnStyles: any = {}

    if (tipo === 'tareas') {
      head = [['Fecha', 'Turno', 'Técnico', 'Descripción', 'Estado', 'Notas']]
      tableData = datos.map((t: any) => [
        new Date(t.fecha).toLocaleDateString('es-ES'),
        t.turno === 'MANANA' ? 'Mañana' : t.turno === 'TARDE' ? 'Tarde' : 'Noche',
        t.tecnico?.nombre || 'Sin asignar',
        t.descripcion,
        t.estado === 'REALIZADA' ? 'Realizada' : t.estado === 'NO_REALIZADA' ? 'No Realizada' : 'Pendiente',
        t.notas || '-'
      ])
      columnStyles = { 0: { cellWidth: 25 }, 1: { cellWidth: 20 }, 2: { cellWidth: 35 }, 3: { cellWidth: 'auto' }, 4: { cellWidth: 25 }, 5: { cellWidth: 35 } }
    } else {
      head = [['Fecha', 'Turno', 'Técnico', 'Novedades']]
      tableData = datos.map((n: any) => [
        new Date(n.fecha).toLocaleDateString('es-ES'),
        n.turno === 'MANANA' ? 'Mañana' : n.turno === 'TARDE' ? 'Tarde' : 'Noche',
        n.tecnico?.nombre || 'Sin asignar',
        n.novedades
      ])
      columnStyles = { 0: { cellWidth: 25 }, 1: { cellWidth: 20 }, 2: { cellWidth: 35 }, 3: { cellWidth: 'auto' } }
    }

    autoTable(doc, {
      startY: 55,
      head: head,
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: columnStyles
    })

    doc.save(`informe_${tipo}_${fechaInicio}_${fechaFin}.pdf`)
  }

  // Generar Excel
  const generarExcel = async (tipo: 'tareas' | 'novedades') => {
    const datos = await obtenerDatos(tipo)
    if (!datos) return

    let excelData: any[] = []

    if (tipo === 'tareas') {
      excelData = datos.map((t: any) => ({
        Fecha: new Date(t.fecha).toLocaleDateString('es-ES'),
        Turno: t.turno === 'MANANA' ? 'Mañana' : t.turno === 'TARDE' ? 'Tarde' : 'Noche',
        Técnico: t.tecnico?.nombre || 'Sin asignar',
        Descripción: t.descripcion,
        Estado: t.estado === 'REALIZADA' ? 'Realizada' : t.estado === 'NO_REALIZADA' ? 'No Realizada' : 'Pendiente',
        Notas: t.notas || '-'
      }))
    } else {
      excelData = datos.map((n: any) => ({
        Fecha: new Date(n.fecha).toLocaleDateString('es-ES'),
        Turno: n.turno === 'MANANA' ? 'Mañana' : n.turno === 'TARDE' ? 'Tarde' : 'Noche',
        Técnico: n.tecnico?.nombre || 'Sin asignar',
        Novedades: n.novedades
      }))
    }

    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, tipo === 'tareas' ? 'Tareas' : 'Novedades')
    XLSX.writeFile(wb, `informe_${tipo}_${fechaInicio}_${fechaFin}.xlsx`)
  }

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6">
      <div className="max-w-2xl mx-auto mt-4 md:mt-10 bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Generar Informes</h1>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Fecha Inicio</label>
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Fecha Fin</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button onClick={() => generarPDF('tareas')} disabled={loading} className="bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-900 font-bold transition-colors disabled:bg-gray-400 shadow-sm">
              {loading ? 'Generando...' : '📄 PDF Tareas'}
            </button>
            <button onClick={() => generarPDF('novedades')} disabled={loading} className="bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-900 font-bold transition-colors disabled:bg-gray-400 shadow-sm">
              {loading ? 'Generando...' : '📄 PDF Novedades'}
            </button>
            <button onClick={() => generarExcel('tareas')} disabled={loading} className="bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-900 font-bold transition-colors disabled:bg-gray-400 shadow-sm">
              {loading ? 'Generando...' : ' Excel Tareas'}
            </button>
            <button onClick={() => generarExcel('novedades')} disabled={loading} className="bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-900 font-bold transition-colors disabled:bg-gray-400 shadow-sm">
              {loading ? 'Generando...' : '📊 Excel Novedades'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}