import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LeadershipMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

export function useLeadershipTeam() {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leadership_team")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error loading leadership team:", error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (member: Omit<LeadershipMember, "id">) => {
    try {
      const { error } = await supabase.from("leadership_team").insert(member);
      if (error) throw error;
      toast.success("Team member added successfully");
      await loadMembers();
      return true;
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
      return false;
    }
  };

  const updateMember = async (id: string, member: Partial<LeadershipMember>) => {
    try {
      const { error } = await supabase
        .from("leadership_team")
        .update({ ...member, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success("Team member updated successfully");
      await loadMembers();
      return true;
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member");
      return false;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase.from("leadership_team").delete().eq("id", id);
      if (error) throw error;
      toast.success("Team member deleted successfully");
      await loadMembers();
      return true;
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
      return false;
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return {
    members,
    loading,
    addMember,
    updateMember,
    deleteMember,
    refreshMembers: loadMembers,
  };
}
