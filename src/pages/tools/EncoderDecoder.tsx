import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, RefreshCcw } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const EncoderDecoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encodingType, setEncodingType] = useState("url");

  const handleEncode = () => {
    if (!input) return;
    try {
      let result = "";
      switch (encodingType) {
        case "url":
          result = encodeURIComponent(input);
          break;
        case "base64":
          // Modern way to handle UTF-8 strings in btoa
          result = btoa(
            encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) =>
              String.fromCharCode(parseInt(p1, 16))
            )
          );
          break;
        case "html": {
          const textarea = document.createElement("textarea");
          textarea.textContent = input;
          result = textarea.innerHTML;
          break;
        }
      }
      setOutput(result);
    } catch (error) {
      console.error("encode error:", error);
      toast.error("Could not encode the provided text. It may be invalid.");
    }
  };
  
  const handleDecode = () => {
    if (!input) return;
    try {
      let result = "";
      switch (encodingType) {
        case "url":
          result = decodeURIComponent(input);
          break;
        case "base64":
          // Modern way to handle UTF-8 strings in atob
          result = decodeURIComponent(
            atob(input)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          break;
        case "html": {
          const textarea = document.createElement("textarea");
          textarea.innerHTML = input;
          result = textarea.value;
          break;
        }
      }
      setOutput(result);
    } catch (error) {
      console.error("decode error:", error);
      toast.error("Could not decode the provided text. It may be invalid.");
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
  
  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Encoder Decoder
          </h1>
          <p className="text-muted-foreground mt-2">
            A simple tool to encode or decode URI components.
          </p>
        </div>

        <ToggleGroup
          type="single"
          value={encodingType}
          onValueChange={(value) => {
            if (value) {
              setEncodingType(value);
              setOutput("");
            }
          }}
          variant="outline"
          className="gap-2 flex-wrap justify-center"
        >
          <ToggleGroupItem value="url" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">URL</ToggleGroupItem>
          <ToggleGroupItem value="base64" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Base64</ToggleGroupItem>
          <ToggleGroupItem value="html" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">HTML</ToggleGroupItem>
        </ToggleGroup>

        <div className="w-full space-y-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="input-text">Input</Label>
            <Textarea
              id="input-text"
              placeholder="Paste your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              className="resize-none font-mono bg-background"
            />
          </div>

          <div className="w-full flex justify-start items-center gap-2 flex-wrap">
            <Button onClick={handleEncode} disabled={!input} variant="outline">Encode</Button>
            <Button onClick={handleDecode} disabled={!input} variant="outline">Decode</Button>
            <div className="flex-grow" />
            <Button onClick={handleSwap} variant="ghost" size="icon" aria-label="Swap input and output" disabled={!input && !output}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button onClick={handleCopy} variant="ghost" size="icon" aria-label="Copy to clipboard" disabled={!output}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid w-full gap-2 relative">
            <Label htmlFor="output-text">Result</Label>
            <Textarea
              id="output-text"
              readOnly
              value={output}
              placeholder="Your result will appear here..."
              rows={6}
              className="resize-none font-mono bg-background"
            />
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground pt-4">
            <p>The tool uses UTF-8 charset.</p>
        </div>
      </div>
    </div>
  );
};

export default EncoderDecoder;
