import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, Edit, Save, Users, Loader2, Upload, X, Plus, Trash2, Award, Heart } from "lucide-react";
import { useAboutContent } from "@/hooks/useAboutContent";
import { useLeadershipTeam, LeadershipMember } from "@/hooks/useLeadershipTeam";
import { useAwards, Award as AwardType } from "@/hooks/useAwards";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminAbout() {
  const { aboutContent, loading, updateContent } = useAboutContent();
  const { members, loading: loadingTeam, addMember, updateMember, deleteMember } = useLeadershipTeam();
  const { awards, loading: loadingAwards, addAward, updateAward, deleteAward } = useAwards();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Team dialog state
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<LeadershipMember | null>(null);
  const [memberForm, setMemberForm] = useState({ name: "", position: "", bio: "", image_url: "" });
  const memberImageRef = useRef<HTMLInputElement>(null);
  const [uploadingMemberImage, setUploadingMemberImage] = useState(false);
  
  // Award dialog state
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardType | null>(null);
  const [awardForm, setAwardForm] = useState({ title: "", organization: "", year: "", description: "", image_url: "" });
  const awardImageRef = useRef<HTMLInputElement>(null);
  const [uploadingAwardImage, setUploadingAwardImage] = useState(false);

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

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return null;
    }
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}-${Date.now()}.${fileExt}`;
    const filePath = `about/${fileName}`;

    const { error } = await supabase.storage.from("image").upload(filePath, file, { upsert: true });
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from("image").getPublicUrl(filePath);
    return publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "story");
      if (url) {
        setFormData({ ...formData, story_image_url: url });
        toast.success("Image uploaded successfully");
      }
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
    if (success) setIsEditing(false);
  };

  // Team member handlers
  const handleMemberImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMemberImage(true);
    try {
      const url = await uploadImage(file, "team");
      if (url) {
        setMemberForm({ ...memberForm, image_url: url });
        toast.success("Image uploaded");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingMemberImage(false);
    }
  };

  const openMemberDialog = (member?: LeadershipMember) => {
    if (member) {
      setEditingMember(member);
      setMemberForm({
        name: member.name,
        position: member.position,
        bio: member.bio || "",
        image_url: member.image_url || "",
      });
    } else {
      setEditingMember(null);
      setMemberForm({ name: "", position: "", bio: "", image_url: "" });
    }
    setTeamDialogOpen(true);
  };

  const handleSaveMember = async () => {
    if (!memberForm.name || !memberForm.position) {
      toast.error("Name and position are required");
      return;
    }
    const data = {
      name: memberForm.name,
      position: memberForm.position,
      bio: memberForm.bio || null,
      image_url: memberForm.image_url || null,
      is_active: true,
      sort_order: members.length,
    };
    const success = editingMember
      ? await updateMember(editingMember.id, data)
      : await addMember(data);
    if (success) setTeamDialogOpen(false);
  };

  // Award handlers
  const handleAwardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAwardImage(true);
    try {
      const url = await uploadImage(file, "award");
      if (url) {
        setAwardForm({ ...awardForm, image_url: url });
        toast.success("Image uploaded");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingAwardImage(false);
    }
  };

  const openAwardDialog = (award?: AwardType) => {
    if (award) {
      setEditingAward(award);
      setAwardForm({
        title: award.title,
        organization: award.organization || "",
        year: award.year?.toString() || "",
        description: award.description || "",
        image_url: award.image_url || "",
      });
    } else {
      setEditingAward(null);
      setAwardForm({ title: "", organization: "", year: "", description: "", image_url: "" });
    }
    setAwardDialogOpen(true);
  };

  const handleSaveAward = async () => {
    if (!awardForm.title) {
      toast.error("Title is required");
      return;
    }
    const data = {
      title: awardForm.title,
      organization: awardForm.organization || null,
      year: awardForm.year ? parseInt(awardForm.year) : null,
      description: awardForm.description || null,
      image_url: awardForm.image_url || null,
      is_active: true,
      sort_order: awards.length,
    };
    const success = editingAward
      ? await updateAward(editingAward.id, data)
      : await addAward(data);
    if (success) setAwardDialogOpen(false);
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
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Content"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Company Information Card */}
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
              <Input id="page_title" value={formData.page_title} onChange={(e) => setFormData({ ...formData, page_title: e.target.value })} disabled={!isEditing} placeholder="About Our Company" />
            </div>
            <div>
              <Label htmlFor="page_subtitle">Page Subtitle</Label>
              <Textarea id="page_subtitle" value={formData.page_subtitle} onChange={(e) => setFormData({ ...formData, page_subtitle: e.target.value })} disabled={!isEditing} placeholder="Enter a subtitle for the about page" rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mission_title">Mission Title</Label>
                <Input id="mission_title" value={formData.mission_title} onChange={(e) => setFormData({ ...formData, mission_title: e.target.value })} disabled={!isEditing} placeholder="Our Mission" />
              </div>
              <div>
                <Label htmlFor="vision_title">Vision Title</Label>
                <Input id="vision_title" value={formData.vision_title} onChange={(e) => setFormData({ ...formData, vision_title: e.target.value })} disabled={!isEditing} placeholder="Our Vision" />
              </div>
            </div>
            <div>
              <Label htmlFor="mission_description">Mission Statement</Label>
              <Textarea id="mission_description" value={formData.mission_description} onChange={(e) => setFormData({ ...formData, mission_description: e.target.value })} disabled={!isEditing} placeholder="Enter your company's mission statement" rows={3} />
            </div>
            <div>
              <Label htmlFor="vision_description">Vision Statement</Label>
              <Textarea id="vision_description" value={formData.vision_description} onChange={(e) => setFormData({ ...formData, vision_description: e.target.value })} disabled={!isEditing} placeholder="Enter your company's vision statement" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Company Story & Stats Card */}
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
              <Textarea id="company_story" value={formData.company_story} onChange={(e) => setFormData({ ...formData, company_story: e.target.value })} disabled={!isEditing} rows={5} placeholder="Tell your company's story..." />
            </div>
            <div>
              <Label>Story Image</Label>
              <div className="mt-2 space-y-3">
                {formData.story_image_url ? (
                  <div className="relative inline-block">
                    <img src={formData.story_image_url} alt="Story" className="h-40 w-auto rounded-lg object-cover border" />
                    {isEditing && (
                      <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={handleRemoveImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="h-40 w-60 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No image</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={!isEditing || uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploading ? "Uploading..." : "Choose File"}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="team_size">Team Size</Label>
                <Input id="team_size" type="number" value={formData.team_size} onChange={(e) => setFormData({ ...formData, team_size: e.target.value })} disabled={!isEditing} placeholder="50" />
              </div>
              <div>
                <Label htmlFor="years_experience">Years Experience</Label>
                <Input id="years_experience" type="number" value={formData.years_experience} onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })} disabled={!isEditing} placeholder="15" />
              </div>
              <div>
                <Label htmlFor="happy_customers">Happy Customers</Label>
                <Input id="happy_customers" type="number" value={formData.happy_customers} onChange={(e) => setFormData({ ...formData, happy_customers: e.target.value })} disabled={!isEditing} placeholder="50000" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Values Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Our Values
            </CardTitle>
            <CardDescription>Define your company's core values</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="core_values">Core Values (comma-separated)</Label>
              <Textarea
                id="core_values"
                value={formData.core_values}
                onChange={(e) => setFormData({ ...formData, core_values: e.target.value })}
                disabled={!isEditing}
                placeholder="Quality, Innovation, Customer Focus, Integrity"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">Separate each value with a comma</p>
            </div>
            {formData.core_values && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.core_values.split(",").map((value, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {value.trim()}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leadership Team Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Leadership Team
              </span>
              <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openMemberDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Photo</Label>
                      <div className="mt-2 flex items-center gap-4">
                        {memberForm.image_url ? (
                          <div className="relative">
                            <img src={memberForm.image_url} alt="" className="h-20 w-20 rounded-full object-cover" />
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-1 -right-1 h-5 w-5" onClick={() => setMemberForm({ ...memberForm, image_url: "" })}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <input type="file" ref={memberImageRef} onChange={handleMemberImageUpload} accept="image/*" className="hidden" />
                        <Button type="button" variant="outline" size="sm" onClick={() => memberImageRef.current?.click()} disabled={uploadingMemberImage}>
                          {uploadingMemberImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                          Upload
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Name *</Label>
                      <Input value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div>
                      <Label>Position *</Label>
                      <Input value={memberForm.position} onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })} placeholder="CEO" />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Textarea value={memberForm.bio} onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })} placeholder="Brief bio..." rows={3} />
                    </div>
                    <Button onClick={handleSaveMember} className="w-full">
                      {editingMember ? "Update Member" : "Add Member"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>Manage your leadership team members</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTeam ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : members.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No team members added yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openMemberDialog(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMember(member.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Awards & Recognition Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Awards & Recognition
              </span>
              <Dialog open={awardDialogOpen} onOpenChange={setAwardDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openAwardDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAward ? "Edit Award" : "Add Award"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Image</Label>
                      <div className="mt-2 flex items-center gap-4">
                        {awardForm.image_url ? (
                          <div className="relative">
                            <img src={awardForm.image_url} alt="" className="h-16 w-16 rounded object-cover" />
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-1 -right-1 h-5 w-5" onClick={() => setAwardForm({ ...awardForm, image_url: "" })}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                            <Award className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <input type="file" ref={awardImageRef} onChange={handleAwardImageUpload} accept="image/*" className="hidden" />
                        <Button type="button" variant="outline" size="sm" onClick={() => awardImageRef.current?.click()} disabled={uploadingAwardImage}>
                          {uploadingAwardImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                          Upload
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Title *</Label>
                      <Input value={awardForm.title} onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })} placeholder="Best Innovation Award" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Organization</Label>
                        <Input value={awardForm.organization} onChange={(e) => setAwardForm({ ...awardForm, organization: e.target.value })} placeholder="Tech Association" />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input type="number" value={awardForm.year} onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })} placeholder="2024" />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={awardForm.description} onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })} placeholder="Award description..." rows={3} />
                    </div>
                    <Button onClick={handleSaveAward} className="w-full">
                      {editingAward ? "Update Award" : "Add Award"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>Showcase your company's awards and recognition</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAwards ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : awards.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No awards added yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {awards.map((award) => (
                    <TableRow key={award.id}>
                      <TableCell>
                        {award.image_url ? (
                          <img src={award.image_url} alt={award.title} className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                            <Award className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{award.title}</TableCell>
                      <TableCell>{award.organization || "-"}</TableCell>
                      <TableCell>{award.year || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openAwardDialog(award)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteAward(award.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
