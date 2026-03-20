import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BillData, parsePDF } from '@/lib/pdfParser';
import { toast } from 'sonner';

interface PDFUploaderProps {
  onBillsProcessed: (bills: BillData[]) => void;
}

export default function PDFUploader({ onBillsProcessed }: PDFUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast.error('Apenas arquivos PDF são aceitos');
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== droppedFiles.length) {
      toast.error('Apenas arquivos PDF são aceitos');
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processPDFs = async () => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um arquivo PDF');
      return;
    }

    setIsProcessing(true);
    try {
      const processedBills: BillData[] = [];
      
      for (const file of files) {
        try {
          const billData = await parsePDF(file);
          processedBills.push(billData);
        } catch (error) {
          console.error(`Erro ao processar ${file.name}:`, error);
          toast.error(`Erro ao processar ${file.name}`);
        }
      }

      if (processedBills.length > 0) {
        onBillsProcessed(processedBills);
        setFiles([]);
        toast.success(`${processedBills.length} fatura(s) processada(s) com sucesso`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-lg font-semibold text-gray-700 mb-1">
          Arraste PDFs aqui ou clique para selecionar
        </p>
        <p className="text-sm text-gray-500">
          Suporta faturas da Copel em formato PDF
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Arquivos selecionados ({files.length})
          </h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200"
              >
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <Button
            onClick={processPDFs}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Processar Faturas'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
