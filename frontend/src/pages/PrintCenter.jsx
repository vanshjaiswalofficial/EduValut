import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Link } from 'react-router-dom';
import { FiPrinter, FiCheckCircle, FiXCircle, FiAlertCircle, FiDownload, FiFolderPlus, FiInfo } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

const PrintCenter = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('Scholarship');
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState('');

  // Define package templates and required subcategory strings
  const packageTemplates = {
    Scholarship: {
      name: 'Scholarship Package',
      description: 'Standard compilation required for institutional and state scholarship applications.',
      requirements: ['Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Scholarship Forms', 'Bank Passbook'],
    },
    Academic: {
      name: 'Academic Verification Package',
      description: 'Consolidated set of academic scores for admission verification or placements.',
      requirements: ['10th Marksheet', '12th Marksheet', 'Semester Results', 'Degree Certificate'],
    },
    KYC: {
      name: 'KYC & Identity Package',
      description: 'Standard identity proof and portrait compilation.',
      requirements: ['Aadhaar Card', 'PAN Card', 'Passport Photo'],
    }
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/documents');
        setDocuments(res.data);
      } catch (err) {
        console.error('Failed to load documents catalog in Print Center', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Map each requirement in active package to matched document in database
  const getMatchedDocs = () => {
    const requirements = packageTemplates[selectedPackage].requirements;
    return requirements.map((req) => {
      // Find document that matches the subCategory string
      const matched = documents.find((doc) => doc.subCategory.toLowerCase() === req.toLowerCase());
      return {
        requirement: req,
        doc: matched || null
      };
    });
  };

  const matchedItems = getMatchedDocs();
  const matchedCount = matchedItems.filter(item => item.doc !== null).length;
  const totalCount = matchedItems.length;
  const isComplete = matchedCount === totalCount;

  // Compilation Core Logic: Merging PDFs and Image files using pdf-lib
  const handleCompilePackage = async () => {
    if (matchedCount === 0) {
      return setCompileError('You need at least one matched document to compile a package.');
    }

    setCompiling(true);
    setCompileError('');
    
    try {
      // Create a new blank PDF Document
      const mergedPdf = await PDFDocument.create();

      // Loop through matched documents and merge
      for (const item of matchedItems) {
        if (!item.doc) continue;

        const url = item.doc.url;
        // Fetch file as ArrayBuffer
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to download: ${item.doc.name}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        if (item.doc.fileType === 'pdf') {
          // Load PDF document
          const donorPdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else {
          // Load image (JPG/PNG) and wrap onto a PDF page
          const isJpg = item.doc.fileType === 'jpg' || item.doc.fileType === 'jpeg';
          let imageEmbed;
          
          if (isJpg) {
            imageEmbed = await mergedPdf.embedJpg(arrayBuffer);
          } else {
            imageEmbed = await mergedPdf.embedPng(arrayBuffer);
          }

          // Create a new page matching the image dimensions
          const page = mergedPdf.addPage([imageEmbed.width, imageEmbed.height]);
          page.drawImage(imageEmbed, {
            x: 0,
            y: 0,
            width: imageEmbed.width,
            height: imageEmbed.height,
          });
        }
      }

      // Serialize PDF to bytes
      const pdfBytes = await mergedPdf.save();

      // Create blob and trigger file download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${packageTemplates[selectedPackage].name.replace(/\s+/g, '_')}_Package.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
    } catch (err) {
      console.error('PDF Compile Error:', err);
      setCompileError(`Failed to merge package files: ${err.message}. Make sure files are accessible and not blocked by cross-origin policies.`);
    } finally {
      setCompiling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Title */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Print Package Center</h2>
        <p className="text-xs text-slate-400 font-semibold">Compile individual academic files, scores, and receipts into single PDF booklets</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column: Package Options Selection */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Bundles</span>
          {Object.entries(packageTemplates).map(([key, value]) => (
            <div
              key={key}
              onClick={() => {
                setCompileError('');
                setSelectedPackage(key);
              }}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                selectedPackage === key
                  ? 'bg-primary-50 border-primary-350 dark:bg-primary-950/20 dark:border-primary-800/80 text-primary-950 dark:text-primary-100'
                  : 'bg-white border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:bg-darkbg-100/50'
              }`}
            >
              <h4 className="text-xs font-bold">{value.name}</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Right Column: Matched List & compiler */}
        <div className="md:col-span-2 space-y-4">
          
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-darkbg-100/50 space-y-4 flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">
                  Package Requirements Checklist
                </h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isComplete
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                }`}>
                  {matchedCount} / {totalCount} Matched
                </span>
              </div>

              {compileError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-[11px] font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-450">
                  <FiAlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{compileError}</span>
                </div>
              )}

              {/* Requirements checklist mapping */}
              {loading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {matchedItems.map((item) => (
                    <div
                      key={item.requirement}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 dark:bg-slate-900/30 dark:border-slate-850"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {item.doc ? (
                          <FiCheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <FiXCircle className="h-5 w-5 text-slate-350 dark:text-slate-650 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.requirement}</p>
                          {item.doc ? (
                            <p className="text-[10px] text-slate-400 truncate max-w-[280px]" title={item.doc.name}>
                              Matched: {item.doc.name}
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-450 font-semibold italic">Missing file</p>
                          )}
                        </div>
                      </div>

                      {/* Right Link */}
                      {!item.doc && (
                        <Link
                          to="/upload"
                          className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-primary-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-primary-400"
                        >
                          Upload Doc
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action compilation trigger */}
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800 flex flex-col gap-3">
              <button
                type="button"
                disabled={loading || compiling || matchedCount === 0}
                onClick={handleCompilePackage}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 text-sm font-bold text-white transition hover:shadow-lg disabled:opacity-50"
              >
                <FiPrinter className="h-4.5 w-4.5" />
                {compiling ? 'Downloading & Compiling PDF...' : 'Compile Combined Package PDF'}
              </button>
              
              <div className="flex gap-1.5 items-start text-[10px] font-semibold text-slate-400">
                <FiInfo className="h-4.5 w-4.5 text-primary-500 flex-shrink-0 mt-0.5" />
                <p>Compilation automatically converts PNG/JPG files to PDF page layout format and merges everything. In demo mode, mock files will be compiled on the fly.</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PrintCenter;
