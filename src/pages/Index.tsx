
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowDown, Copy } from "lucide-react";

const Index = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch (error) {
      console.error("Encoding error:", error);
      toast.error("Could not encode the provided text.");
    }
  };

  const handleCopy = () => {
    if (!output) {
      toast.warning("Nothing to copy. Please encode some text first.");
      return;
    }
    navigator.clipboard.writeText(output).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy to clipboard.");
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            URL Encoder
          </CardTitle>
          <CardDescription>
            Paste your text below to get a URL-safe encoded version.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="input-text">Text to Encode</Label>
            <Textarea
              id="input-text"
              placeholder="Type or paste your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <div className="flex items-center justify-center">
            <Button onClick={handleEncode} disabled={!input}>
              <ArrowDown className="mr-2 h-4 w-4" />
              Encode
            </Button>
          </div>
          <div className="grid w-full gap-2 relative">
            <Label htmlFor="output-text">Encoded URL</Label>
            <Textarea
              id="output-text"
              readOnly
              value={output}
              placeholder="Your encoded URL will appear here..."
              rows={6}
              className="resize-none pr-12"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-8 right-2 h-8 w-8"
              onClick={handleCopy}
              disabled={!output}
              aria-label="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
            <p>Powered by `encodeURIComponent`</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
