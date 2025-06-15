
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Youtube } from "lucide-react";

const KaraokeFinder = () => {
  const [songName, setSongName] = useState("");

  const handleSearch = () => {
    if (!songName.trim()) {
      return;
    }
    const searchQuery = `${songName} karaoke`;
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      searchQuery
    )}`;
    window.open(youtubeSearchUrl, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Karaoke Finder
          </h1>
          <p className="text-muted-foreground mt-2">
            Find the karaoke version of any song on YouTube.
          </p>
        </div>

        <div className="w-full space-y-4">
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
            <Button onClick={handleSearch} disabled={!songName.trim()}>
              <Youtube className="mr-2 h-4 w-4" />
              Search on YouTube
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaraokeFinder;
