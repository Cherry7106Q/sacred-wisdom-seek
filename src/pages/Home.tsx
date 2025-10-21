import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Home = () => {
  const [quote, setQuote] = useState("");

  const quotes = [
    { text: "Be still and know that I am God.", source: "Psalm 46:10" },
    { text: "Indeed, with hardship comes ease.", source: "Quran 94:6" },
    { text: "You have the right to work, but never to the fruit of work.", source: "Bhagavad Gita 2.47" },
    { text: "The Lord is my shepherd; I shall not want.", source: "Psalm 23:1" },
    { text: "And He found you lost and guided you.", source: "Quran 93:7" },
    { text: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.", source: "Bhagavad Gita 6.19" },
    { text: "Trust in the Lord with all your heart.", source: "Proverbs 3:5" },
    { text: "So verily, with every difficulty, there is relief.", source: "Quran 94:5" },
    { text: "The soul is neither born, and nor does it die.", source: "Bhagavad Gita 2.20" },
  ];

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(`${randomQuote.text}\n\n— ${randomQuote.source}`);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <Card className="shadow-divine border-primary/20 animate-slide-up">
        <CardContent className="pt-8 pb-8 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-glow" />
          <h2 className="text-2xl font-bold mb-3 text-foreground">
            Welcome to Divine Answers
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Find spiritual guidance and wisdom from sacred texts. Share your concerns and discover timeless teachings that illuminate your path.
          </p>
        </CardContent>
      </Card>

      {/* Daily Quote */}
      <Card className="shadow-card border-border animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-foreground">Daily Divine Quote</h3>
          </div>
          <blockquote className="text-foreground/90 text-base leading-relaxed italic pl-4 border-l-4 border-primary/30 whitespace-pre-line">
            {quote}
          </blockquote>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="shadow-card border-border animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardContent className="pt-6 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">How It Works</h3>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">1.</span>
              <span>Navigate to the <strong className="text-foreground">Ask</strong> section</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">2.</span>
              <span>Share your problem or question</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">3.</span>
              <span>Choose a sacred text or compare all</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">4.</span>
              <span>Receive divine wisdom and guidance</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">5.</span>
              <span>Save meaningful verses to favorites</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
