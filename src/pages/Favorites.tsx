import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Favorite {
  id: number;
  book: string;
  problem: string;
  verse: string;
  explanation: string;
  savedAt: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored.reverse());
  };

  const handleDelete = (id: number) => {
    const updated = favorites.filter((fav) => fav.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated.reverse()));
    setFavorites(updated);
    toast({
      title: "Removed",
      description: "Favorite has been deleted",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h2 className="text-2xl font-bold mb-2 text-foreground">No favorites yet</h2>
        <p className="text-muted-foreground">
          Save meaningful verses from the Ask section
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          Your Favorites
        </h2>
        <p className="text-muted-foreground mt-1">
          {favorites.length} saved {favorites.length === 1 ? "verse" : "verses"}
        </p>
      </div>

      {favorites.map((favorite, index) => (
        <Card
          key={favorite.id}
          className="shadow-card border-border hover:shadow-divine transition-smooth animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    {favorite.book}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(favorite.savedAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "{favorite.problem}"
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(favorite.id)}
                className="hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 text-foreground">Verse:</h4>
              <blockquote className="text-sm text-foreground/90 italic pl-3 border-l-2 border-primary/30">
                {favorite.verse}
              </blockquote>
            </div>

            {favorite.explanation && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">Explanation:</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {favorite.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Favorites;
