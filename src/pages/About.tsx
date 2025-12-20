import { Users, Award, Target, Heart, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAboutContent } from "@/hooks/useAboutContent";
import { useLeadershipTeam } from "@/hooks/useLeadershipTeam";
import { useAwards } from "@/hooks/useAwards";

const About = () => {
  const { aboutContent, loading } = useAboutContent();
  const { members, loading: loadingTeam } = useLeadershipTeam();
  const { awards, loading: loadingAwards } = useAwards();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const pageTitle = aboutContent?.page_title || "About Us";
  const pageSubtitle = aboutContent?.page_subtitle || 
    "For over 15 years, we've been crafting premium outdoor gear that enhances your adventures.";
  const companyStory = aboutContent?.company_story || 
    "Founded with a simple mission: to create products that could withstand the toughest conditions while providing unmatched reliability.";
  const storyImageUrl = aboutContent?.story_image_url;
  const missionTitle = aboutContent?.mission_title || "Our Mission";
  const missionDescription = aboutContent?.mission_description || 
    "To design and manufacture the highest quality products that enable people to explore and adventure safely.";
  const visionTitle = aboutContent?.vision_title || "Our Vision";
  const visionDescription = aboutContent?.vision_description || 
    "To be the world's most trusted brand, known for products that enhance experiences while promoting sustainability.";
  const coreValues = aboutContent?.core_values || ["Quality", "Innovation", "Sustainability", "Customer Focus"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">{pageTitle}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
        </section>

        {/* Company Story */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                {companyStory.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src={storyImageUrl || "/placeholder.svg?height=400&width=600"} 
                alt="Our Story"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-secondary/50 rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mission & Vision</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-brand-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-brand-gold">
                  <Target className="h-6 w-6" />
                  <span>{missionTitle}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{missionDescription}</p>
              </CardContent>
            </Card>

            <Card className="border-brand-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-brand-gold">
                  <Heart className="h-6 w-6" />
                  <span>{visionTitle}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{visionDescription}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        {coreValues.length > 0 && (
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(coreValues.length, 4)} gap-8`}>
              {coreValues.map((value, index) => {
                const icons = [Award, Users, Heart, Target];
                const Icon = icons[index % icons.length];
                return (
                  <div key={index} className="text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                      <Icon className="h-8 w-8 text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-semibold">{value}</h3>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Leadership Team */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">Meet the people behind our success</p>
          </div>
          
          {loadingTeam ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <Card key={member.id} className="text-center">
                  <CardContent className="p-6">
                    {member.image_url ? (
                      <img 
                        src={member.image_url} 
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-muted flex items-center justify-center">
                        <Users className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-brand-gold font-medium mb-3">{member.position}</p>
                    {member.bio && <p className="text-muted-foreground">{member.bio}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Leadership team information coming soon.</p>
          )}
        </section>

        {/* Awards & Recognition */}
        <section className="py-16 bg-gradient-to-r from-brand-dark to-brand-accent text-white rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-300">Recognition for our commitment to excellence</p>
          </div>
          
          {loadingAwards ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : awards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {awards.map((award) => (
                <div key={award.id} className="text-center">
                  {award.image_url ? (
                    <img 
                      src={award.image_url} 
                      alt={award.title}
                      className="w-16 h-16 mx-auto mb-3 object-contain"
                    />
                  ) : (
                    <Award className="w-12 h-12 mx-auto mb-3 text-brand-gold" />
                  )}
                  {award.year && (
                    <h3 className="text-2xl font-bold text-brand-gold mb-2">{award.year}</h3>
                  )}
                  <p className="font-semibold">{award.title}</p>
                  {award.organization && (
                    <p className="text-sm text-gray-300 mt-1">{award.organization}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-300 py-8">Awards and recognition coming soon.</p>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
