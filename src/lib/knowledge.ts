import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

export type KnowledgeItem = {
  category: string;
  question: string;
  answer: string;
};

let cachedKnowledge: KnowledgeItem[] | null = null;

export const getKnowledgeBase = (): KnowledgeItem[] => {
  if (cachedKnowledge) return cachedKnowledge;

  try {
    const filePath = path.join(process.cwd(), 'knowledge', 'data.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];
    
    cachedKnowledge = jsonData.map((row) => ({
      category: row['Category'] || 'General',
      question: row['Question'] || '',
      answer: row['Answer'] || '',
    }));

    return cachedKnowledge || [];
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return [];
  }
};

export const findRelevantContext = (query: string): string => {
  const knowledge = getKnowledgeBase();
  const queryLower = query.toLowerCase();

  const relevantItems = knowledge.filter(item => {
    const q = item.question.toLowerCase();
    const words = queryLower.split(' ');
    return words.some(w => w.length > 3 && q.includes(w));
  });

  if (relevantItems.length === 0) return "";

  return relevantItems.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n---\n');
};