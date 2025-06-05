import { 
  users, modules, quizzes, userProgress, sqlLabs,
  type User, type InsertUser, 
  type Module, type InsertModule,
  type Quiz, type InsertQuiz,
  type UserProgress, type InsertUserProgress,
  type SqlLab, type InsertSqlLab,
  type QuizQuestion
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Module methods
  getAllModules(): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;

  // Quiz methods
  getQuizByModuleId(moduleId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // User Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, moduleId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;

  // SQL Lab methods
  getSqlLabByModuleId(moduleId: number): Promise<SqlLab | undefined>;
  createSqlLab(lab: InsertSqlLab): Promise<SqlLab>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private modules: Map<number, Module>;
  private quizzes: Map<number, Quiz>;
  private userProgress: Map<string, UserProgress>;
  private sqlLabs: Map<number, SqlLab>;
  private currentUserId: number;
  private currentModuleId: number;
  private currentQuizId: number;
  private currentProgressId: number;
  private currentLabId: number;

  constructor() {
    this.users = new Map();
    this.modules = new Map();
    this.quizzes = new Map();
    this.userProgress = new Map();
    this.sqlLabs = new Map();
    this.currentUserId = 1;
    this.currentModuleId = 1;
    this.currentQuizId = 1;
    this.currentProgressId = 1;
    this.currentLabId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Create sample user
    const sampleUser: User = {
      id: 1,
      username: "student",
      password: "password",
      name: "Student Name"
    };
    this.users.set(1, sampleUser);
    this.currentUserId = 2;

    // Create course modules from your course specification
    const moduleData = [
      {
        title: "Unlock the Power of SQL & BigQuery",
        description: "What is the world of SQL and why should I care? Ready to move beyond spreadsheets and front-end exports? In this kickoff module of our \"Advanced Analytics in Healthcare\" series, we break down what SQL is, why it matters, and how Google BigQuery turns raw EHR, claims, lab, and wearable data into lightning-fast insights.",
        videoUrl: "https://youtu.be/3K8Xl",
        videoDuration: "15:32",
        orderIndex: 1,
        isLocked: false
      },
      {
        title: "Intro to Healthcare Dataset",
        description: "Video Overview Welcome to Module 2 – Intro to a Healthcare Dataset in the Advanced Analytics in Healthcare SQL & BigQuery series!",
        videoUrl: "https://youtu.be/bt3P",
        videoDuration: "22:00",
        orderIndex: 2,
        isLocked: false
      },
      {
        title: "SQL Statement Basics",
        description: "SQL Advanced Analytics in Healthcare SQL & BigQuery – Module 3: SQL Statement Basics Using Generative AI Welcome to Module 3 of our Advanced Analytics in Healthcare SQL & BigQuery series!",
        videoUrl: "https://youtu.be/P9LM",
        videoDuration: "18:00",
        orderIndex: 3,
        isLocked: false
      }
    ];

    moduleData.forEach((mod, index) => {
      const module: Module = { id: index + 1, ...mod };
      this.modules.set(index + 1, module);
    });
    this.currentModuleId = 6;

    // Create sample quizzes
    const quizQuestions: QuizQuestion[] = [
      {
        id: 1,
        question: "What is the primary advantage of using SQL for healthcare data analysis compared to traditional spreadsheet tools?",
        options: [
          "SQL provides better visualization capabilities than spreadsheets",
          "SQL allows direct access to enterprise data with stable, scalable processing",
          "SQL is easier to learn than spreadsheet formulas",
          "SQL works only with structured data formats"
        ],
        correctAnswer: 1,
        explanation: "SQL provides direct, stable access to enterprise data with scalable processing capabilities, making it ideal for large healthcare datasets."
      },
      {
        id: 2,
        question: "What is BigQuery's main advantage for healthcare analytics?",
        options: [
          "It's free to use",
          "It provides serverless scale and real-time speed",
          "It only works with Google services",
          "It requires no SQL knowledge"
        ],
        correctAnswer: 1,
        explanation: "BigQuery offers serverless scale and real-time speed, allowing healthcare organizations to process large datasets without infrastructure management."
      }
    ];

    const quiz: Quiz = {
      id: 1,
      moduleId: 1,
      questions: quizQuestions as QuizQuestion[]
    };
    this.quizzes.set(1, quiz);
    this.currentQuizId = 2;

    // Create SQL lab for module 1
    const sqlLab: SqlLab = {
      id: 1,
      moduleId: 1,
      initialQuery: `-- Try writing your first SQL query
SELECT 
    patient_id,
    diagnosis_code,
    admission_date
FROM 
    healthcare.patient_records
WHERE 
    admission_date >= '2023-01-01'
LIMIT 10;`,
      expectedResult: [
        { patient_id: "P001234", diagnosis_code: "Z00.00", admission_date: "2023-03-15" },
        { patient_id: "P001235", diagnosis_code: "K59.1", admission_date: "2023-03-16" },
        { patient_id: "P001236", diagnosis_code: "M79.3", admission_date: "2023-03-17" }
      ],
      instructions: "Write a SQL query to select patient records from 2023. Try modifying the WHERE clause to filter different date ranges."
    };
    this.sqlLabs.set(1, sqlLab);
    this.currentLabId = 2;

    // Initialize user progress
    const progress1: UserProgress = {
      id: 1,
      userId: 1,
      moduleId: 1,
      completed: true,
      quizScore: 85,
      labCompleted: true,
      lastAccessed: new Date()
    };
    const progress2: UserProgress = {
      id: 2,
      userId: 1,
      moduleId: 2,
      completed: true,
      quizScore: null,
      labCompleted: true,
      lastAccessed: new Date()
    };
    const progress3: UserProgress = {
      id: 3,
      userId: 1,
      moduleId: 3,
      completed: true,
      quizScore: 92,
      labCompleted: false,
      lastAccessed: new Date()
    };

    this.userProgress.set("1-1", progress1);
    this.userProgress.set("1-2", progress2);
    this.userProgress.set("1-3", progress3);
    this.currentProgressId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllModules(): Promise<Module[]> {
    return Array.from(this.modules.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = this.currentModuleId++;
    const module: Module = { ...insertModule, id, isLocked: insertModule.isLocked ?? true };
    this.modules.set(id, module);
    return module;
  }

  async getQuizByModuleId(moduleId: number): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(quiz => quiz.moduleId === moduleId);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const quiz: Quiz = { 
      id, 
      moduleId: insertQuiz.moduleId, 
      questions: insertQuiz.questions as QuizQuestion[]
    };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${moduleId}`);
  }

  async updateUserProgress(userId: number, moduleId: number, progressUpdate: Partial<InsertUserProgress>): Promise<UserProgress> {
    const key = `${userId}-${moduleId}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated: UserProgress = { 
        ...existing, 
        ...progressUpdate,
        lastAccessed: new Date()
      };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentProgressId++;
      const newProgress: UserProgress = {
        id,
        userId,
        moduleId,
        completed: false,
        quizScore: null,
        labCompleted: false,
        lastAccessed: new Date(),
        ...progressUpdate
      };
      this.userProgress.set(key, newProgress);
      return newProgress;
    }
  }

  async getSqlLabByModuleId(moduleId: number): Promise<SqlLab | undefined> {
    return Array.from(this.sqlLabs.values()).find(lab => lab.moduleId === moduleId);
  }

  async createSqlLab(insertLab: InsertSqlLab): Promise<SqlLab> {
    const id = this.currentLabId++;
    const lab: SqlLab = { ...insertLab, id };
    this.sqlLabs.set(id, lab);
    return lab;
  }
}

export const storage = new MemStorage();
