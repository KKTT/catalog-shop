import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Home, Edit, Save } from "lucide-react";

export function AdminHome() {
  const [isEditing, setIsEditing] = useState(false);
  const [homeData, setHomeData] = useState({
    heroTitle: "Welcome to Our Store",
    heroSubtitle: "Discover amazing products at great prices",
    heroDescription: "Browse our curated collection of high-quality items",
    featuredSection: "Featured Products",
    aboutSnippet: "We are committed to providing exceptional products and service"
  });

  const handleSave = () => {
    // Here you would save to your backend
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home Page Management</h1>
          <p className="text-muted-foreground">Manage your homepage content and layout</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {isEditing ? "Save Changes" : "Edit Content"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Hero Section
            </CardTitle>
            <CardDescription>Main banner content visible on homepage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Hero Title</Label>
              <Input
                id="hero-title"
                value={homeData.heroTitle}
                onChange={(e) => setHomeData({...homeData, heroTitle: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={homeData.heroSubtitle}
                onChange={(e) => setHomeData({...homeData, heroSubtitle: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="hero-description">Hero Description</Label>
              <Textarea
                id="hero-description"
                value={homeData.heroDescription}
                onChange={(e) => setHomeData({...homeData, heroDescription: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Section</CardTitle>
            <CardDescription>Configure featured products and promotional content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="featured-title">Section Title</Label>
              <Input
                id="featured-title"
                value={homeData.featuredSection}
                onChange={(e) => setHomeData({...homeData, featuredSection: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="about-snippet">About Snippet</Label>
              <Textarea
                id="about-snippet"
                value={homeData.aboutSnippet}
                onChange={(e) => setHomeData({...homeData, aboutSnippet: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}