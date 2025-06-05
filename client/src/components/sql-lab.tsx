import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, Play, Save, RotateCcw, Database, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SqlLab } from "@shared/schema";

interface SqlLabProps {
  moduleId: number;
  userId: number;
  onLabComplete?: () => void;
}

interface QueryResult {
  success: boolean;
  results: any[];
  executionTime: string;
  rowCount: number;
}

export default function SqlLab({ moduleId, userId, onLabComplete }: SqlLabProps) {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lab, isLoading } = useQuery<SqlLab>({
    queryKey: ['/api/modules', moduleId, 'lab'],
    onSuccess: (data) => {
      if (data && !query) {
        setQuery(data.initialQuery);
      }
    },
  });

  const executeQueryMutation = useMutation({
    mutationFn: async (sqlQuery: string) => {
      const response = await fetch('/api/sql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery, userId, moduleId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute query');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setQueryResults(data);
      onLabComplete?.();
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'progress'] });
      
      toast({
        title: "Query Executed!",
        description: `Query completed in ${data.executionTime}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to execute query. Please check your syntax.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-48 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lab) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No SQL lab available for this module.</p>
        </CardContent>
      </Card>
    );
  }

  const handleRunQuery = () => {
    if (query.trim()) {
      executeQueryMutation.mutate(query);
    }
  };

  const handleReset = () => {
    setQuery(lab.initialQuery);
    setQueryResults(null);
  };

  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) {
      return <p className="text-gray-500 p-4">No results found.</p>;
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card className="mb-8 overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gray-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Terminal className="w-5 h-5 text-cyan-400 mr-3" />
            <h2 className="font-semibold">SQL Lab Environment</h2>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRunQuery}
              disabled={executeQueryMutation.isPending}
              className="text-gray-300 hover:text-white"
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-300 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="flex h-96">
        {/* Code Editor */}
        <div className="w-1/2 border-r border-gray-200">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Query Editor</span>
          </div>
          <div className="p-4 h-full">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-full font-mono text-sm border-none resize-none focus:outline-none bg-gray-900 text-gray-100 p-4 rounded"
              placeholder="Write your SQL query here..."
            />
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600 flex items-center">
                <Database className="w-4 h-4 mr-1" />
                Connected to: healthcare_analytics_db
              </div>
              <Button
                onClick={handleRunQuery}
                disabled={executeQueryMutation.isPending || !query.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {executeQueryMutation.isPending ? "Running..." : "Run Query"}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="w-1/2">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Query Results</span>
          </div>
          <div className="p-4 h-full overflow-auto">
            {queryResults ? (
              <>
                <div className="border rounded-lg overflow-hidden mb-4">
                  {renderTable(queryResults.results)}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {queryResults.rowCount} rows returned • Query executed in {queryResults.executionTime}
                  </span>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4 mr-1" />
                    Export Results
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Terminal className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Run a query to see results here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t bg-blue-50 p-4">
        <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
        <p className="text-sm text-gray-700">{lab.instructions}</p>
      </div>
    </Card>
  );
}
