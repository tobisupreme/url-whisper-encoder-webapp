
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, Loader2 } from "lucide-react";

// Define a type for the video item
interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

const KaraokeFinder = () => {
  const [songName, setSongName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("youtube_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("youtube_api_key", newApiKey);
  };

  const handleSearch = async () => {
    if (!songName.trim()) {
      return;
    }
    if (!apiKey.trim()) {
      setError("Please enter your YouTube API Key to search.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideos([]);

    const searchQuery = `${songName} karaoke`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      searchQuery
    )}&key=${apiKey}&type=video&maxResults=12`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error("YouTube API Error:", data.error);
        setError(data.error.message || "An error occurred. Check your API key and quota.");
      } else {
        setVideos(data.items);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch videos. Check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-5xl flex flex-col items-center gap-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Karaoke Finder
          </h1>
          <p className="text-muted-foreground mt-2">
            Find the karaoke version of any song on YouTube.
          </p>
        </div>

        <div className="w-full max-w-lg space-y-4">
           <div className="grid w-full gap-2">
            <Label htmlFor="api-key">YouTube API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your YouTube API Key"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="font-mono bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Get your key from the{" "}
              <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline">
                Google Cloud Console
              </a>. Your key is saved in your browser.
            </p>
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor="song-name">Song Name</Label>
            <Input
              id="song-name"
              type="text"
              placeholder="Enter a song name..."
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-mono bg-background"
            />
          </div>

          <div className="w-full flex justify-center">
            <Button onClick={handleSearch} disabled={!songName.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Youtube className="mr-2 h-4 w-4" />
              )}
              Search on YouTube
            </Button>
          </div>
        </div>
        
        {error && <p className="text-destructive mt-4 text-center">{error}</p>}

        {videos.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {videos.map((video) => (
              <a
                key={video.id.videoId}
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="h-full overflow-hidden transition-all group-hover:border-primary">
                  <CardContent className="p-0">
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="w-full aspect-video object-cover"
                    />
                  </CardContent>
                  <CardHeader>
                    <CardTitle className="text-base font-medium line-clamp-2 group-hover:text-primary">
                      {video.snippet.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KaraokeFinder;
