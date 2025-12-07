
import React, { useState } from 'react';
import { Header } from './components/Header';
import { BmiCalculator } from './components/BmiCalculator';
import { FileHeart } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bmi'>('bmi');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-white rounded-lg shadow-md p-2 flex items-center justify-center space-x-2">
            <button
              onClick={() => setActiveTab('bmi')}
              className={`w-full text-center px-4 py-3 rounded-md transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 ${
                activeTab === 'bmi'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-blue-50'
              }`}
            >
              <FileHeart className="w-5 h-5" />
              <span className="font-semibold">Diet Advisor (BMI)</span>
            </button>
          </div>

          <div>
            {activeTab === 'bmi' && <BmiCalculator />}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Disclaimer: This tool provides AI-generated suggestions and is not a substitute for professional medical advice.</p>
        <p>&copy; 2024 AI Health Advisor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
