
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <span className="font-bold">Important Disclaimer:</span> This is an AI-powered analysis and NOT a medical diagnosis. It is for informational purposes only. Please consult a qualified healthcare professional for any health concerns or a definitive diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};
