import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info, Edit, Save, Users, Loader2, Upload, X } from "lucide-react";
import { useAboutContent } from "@/hooks/useAboutContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminAbout() {
  const { aboutContent, loading, updateContent } = useAboutContent();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    page_title: "",
    page_subtitle: "",
    mission_title: "",
    mission_description: "",
    vision_title: "",
    vision_description: "",
    company_story: "",
    story_image_url: "",
    core_values: "",
    team_size: "",
    years_experience: "",
    happy_customers: "",
  });

  useEffect(() => {
    if (aboutContent) {
      setFormData({
        page_title: aboutContent.page_title || "",
        page_subtitle: aboutContent.page_subtitle || "",
        mission_title: aboutContent.mission_title || "",
        mission_description: aboutContent.mission_description || "",
        vision_title: aboutContent.vision_title || "",
        vision_description: aboutContent.vision_description || "",
        company_story: aboutContent.company_story || "",
        story_image_url: aboutContent.story_image_url || "",
        core_values: aboutContent.core_values?.join(", ") || "",
        team_size: aboutContent.team_size?.toString() || "",
        years_experience: aboutContent.years_experience?.toString() || "",
        happy_customers: aboutContent.happy_customers?.toString() || "",
      });
    }
  }, [aboutContent]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `story-${Date.now()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("image")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("image")
        .getPublicUrl(filePath);

      setFormData({ ...formData, story_image_url: publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, story_image_url: "" });
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateContent({
      page_title: formData.page_title || null,
      page_subtitle: formData.page_subtitle || null,
      mission_title: formData.mission_title || null,
      mission_description: formData.mission_description || null,
      vision_title: formData.vision_title || null,
      vision_description: formData.vision_description || null,
      company_story: formData.company_story || null,
      story_image_url: formData.story_image_url || null,
      core_values: formData.core_values ? formData.core_values.split(",").map((v) => v.trim()) : null,
      team_size: formData.team_size ? parseInt(formData.team_size) : null,
      years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
      happy_customers: formData.happy_customers ? parseInt(formData.happy_customers) : null,
    });
    setSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Page Management</h1>
          <p className="text-muted-foreground">Manage your company's story and information</p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          variant={isEditing ? "default" : "outline"}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : isEditing ? (
            <Save className="h-4 w-4 mr-2" />
          ) : (
            <Edit className="h-4 w-4 mr-2" />
          )}
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Content"}
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
              <Label htmlFor="page_title">Page Title</Label>
              <Input
                id="page_title"
                value={formData.page_title}
                onChange={(e) => setFormData({ ...formData, page_title: e.target.value })}
                disabled={!isEditing}
                placeholder="About Our Company"
              />
            </div>
            <div>
              <Label htmlFor="page_subtitle">Page Subtitle</Label>
              <Textarea
                id="page_subtitle"
                value={formData.page_subtitle}
                onChange={(e) => setFormData({ ...formData, page_subtitle: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter a subtitle for the about page"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mission_title">Mission Title</Label>
                <Input
                  id="mission_title"
                  value={formData.mission_title}
                  onChange={(e) => setFormData({ ...formData, mission_title: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Our Mission"
                />
              </div>
              <div>
                <Label htmlFor="vision_title">Vision Title</Label>
                <Input
                  id="vision_title"
                  value={formData.vision_title}
                  onChange={(e) => setFormData({ ...formData, vision_title: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Our Vision"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="mission_description">Mission Statement</Label>
              <Textarea
                id="mission_description"
                value={formData.mission_description}
                onChange={(e) => setFormData({ ...formData, mission_description: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your company's mission statement"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="vision_description">Vision Statement</Label>
              <Textarea
                id="vision_description"
                value={formData.vision_description}
                onChange={(e) => setFormData({ ...formData, vision_description: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your company's vision statement"
                rows={3}
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
              <Label htmlFor="company_story">Company Story</Label>
              <Textarea
                id="company_story"
                value={formData.company_story}
                onChange={(e) => setFormData({ ...formData, company_story: e.target.value })}
                disabled={!isEditing}
                rows={5}
                placeholder="Tell your company's story..."
              />
            </div>
            <div>
              <Label>Story Image</Label>
              <div className="mt-2 space-y-3">
                {formData.story_image_url ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.story_image_url}
                      alt="Story"
                      className="h-40 w-auto rounded-lg object-cover border"
                    />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="h-40 w-60 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No image</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!isEditing || uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {uploading ? "Uploading..." : "Choose File"}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="core_values">Core Values (comma-separated)</Label>
              <Input
                id="core_values"
                value={formData.core_values}
                onChange={(e) => setFormData({ ...formData, core_values: e.target.value })}
                disabled={!isEditing}
                placeholder="Quality, Innovation, Customer Focus, Integrity"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="team_size">Team Size</Label>
                <Input
                  id="team_size"
                  type="number"
                  value={formData.team_size}
                  onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                  disabled={!isEditing}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="years_experience">Years Experience</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                  disabled={!isEditing}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="happy_customers">Happy Customers</Label>
                <Input
                  id="happy_customers"
                  type="number"
                  value={formData.happy_customers}
                  onChange={(e) => setFormData({ ...formData, happy_customers: e.target.value })}
                  disabled={!isEditing}
                  placeholder="50000"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
