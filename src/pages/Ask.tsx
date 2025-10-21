import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mic, Volume2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Ask = () => {
  const [problem, setProblem] = useState("");
  const [book, setBook] = useState("Bible");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Voice input is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({ title: "Listening...", description: "Speak your concern" });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setProblem(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Error",
        description: "Could not recognize speech",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSpeak = () => {
    if (!response) return;
    
    const textToSpeak = `${response.verse}\n\n${response.explanation}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    
    toast({ title: "Speaking...", description: "Playing divine guidance" });
  };

  const handleSaveFavorite = () => {
    if (!response) return;

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavorite = {
      id: Date.now(),
      book,
      problem,
      verse: response.verse,
      explanation: response.explanation,
      savedAt: new Date().toISOString(),
    };
    
    favorites.push(newFavorite);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    
    toast({
      title: "Saved!",
      description: "Added to your favorites",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problem.trim()) {
      toast({
        title: "Empty input",
        description: "Please share your concern",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const { data, error } = await supabase.functions.invoke('spiritual-guidance', {
        body: { problem, book },
      });

      if (error) throw error;

      setResponse(data);
      toast({
        title: "Divine guidance received",
        description: "Scroll down to see the wisdom",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get guidance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-card border-border">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Share your concern
              </label>
              <div className="relative">
                <Textarea
                  placeholder="Type or speak your problem..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="min-h-[120px] pr-12 resize-none border-border focus:border-primary"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className="absolute bottom-2 right-2 hover:bg-primary/10 hover:text-primary"
                >
                  <Mic className={`h-5 w-5 ${isListening ? "text-primary animate-pulse" : ""}`} />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Select sacred text
              </label>
              <Select value={book} onValueChange={setBook}>
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bible">Bible</SelectItem>
                  <SelectItem value="Quran">Quran</SelectItem>
                  <SelectItem value="Bhagavad Gita">Bhagavad Gita</SelectItem>
                  <SelectItem value="Compare All">Compare All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-smooth"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeking Divine Guidance...
                </>
              ) : (
                "Seek Guidance"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {response && (
        <Card className="shadow-divine border-primary/30 animate-slide-up">
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                ✨ Verse
              </h3>
              <blockquote className="text-foreground/90 leading-relaxed italic pl-4 border-l-4 border-primary/30 whitespace-pre-line">
                {response.verse}
              </blockquote>
            </div>

            {response.explanation && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                  💡 Explanation
                </h3>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                  {response.explanation}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSpeak}
                variant="outline"
                className="flex-1 border-border hover:border-primary hover:bg-primary/10"
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Speak
              </Button>
              <Button
                onClick={handleSaveFavorite}
                variant="outline"
                className="flex-1 border-border hover:border-primary hover:bg-primary/10"
              >
                <Heart className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ask;
