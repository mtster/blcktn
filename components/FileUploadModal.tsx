
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processUtilityBill } from '../services/gemini';

interface FileUploadModalProps {
  onClose: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startProcessing = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const data = await processUtilityBill(base64String, file.type);
        setResult(data);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("Failed to process document. Please ensure your API key is valid.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl glass rounded-3xl p-8 relative z-10 border border-white/10"
      >
        <h2 className="text-2xl font-bold mb-6">New Carbon Audit</h2>
        
        {!result ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center group hover:border-emerald-500/50 transition-colors">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="hidden" 
                id="file-upload" 
                accept="image/*,application/pdf"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 transition-colors">
                  <span className="text-2xl text-white group-hover:text-black">↑</span>
                </div>
                <p className="font-bold text-lg mb-1">{file ? file.name : "Select Utility Bill"}</p>
                <p className="text-white/30 text-sm">PNG, JPG or PDF up to 10MB</p>
              </label>
            </div>

            <button
              disabled={!file || isProcessing}
              onClick={startProcessing}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                !file || isProcessing 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isProcessing ? 'Processing with Gemini...' : 'Analyze Document'}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                EXTRACTION SUCCESSFUL
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-white/40 font-bold uppercase">Provider</span>
                  <p className="font-bold">{result.provider}</p>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 font-bold uppercase">Usage</span>
                  <p className="font-bold">{result.usage} {result.unit}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-white/40 font-bold uppercase">Estimated Carbon</span>
                  <p className="text-2xl font-bold text-white">{result.carbon_footprint_kg} kg CO2e</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-white text-black font-bold rounded-xl"
            >
              Finish & Save
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
