import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, LogOut, User } from "lucide-react";
import ModuleSidebar from "@/components/module-sidebar";
import VideoPlayer from "@/components/video-player";
import QuizSection from "@/components/quiz-section";
import SqlLab from "@/components/sql-lab";
import AIAssistant from "@/components/ai-assistant";
import type { Module, User as UserType } from "@shared/schema";

export default function CoursePage() {
  const [currentModuleId, setCurrentModuleId] = useState(1);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const userId = 1; // Mock user ID

  const { data: currentModule } = useQuery<Module>({
    queryKey: [`/api/modules/${currentModuleId}`],
  });
  


  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const { data: user } = useQuery<UserType>({
    queryKey: ['/api/auth/user'],
  });

  const currentModuleIndex = modules.findIndex(m => m.id === currentModuleId);
  const totalModules = modules.length;
  const canGoNext = currentModuleIndex < totalModules - 1;
  const canGoPrevious = currentModuleIndex > 0;

  const handleModuleSelect = (moduleId: number) => {
    setCurrentModuleId(moduleId);
  };

  const handleNextModule = () => {
    if (canGoNext) {
      setCurrentModuleId(modules[currentModuleIndex + 1].id);
    }
  };

  const handlePreviousModule = () => {
    if (canGoPrevious) {
      setCurrentModuleId(modules[currentModuleIndex - 1].id);
    }
  };

  const learningObjectives = [
    "Why SQL is still the analyst's \"Swiss-army knife\" for direct, stable access to enterprise data",
    "BigQuery essentials—serverless scale, real-time speed, and zero-ops management",
    "How this applies to hospital and payer analysis, informatics teams, data stewards, and enterprise-grade analytics"
  ];

  if (!currentModule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-gray-900">The Praxis Institute</h1>
              </div>
              <div className="hidden md:block ml-8">
                <div className="flex items-baseline space-x-4">
                  <span className="text-sm text-gray-600">
                    Advanced Analytics in Healthcare SQL & BigQuery
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name || "Student Name"}</span>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <ModuleSidebar
          userId={userId}
          currentModuleId={currentModuleId}
          onModuleSelect={handleModuleSelect}
          onOpenAIAssistant={() => setAiAssistantOpen(true)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Module Header */}
            <div className="mb-8">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>Module {currentModule.orderIndex}</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span>Introduction</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentModule.title}
              </h1>
              <p className="text-lg text-gray-600">
                {currentModule.description}
              </p>
            </div>

            {/* Video Player */}
            <VideoPlayer
              videoUrl={currentModule.videoUrl}
              title={currentModule.title}
              duration={currentModule.videoDuration}
              description={currentModule.description}
              learningObjectives={learningObjectives}
            />

            {/* Quiz Section */}
            <QuizSection
              moduleId={currentModuleId}
              userId={userId}
            />

            {/* SQL Lab */}
            <SqlLab
              moduleId={currentModuleId}
              userId={userId}
            />

            {/* Module Navigation */}
            <Card className="flex justify-between items-center p-6">
              <Button
                variant="outline"
                onClick={handlePreviousModule}
                disabled={!canGoPrevious}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Module
              </Button>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {modules.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentModuleIndex ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  Module {currentModuleIndex + 1} of {totalModules}
                </span>
              </div>

              <Button
                onClick={handleNextModule}
                disabled={!canGoNext}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <span>Complete & Continue</span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant
        open={aiAssistantOpen}
        onOpenChange={setAiAssistantOpen}
        context={`Module ${currentModule.orderIndex}: ${currentModule.title}`}
      />
    </div>
  );
}
