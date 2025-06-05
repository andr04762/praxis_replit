// AI Assistant utility functions
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const predefinedPrompts = [
  {
    title: "Explain SQL Joins",
    description: "Get a detailed explanation of different JOIN types",
    prompt: "Can you explain the different types of SQL JOINs (INNER, LEFT, RIGHT, FULL OUTER) with examples using healthcare data? Include when to use each type."
  },
  {
    title: "BigQuery Best Practices",
    description: "Learn optimization techniques for healthcare data",
    prompt: "What are the best practices for optimizing BigQuery queries when working with large healthcare datasets? Include cost optimization tips."
  },
  {
    title: "Healthcare Data Privacy",
    description: "HIPAA compliance in data analytics workflows",
    prompt: "How do I ensure HIPAA compliance when working with healthcare data in SQL and BigQuery? What are the key considerations for data analytics workflows?"
  },
  {
    title: "Query Optimization",
    description: "Tips for improving query performance",
    prompt: "What are the most effective techniques for optimizing SQL query performance in healthcare analytics? Include both general SQL and BigQuery-specific optimizations."
  }
];

export async function sendChatMessage(message: string, context?: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to communicate with AI assistant');
  }
}
