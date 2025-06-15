
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Binary, Mic, HeartPulse } from "lucide-react";

const tools = [
  {
    title: "Encoder/Decoder",
    description: "Encode and decode strings using various algorithms.",
    href: "/tools/encoder-decoder",
    icon: <Binary className="h-8 w-8 text-primary" />,
  },
  {
    title: "Karaoke Finder",
    description: "Find karaoke versions of songs on YouTube.",
    href: "/tools/karaoke-finder",
    icon: <Mic className="h-8 w-8 text-primary" />,
  },
  {
    title: "Blood Pressure Monitor",
    description: "Track your blood pressure readings over time.",
    href: "/tools/blood-pressure-monitor",
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
  },
];

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-16">
        <h1 className="text-8xl font-bold tracking-tighter">Handy Tools</h1>
        <p className="text-muted-foreground mt-4 text-xl">
          A collection of simple tools to help you with various tasks.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {tools.map((tool) => (
          <Link to={tool.href} key={tool.title} className="block group w-11/12 md:w-full">
            <Card className="h-full border-2 border-transparent group-hover:border-primary transition-all duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {tool.icon}
                <CardTitle>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Index;
