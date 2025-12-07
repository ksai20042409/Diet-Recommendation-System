
import React from 'react';

interface ResultCardProps {
    title: string;
    content: string;
}

const parseMarkdown = (text: string) => {
    // A simple markdown parser for bold, headers, and lists
    return text
        .split('\n')
        .map((line, index) => {
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(3)}</h2>;
            }
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
            }
            if (line.startsWith('- ')) {
                return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
            }
            if (line.trim() === '') {
                return <br key={index} />;
            }
            // Simple bolding with **text**
            const parts = line.split('**');
            return (
                <p key={index} className="text-gray-700 leading-relaxed">
                    {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                </p>
            );
        });
};


export const ResultCard: React.FC<ResultCardProps> = ({ title, content }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            <div className="prose prose-blue max-w-none">
                {parseMarkdown(content)}
            </div>
        </div>
    );
};
