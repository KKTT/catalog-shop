import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AboutContent {
  id: string;
  page_title: string | null;
  page_subtitle: string | null;
  mission_title: string | null;
  mission_description: string | null;
  vision_title: string | null;
  vision_description: string | null;
  company_story: string | null;
  story_image_url: string | null;
  core_values: string[] | null;
  team_size: number | null;
  years_experience: number | null;
  happy_customers: number | null;
  is_active: boolean | null;
}

export function useAboutContent() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("company_content")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setAboutContent(data);
    } catch (error) {
      console.error("Error loading about content:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (data: Partial<AboutContent>) => {
    try {
      if (!aboutContent?.id) {
        // Create new record if none exists
        const { error } = await supabase.from("company_content").insert({
          ...data,
          is_active: true,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("company_content")
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq("id", aboutContent.id);
        if (error) throw error;
      }

      toast.success("About content updated successfully");
      await loadContent();
      return true;
    } catch (error) {
      console.error("Error updating about content:", error);
      toast.error("Failed to update about content");
      return false;
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return {
    aboutContent,
    loading,
    updateContent,
    refreshContent: loadContent,
  };
}
