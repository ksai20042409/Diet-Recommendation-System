
export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  dietPlan: string;
  deficiencies?: string[];
}
