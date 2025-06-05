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
        videoUrl: "https://www.youtube.com/watch?v=3K8XMZuhg-8",
        videoDuration: "15:32",
        orderIndex: 1,
        isLocked: false
      },
      {
        title: "Intro to Healthcare Dataset",
        description: "Video Overview Welcome to Module 2 – Intro to a Healthcare Dataset in the Advanced Analytics in Healthcare SQL & BigQuery series!",
        videoUrl: "https://www.youtube.com/watch?v=bt3PVXmKxnw",
        videoDuration: "22:00",
        orderIndex: 2,
        isLocked: false
      },
      {
        title: "SQL Statement Basics",
        description: "SQL Advanced Analytics in Healthcare SQL & BigQuery – Module 3: SQL Statement Basics Using Generative AI Welcome to Module 3 of our Advanced Analytics in Healthcare SQL & BigQuery series!",
        videoUrl: "https://www.youtube.com/watch?v=P9LMgEfUDsY&t=2s",
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

    // Create knowledge check quizzes for Module 1
    const module1Questions: QuizQuestion[] = [
      {
        id: 1,
        question: "What is the fundamental advantage of learning a query language like SQL as a healthcare analyst?",
        options: [
          "It enables you to bypass IT and access unauthorized datasets",
          "It helps interpret data from data consumer to data explorer, increasing your ability to understand and influence data use",
          "It guarantees faster dashboard performance in Tableau and Power BI",
          "It automates all analytics tasks so analysts no longer need to interpret data"
        ],
        correctAnswer: 1,
        explanation: "SQL transforms healthcare analysts from data consumers to data explorers, giving them direct access to understand and influence how data is used for insights."
      }
    ];

    // Create knowledge check quizzes for Module 2
    const module2Questions: QuizQuestion[] = [
      {
        id: 2,
        question: "Which of the following best describes why separating different types of encounters (ED, hospital, ambulatory) into separate tables can be helpful for analysis—even if all the data could technically be stored in one table?",
        options: [
          "It increases query performance and reduces storage costs",
          "It makes it easier to enforce strict referential integrity across the system",
          "It aligns data structure with how humans conceptualize different care settings, allowing for clearer reasoning and insight",
          "It prevents analysts from accidentally querying the wrong data types"
        ],
        correctAnswer: 2,
        explanation: "Separating encounter types into different tables mirrors how healthcare professionals think about different care settings, making the data structure more intuitive for analysis and insight generation."
      }
    ];

    // Create knowledge check quizzes for Module 3
    const module3Questions: QuizQuestion[] = [
      {
        id: 3,
        question: "Which best reflects the role of SQL for a modern healthcare analyst in a world with generative AI tools?",
        options: [
          "A language analysts must memorize to preserve technical independence",
          "A general-skilled primarily used for joining and aggregating healthcare tables",
          "A tool for precisely expressing business questions and validating logic, even if AI drafts the query",
          "An outdated skill set that will likely be replaced by point-and-click interfaces"
        ],
        correctAnswer: 2,
        explanation: "In the age of AI, SQL serves as a precise language for expressing business questions and validating the logic of AI-generated queries, ensuring accuracy in healthcare analytics."
      }
    ];

    // Create quizzes for each module
    const quiz1: Quiz = {
      id: 1,
      moduleId: 1,
      questions: module1Questions
    };
    this.quizzes.set(1, quiz1);

    const quiz2: Quiz = {
      id: 2,
      moduleId: 2,
      questions: module2Questions
    };
    this.quizzes.set(2, quiz2);

    const quiz3: Quiz = {
      id: 3,
      moduleId: 3,
      questions: module3Questions
    };
    this.quizzes.set(3, quiz3);

    this.currentQuizId = 4;

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
