import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Award {
  id: string;
  title: string;
  organization: string | null;
  year: number | null;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

export function useAwards() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAwards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setAwards(data || []);
    } catch (error) {
      console.error("Error loading awards:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAward = async (award: Omit<Award, "id">) => {
    try {
      const { error } = await supabase.from("awards").insert(award);
      if (error) throw error;
      toast.success("Award added successfully");
      await loadAwards();
      return true;
    } catch (error) {
      console.error("Error adding award:", error);
      toast.error("Failed to add award");
      return false;
    }
  };

  const updateAward = async (id: string, award: Partial<Award>) => {
    try {
      const { error } = await supabase
        .from("awards")
        .update({ ...award, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success("Award updated successfully");
      await loadAwards();
      return true;
    } catch (error) {
      console.error("Error updating award:", error);
      toast.error("Failed to update award");
      return false;
    }
  };

  const deleteAward = async (id: string) => {
    try {
      const { error } = await supabase.from("awards").delete().eq("id", id);
      if (error) throw error;
      toast.success("Award deleted successfully");
      await loadAwards();
      return true;
    } catch (error) {
      console.error("Error deleting award:", error);
      toast.error("Failed to delete award");
      return false;
    }
  };

  useEffect(() => {
    loadAwards();
  }, []);

  return {
    awards,
    loading,
    addAward,
    updateAward,
    deleteAward,
    refreshAwards: loadAwards,
  };
}
