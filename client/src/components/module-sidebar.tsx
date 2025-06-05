import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Play, FileQuestion, Code, MessageCircle, ChevronRight } from "lucide-react";
import type { Module, UserProgress } from "@shared/schema";

interface ModuleSidebarProps {
  userId: number;
  currentModuleId?: number;
  onModuleSelect: (moduleId: number) => void;
  onOpenAIAssistant: () => void;
}

export default function ModuleSidebar({ 
  userId, 
  currentModuleId, 
  onModuleSelect, 
  onOpenAIAssistant 
}: ModuleSidebarProps) {
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ['/api/users', userId, 'progress'],
  });

  const getModuleProgress = (moduleId: number) => {
    return userProgress.find(p => p.moduleId === moduleId);
  };

  const calculateOverallProgress = () => {
    const completedModules = userProgress.filter(p => p.completed).length;
    return Math.round((completedModules / modules.length) * 100);
  };

  const getModuleIcon = (module: Module, progress: UserProgress | undefined) => {
    if (progress?.completed) {
      return <CheckCircle className="w-4 h-4 text-white" />;
    }
    if (module.isLocked) {
      return <Lock className="w-4 h-4" />;
    }
    return <span className="text-sm font-medium">{module.orderIndex}</span>;
  };

  const getModuleIconBg = (module: Module, progress: UserProgress | undefined) => {
    if (progress?.completed) return "bg-green-500";
    if (module.isLocked) return "bg-gray-300";
    return "bg-gray-300";
  };

  return (
    <div className="w-80 bg-white shadow-lg overflow-y-auto">
      <div className="p-6">
        {/* Course Progress */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Course Progress</h2>
          <Progress value={calculateOverallProgress()} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            {userProgress.filter(p => p.completed).length} of {modules.length} modules completed
          </p>
        </div>

        {/* Module Navigation */}
        <nav className="space-y-3">
          {modules.map((module) => {
            const progress = getModuleProgress(module.id);
            const isSelected = currentModuleId === module.id;
            const canAccess = !module.isLocked || progress?.completed;

            return (
              <Card 
                key={module.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                } ${!canAccess ? 'opacity-75' : ''}`}
                onClick={() => canAccess && onModuleSelect(module.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getModuleIconBg(module, progress)} ${
                      progress?.completed ? 'text-white' : 'text-gray-600'
                    }`}>
                      {getModuleIcon(module, progress)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Module {module.orderIndex}</h3>
                      <p className="text-sm text-gray-600">{module.title}</p>
                    </div>
                  </div>
                  {canAccess ? (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                
                <div className="mt-3 flex items-center text-xs text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Play className="w-3 h-3 mr-1" />
                    <span>Video • {module.videoDuration}</span>
                  </div>
                  {progress?.quizScore !== null && (
                    <div className="flex items-center">
                      <FileQuestion className="w-3 h-3 mr-1" />
                      <span>Quiz • {progress.quizScore}%</span>
                    </div>
                  )}
                  {progress?.labCompleted && (
                    <div className="flex items-center">
                      <Code className="w-3 h-3 mr-1" />
                      <span>Lab Complete</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </nav>

        {/* AI Assistant */}
        <Card className="mt-8 p-4 bg-cyan-50 border-cyan-200">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-2">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-medium text-gray-900">AI Study Assistant</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Get help with course concepts and SQL queries
          </p>
          <Button 
            onClick={onOpenAIAssistant}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Chat
          </Button>
        </Card>
      </div>
    </div>
  );
}
