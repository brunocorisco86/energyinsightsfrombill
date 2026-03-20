import { useState } from 'react';
import PDFUploader from '@/components/PDFUploader';
import Dashboard from '@/components/Dashboard';
import { BillData } from '@/lib/pdfParser';
import { Zap } from 'lucide-react';

export default function Home() {
  const [bills, setBills] = useState<BillData[]>([]);

  const handleBillsProcessed = (newBills: BillData[]) => {
    setBills(prev => [...prev, ...newBills]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AgroEnergy Insight Builder</h1>
              <p className="text-gray-600 text-sm">Análise de Faturas Copel com Geração Solar</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {bills.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao Dashboard</h2>
              <p className="text-gray-600 mb-8">
                Importe suas faturas de energia Copel para analisar consumo, geração solar, 
                créditos e autoconsumo em um único lugar.
              </p>
              <PDFUploader onBillsProcessed={handleBillsProcessed} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Seus Dados</h2>
              <button
                onClick={() => setBills([])}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpar dados
              </button>
            </div>
            <Dashboard bills={bills} />
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Adicionar mais faturas</h3>
              <PDFUploader onBillsProcessed={handleBillsProcessed} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2026 AgroEnergy Insight Builder. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
