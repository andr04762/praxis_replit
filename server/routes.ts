import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all modules
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  // Get specific module
  app.get("/api/modules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const module = await storage.getModule(id);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch module" });
    }
  });

  // Get quiz for module
  app.get("/api/modules/:id/quiz", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const quiz = await storage.getQuizByModuleId(moduleId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found for this module" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Get SQL lab for module
  app.get("/api/modules/:id/lab", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const lab = await storage.getSqlLabByModuleId(moduleId);
      if (!lab) {
        return res.status(404).json({ message: "SQL lab not found for this module" });
      }
      res.json(lab);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SQL lab" });
    }
  });

  // Get user progress
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  // Update user progress
  app.post("/api/users/:userId/progress/:moduleId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const moduleId = parseInt(req.params.moduleId);
      const progressUpdate = req.body;
      
      const updatedProgress = await storage.updateUserProgress(userId, moduleId, progressUpdate);
      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user progress" });
    }
  });

  // Submit quiz answers
  app.post("/api/modules/:id/quiz/submit", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const { userId, answers } = req.body;
      
      const quiz = await storage.getQuizByModuleId(moduleId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Calculate score
      let correct = 0;
      const results = quiz.questions.map((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) correct++;
        
        return {
          questionId: question.id,
          correct: isCorrect,
          userAnswer,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation
        };
      });

      const score = Math.round((correct / quiz.questions.length) * 100);

      // Update user progress
      await storage.updateUserProgress(userId, moduleId, { quizScore: score });

      res.json({ score, results });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  // Execute SQL query (simulated)
  app.post("/api/sql/execute", async (req, res) => {
    try {
      const { query, userId, moduleId } = req.body;
      
      // In a real implementation, this would execute against a sandbox database
      // For now, we'll return the expected result from the lab
      const lab = await storage.getSqlLabByModuleId(moduleId);
      if (!lab) {
        return res.status(404).json({ message: "SQL lab not found" });
      }

      // Simulate query execution time
      setTimeout(() => {
        res.json({
          success: true,
          results: lab.expectedResult,
          executionTime: "0.42s",
          rowCount: lab.expectedResult.length
        });
      }, 1000);

      // Update lab completion
      await storage.updateUserProgress(userId, moduleId, { labCompleted: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to execute SQL query" });
    }
  });

  // AI Assistant chat
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;

      const systemPrompt = `You are an AI assistant for a healthcare SQL and BigQuery course. You help students understand SQL concepts, BigQuery features, and healthcare analytics best practices. 

Current context: ${context || "General course assistance"}

Provide helpful, accurate, and educational responses. Focus on:
- SQL syntax and best practices
- BigQuery-specific features
- Healthcare data analysis concepts
- HIPAA compliance considerations
- Query optimization techniques

Keep responses concise but informative. Use examples when helpful.`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const aiResponse = response.choices[0].message.content;
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  // Get current user (mock authentication)
  app.get("/api/auth/user", async (req, res) => {
    try {
      // In a real app, this would check session/token
      const user = await storage.getUser(1); // Default to user ID 1
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
