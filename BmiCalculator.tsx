import React, { useState } from 'react';
import type { BmiResult } from '../types';
import { generateDietPlan } from '../services/geminiService';
import { Spinner } from './Spinner';
import { ResultCard } from './ResultCard';

export const BmiCalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [deficiencies, setDeficiencies] = useState<string[]>([]);
  const [customDeficiency, setCustomDeficiency] = useState<string>('');
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const deficiencyOptions = [
    'Iron',
    'Vitamin D',
    'Vitamin B12',
    'Calcium',
    'Protein',
    'Fiber',
    'Magnesium',
    'Zinc',
  ];

  const handleDeficiencyToggle = (deficiency: string) => {
    setDeficiencies((prev) =>
      prev.includes(deficiency)
        ? prev.filter((d) => d !== deficiency)
        : [...prev, deficiency]
    );
  };

  const calculateBmi = async () => {
    setError('');
    setResult(null);

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setError('Please enter valid positive numbers for height and weight.');
      return;
    }

    setLoading(true);

    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);

    let category: BmiResult['category'];
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }
    
    // Combine selected deficiencies with custom deficiency
    const allDeficiencies = [...deficiencies];
    if (customDeficiency.trim()) {
      allDeficiencies.push(customDeficiency.trim());
    }
    
    try {
        const dietPlan = await generateDietPlan(category, allDeficiencies.length > 0 ? allDeficiencies : undefined);
        setResult({
          bmi: parseFloat(bmi.toFixed(2)),
          category,
          dietPlan,
          deficiencies: allDeficiencies.length > 0 ? allDeficiencies : undefined,
        });
    } catch (e) {
        setError('Failed to generate diet plan. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const getCategoryColor = (category: BmiResult['category']) => {
    switch (category) {
      case 'Underweight': return 'text-yellow-500';
      case 'Normal weight': return 'text-green-500';
      case 'Overweight': return 'text-orange-500';
      case 'Obese': return 'text-red-500';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-shadow hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">BMI & Diet Advisor</h2>
      <p className="text-gray-500 mb-6">Enter your height and weight to calculate your BMI and get a personalized diet plan.</p>
      
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">BMI Scale</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 bg-yellow-100 rounded-lg">
            <div className="font-semibold text-yellow-800 text-sm text-center">Underweight</div>
            <div className="text-gray-600 text-xs mt-1 text-center">BMI &lt; 18.5</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-green-100 rounded-lg">
            <div className="font-semibold text-green-800 text-sm text-center">Normal weight</div>
            <div className="text-gray-600 text-xs mt-1 text-center">BMI 18.5 - 24.9</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-orange-100 rounded-lg">
            <div className="font-semibold text-orange-800 text-sm text-center">Overweight</div>
            <div className="text-gray-600 text-xs mt-1 text-center">BMI 25.0 - 29.9</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-red-100 rounded-lg">
            <div className="font-semibold text-red-800 text-sm text-center">Obese</div>
            <div className="text-gray-600 text-xs mt-1 text-center">BMI ≥ 30.0</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g., 175"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 70"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Guidance about deficiencies */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-md font-semibold text-blue-700 mb-2">What are nutritional deficiencies?</h4>
        <p className="text-sm text-blue-900 mb-2">
          Nutritional deficiencies occur when your body lacks essential vitamins, minerals, or nutrients. Common deficiencies include iron, vitamin D, calcium, and more. If you know you have a deficiency (from a blood test or doctor's advice), select it below to get a diet plan that helps address it. If you have another concern, type it in the box.
        </p>
        <p className="text-xs text-blue-600">If unsure, you can leave this section blank for a general healthy diet plan.</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">Nutritional Deficiencies (Optional)</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {deficiencyOptions.map((deficiency) => (
            <label key={deficiency} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deficiencies.includes(deficiency)}
                onChange={() => handleDeficiencyToggle(deficiency)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{deficiency}</span>
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="customDeficiency" className="block text-sm font-medium text-gray-700 mb-1">Other Deficiency</label>
          <input
            type="text"
            id="customDeficiency"
            value={customDeficiency}
            onChange={(e) => setCustomDeficiency(e.target.value)}
            placeholder="e.g., Potassium, Iodine, Folate"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-center">{error}</div>}

      <button
        onClick={calculateBmi}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? <Spinner /> : 'Calculate & Get Diet Plan'}
      </button>

      {result && !loading && (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center mb-4">
                <p className="text-lg text-gray-600">Your BMI is</p>
                <p className="text-5xl font-bold text-blue-600">{result.bmi}</p>
                <p className={`text-xl font-semibold mt-2 ${getCategoryColor(result.category)}`}>{result.category}</p>
            </div>
            <ResultCard title="Your Personalized Diet Plan" content={result.dietPlan} />
        </div>
      )}
    </div>
  );
};
