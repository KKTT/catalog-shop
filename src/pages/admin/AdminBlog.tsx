import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Edit, Trash2, Calendar } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    title: "Getting Started with Our Platform",
    excerpt: "Learn the basics of using our e-commerce platform effectively.",
    status: "published",
    publishedAt: "2024-01-15",
    category: "Tutorial"
  },
  {
    id: 2,
    title: "New Product Launch Announcement",
    excerpt: "Exciting new products are now available in our store.",
    status: "draft",
    publishedAt: null,
    category: "Announcement"
  },
  {
    id: 3,
    title: "Customer Success Stories",
    excerpt: "Read about how our customers are achieving great results.",
    status: "published",
    publishedAt: "2024-01-10",
    category: "Case Study"
  }
];

export function AdminBlog() {
  const [posts, setPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage your blog content</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Blog Posts
          </CardTitle>
          <CardDescription>Manage all your blog posts and articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                    {post.publishedAt && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.publishedAt}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-sm text-muted-foreground">Articles published</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter(p => p.status === "published").length}</div>
            <p className="text-sm text-muted-foreground">Live articles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter(p => p.status === "draft").length}</div>
            <p className="text-sm text-muted-foreground">Unpublished articles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}