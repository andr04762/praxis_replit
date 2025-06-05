import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Quiz, QuizQuestion } from "@shared/schema";

interface QuizSectionProps {
  moduleId: number;
  userId: number;
  onQuizComplete?: (score: number) => void;
}

interface QuizResult {
  questionId: number;
  correct: boolean;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}

export default function QuizSection({ moduleId, userId, onQuizComplete }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{ score: number; results: QuizResult[] } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ['/api/modules', moduleId, 'quiz'],
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answerArray: number[]) => {
      const response = await fetch(`/api/modules/${moduleId}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers: answerArray }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setQuizResults(data);
      setShowResults(true);
      onQuizComplete?.(data.score);
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'progress'] });
      
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${data.score}% on this quiz.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No quiz available for this module.</p>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!quiz?.questions) return;
    const answerArray = quiz.questions.map((_, index) => answers[index] ?? -1);
    submitQuizMutation.mutate(answerArray);
  };

  const progress = quiz?.questions?.length ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;
  const question = quiz?.questions?.[currentQuestion];
  const isLastQuestion = quiz?.questions ? currentQuestion === quiz.questions.length - 1 : false;
  const hasAnswered = answers[currentQuestion] !== undefined;
  const allQuestionsAnswered = quiz?.questions?.every((_, index) => answers[index] !== undefined) ?? false;

  if (showResults && quizResults) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quiz Results</span>
            <Badge variant={quizResults.score >= 70 ? "default" : "destructive"}>
              {quizResults.score}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {quizResults.score >= 70 ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-2" />
              )}
              {quizResults.score}%
            </div>
            <p className="text-gray-600">
              {quizResults.score >= 70 ? "Great job! You passed the quiz." : "Keep studying and try again."}
            </p>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((q, index) => {
              const result = quizResults.results[index];
              return (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    {result.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{q.question}</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Your answer:</span> {q.options[result.userAnswer]}
                    </p>
                    {!result.correct && (
                      <p className="text-green-600">
                        <span className="font-medium">Correct answer:</span> {q.options[result.correctAnswer]}
                      </p>
                    )}
                    <p className="text-gray-600 italic">{result.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Knowledge Check</CardTitle>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{quiz?.questions?.length || 0} questions • 10 minutes</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {quiz?.questions?.length || 0}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question */}
        {question && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
            
            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || submitQuizMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
