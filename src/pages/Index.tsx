
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowDown, Copy } from "lucide-react";

const Index = () => {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleProcess = () => {
    if (!input) return;
    try {
      const result =
        mode === "encode"
          ? encodeURIComponent(input)
          : decodeURIComponent(input);
      setOutput(result);
    } catch (error) {
      console.error(`${mode} error:`, error);
      toast.error(`Could not ${mode} the provided text. It may be invalid.`);
    }
  };

  const handleCopy = () => {
    if (!output) {
      toast.warning("Nothing to copy.");
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

  const handleModeChange = (newMode: "encode" | "decode") => {
    if (newMode && newMode !== mode) {
      setMode(newMode);
      setInput(output);
      setOutput("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            URL Encoder / Decoder
          </h1>
          <p className="text-muted-foreground mt-2">
            A simple tool to encode or decode URI components.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => handleModeChange("encode")}
            className={`text-lg transition-all rounded-md px-4 py-1 ${
              mode === "encode"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Encode
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleModeChange("decode")}
            className={`text-lg transition-all rounded-md px-4 py-1 ${
              mode === "decode"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Decode
          </Button>
        </div>

        <div className="w-full space-y-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="input-text" className="capitalize">
              {mode} Input
            </Label>
            <Textarea
              id="input-text"
              placeholder={`Paste your text to ${mode} here...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              className="resize-none font-mono bg-transparent border-border/50 focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-center">
            <Button
              onClick={handleProcess}
              disabled={!input}
              variant="outline"
              size="lg"
              className="w-full max-w-xs border-2 border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              {mode === "encode" ? "Encode" : "Decode"} Text
            </Button>
          </div>

          <div className="grid w-full gap-2 relative">
            <Label htmlFor="output-text">Result</Label>
            <Textarea
              id="output-text"
              readOnly
              value={output}
              placeholder="Your result will appear here..."
              rows={8}
              className="resize-none font-mono pr-12 bg-transparent border-border/50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-9 right-2 h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={handleCopy}
              disabled={!output}
              aria-label="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground pt-8">
            <p>Powered by native browser APIs</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
