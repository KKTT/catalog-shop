import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { useToast } from "@/hooks/use-toast";
import { Save, Edit, RefreshCw, Upload, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export function AdminHome() {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { 
    heroContent, 
    companyContent, 
    features,
    categories,
    loading, 
    updateHeroContent, 
    updateCompanyContent,
    refreshContent 
  } = useWebsiteContent();
  const { toast } = useToast();

  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    description: '',
    primary_button_text: 'Shop Now',
    secondary_button_text: 'View Catalog',
    hero_image_url: ''
  });

  const [companyData, setCompanyData] = useState({
    mission_title: 'Our Mission',
    mission_description: '',
    years_experience: 15,
    happy_customers: 50000,
    products_available: 100,
    company_story: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (heroContent) {
      setHeroData({
        title: heroContent.title || '',
        subtitle: heroContent.subtitle || '',
        description: heroContent.description || '',
        primary_button_text: heroContent.primary_button_text || 'Shop Now',
        secondary_button_text: heroContent.secondary_button_text || 'View Catalog',
        hero_image_url: heroContent.hero_image_url || ''
      });
    }
  }, [heroContent]);

  useEffect(() => {
    if (companyContent) {
      setCompanyData({
        mission_title: companyContent.mission_title || 'Our Mission',
        mission_description: companyContent.mission_description || '',
        years_experience: companyContent.years_experience || 15,
        happy_customers: companyContent.happy_customers || 50000,
        products_available: companyContent.products_available || 100,
        company_story: companyContent.company_story || ''
      });
    }
  }, [companyContent]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('image')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('image')
        .getPublicUrl(filePath);

      setHeroData(prev => ({ ...prev, hero_image_url: data.publicUrl }));
      
      toast({
        title: "Success",
        description: "Hero image uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const heroSuccess = await updateHeroContent(heroData);
      const companySuccess = await updateCompanyContent(companyData);

      if (heroSuccess && companySuccess) {
        toast({
          title: "Success",
          description: "Homepage content updated successfully!",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update some content. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Homepage Management</h1>
            <p className="text-muted-foreground">Manage your website's homepage content</p>
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homepage Management</h1>
          <p className="text-muted-foreground">Manage your website's homepage content</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshContent}
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {isEditing ? (
            <Button 
              onClick={handleSave}
              disabled={saving}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main banner content that visitors see first</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={heroData.title}
                onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter hero title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={heroData.subtitle}
                onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter hero subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={heroData.description}
                onChange={(e) => setHeroData(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter hero description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-image">Hero Image</Label>
              <div className="space-y-4">
                {heroData.hero_image_url && (
                  <div className="relative">
                    <img 
                      src={heroData.hero_image_url} 
                      alt="Hero preview" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setHeroData(prev => ({ ...prev, hero_image_url: '' }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
                
                {isEditing && (
                  <div className="flex items-center gap-4">
                    <Input
                      id="hero-image-url"
                      value={heroData.hero_image_url}
                      onChange={(e) => setHeroData(prev => ({ ...prev, hero_image_url: e.target.value }))}
                      placeholder="Enter image URL or upload below"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                        id="hero-image-upload"
                        disabled={uploadingImage}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingImage}
                        onClick={() => document.getElementById('hero-image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImage ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                )}
                
                {!isEditing && !heroData.hero_image_url && (
                  <p className="text-sm text-muted-foreground">No hero image set</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-button">Primary Button Text</Label>
                <Input
                  id="primary-button"
                  value={heroData.primary_button_text}
                  onChange={(e) => setHeroData(prev => ({ ...prev, primary_button_text: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Shop Now"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary-button">Secondary Button Text</Label>
                <Input
                  id="secondary-button"
                  value={heroData.secondary_button_text}
                  onChange={(e) => setHeroData(prev => ({ ...prev, secondary_button_text: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="View Catalog"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Mission statement and company statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mission-title">Mission Section Title</Label>
              <Input
                id="mission-title"
                value={companyData.mission_title}
                onChange={(e) => setCompanyData(prev => ({ ...prev, mission_title: e.target.value }))}
                disabled={!isEditing}
                placeholder="Our Mission"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission-description">Mission Description</Label>
              <Textarea
                id="mission-description"
                value={companyData.mission_description}
                onChange={(e) => setCompanyData(prev => ({ ...prev, mission_description: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your company mission statement"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years-experience">Years of Experience</Label>
                <Input
                  id="years-experience"
                  type="number"
                  value={companyData.years_experience}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                  disabled={!isEditing}
                  placeholder="15"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="happy-customers">Happy Customers</Label>
                <Input
                  id="happy-customers"
                  type="number"
                  value={companyData.happy_customers}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, happy_customers: parseInt(e.target.value) || 0 }))}
                  disabled={!isEditing}
                  placeholder="50000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="products-available">Products Available</Label>
                <Input
                  id="products-available"
                  type="number"
                  value={companyData.products_available}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, products_available: parseInt(e.target.value) || 0 }))}
                  disabled={!isEditing}
                  placeholder="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Summary */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Features Section</CardTitle>
              <CardDescription>{features.length} features configured</CardDescription>
            </CardHeader>
            <CardContent>
              {features.length > 0 ? (
                <ul className="space-y-2">
                  {features.slice(0, 3).map((feature) => (
                    <li key={feature.id} className="text-sm text-muted-foreground">
                      • {feature.title}
                    </li>
                  ))}
                  {features.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      • And {features.length - 3} more...
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No features configured</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories Section</CardTitle>
              <CardDescription>{categories.length} categories configured</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <ul className="space-y-2">
                  {categories.slice(0, 3).map((category) => (
                    <li key={category.id} className="text-sm text-muted-foreground">
                      • {category.name}
                    </li>
                  ))}
                  {categories.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      • And {categories.length - 3} more...
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No categories configured</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}