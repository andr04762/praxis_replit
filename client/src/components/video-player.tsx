import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Eye, ThumbsUp, Bookmark, CheckCircle } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  duration: string;
  description: string;
  learningObjectives: string[];
  onVideoComplete?: () => void;
}

export default function VideoPlayer({ 
  videoUrl, 
  title, 
  duration, 
  description, 
  learningObjectives,
  onVideoComplete 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);

  const extractVideoId = (url: string) => {
    if (!url) return null;
    
    // Handle youtube.com/watch?v= format
    let match = url.match(/(?:youtube\.com\/watch\?v=)([^&\n?#]+)/);
    if (match) {
      return match[1];
    }
    
    // Handle youtu.be/ format
    match = url.match(/(?:youtu\.be\/)([^&\n?#]+)/);
    if (match) {
      return match[1];
    }
    
    return null;
  };

  const videoId = extractVideoId(videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1` : '';

  const handlePlay = () => {
    setIsPlaying(true);
    setHasWatched(true);
    onVideoComplete?.();
  };

  return (
    <Card className="mb-8 overflow-hidden shadow-lg">
      {/* Video Player Area */}
      <div className="aspect-video bg-black relative">
        {!isPlaying && videoId ? (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={handlePlay}>
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10 text-center">
              <Button
                size="lg"
                className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 mb-4"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </Button>
              <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
              <p className="text-gray-300 text-sm">Duration: {duration}</p>
            </div>
          </div>
        ) : isPlaying && embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <p>Video not available</p>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What you'll learn</h3>
            <ul className="space-y-2 text-gray-700">
              {learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="ml-6 text-right">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Eye className="w-4 h-4 mr-1" />
              <span>1,247 views</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <Bookmark className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
