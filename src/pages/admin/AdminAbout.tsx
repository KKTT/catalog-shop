import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info, Edit, Save, Users } from "lucide-react";

export function AdminAbout() {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutData, setAboutData] = useState({
    title: "About Our Company",
    subtitle: "Building the future of e-commerce",
    mission: "Our mission is to provide exceptional products and unparalleled customer service.",
    vision: "To be the leading online marketplace trusted by millions worldwide.",
    story: "Founded in 2020, we started with a simple idea: make online shopping better for everyone.",
    values: "Quality, Innovation, Customer Focus, Integrity",
    teamSize: "50+",
    yearsExperience: "4",
    customersServed: "10,000+"
  });

  const handleSave = () => {
    // Here you would save to your backend
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Page Management</h1>
          <p className="text-muted-foreground">Manage your company's story and information</p>
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
              <Info className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Main company details and messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={aboutData.title}
                onChange={(e) => setAboutData({...aboutData, title: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={aboutData.subtitle}
                onChange={(e) => setAboutData({...aboutData, subtitle: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea
                id="mission"
                value={aboutData.mission}
                onChange={(e) => setAboutData({...aboutData, mission: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="vision">Vision Statement</Label>
              <Textarea
                id="vision"
                value={aboutData.vision}
                onChange={(e) => setAboutData({...aboutData, vision: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Company Story & Stats
            </CardTitle>
            <CardDescription>Tell your company's story and showcase achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="story">Company Story</Label>
              <Textarea
                id="story"
                value={aboutData.story}
                onChange={(e) => setAboutData({...aboutData, story: e.target.value})}
                disabled={!isEditing}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="values">Core Values</Label>
              <Input
                id="values"
                value={aboutData.values}
                onChange={(e) => setAboutData({...aboutData, values: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="team-size">Team Size</Label>
                <Input
                  id="team-size"
                  value={aboutData.teamSize}
                  onChange={(e) => setAboutData({...aboutData, teamSize: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="years">Years Experience</Label>
                <Input
                  id="years"
                  value={aboutData.yearsExperience}
                  onChange={(e) => setAboutData({...aboutData, yearsExperience: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="customers">Customers Served</Label>
                <Input
                  id="customers"
                  value={aboutData.customersServed}
                  onChange={(e) => setAboutData({...aboutData, customersServed: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}