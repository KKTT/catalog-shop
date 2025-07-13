import { Users, Award, Target, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">About Than Thorn and Tep Sarak</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            For over 15 years, we've been crafting premium outdoor gear that enhances your adventures. 
            Our commitment to quality, innovation, and customer satisfaction drives everything we do.
          </p>
        </section>

        {/* Company Story */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Founded in 2008, Than Thorn and Tep Sarak began as a small family business with a simple mission: 
                  to create outdoor gear that could withstand the toughest conditions while providing unmatched reliability.
                </p>
                <p>
                  What started as a passion project has grown into a trusted brand known for innovative designs and 
                  superior craftsmanship. Our products are used by outdoor enthusiasts, professionals, and families 
                  around the world.
                </p>
                <p>
                  Today, we continue to push the boundaries of what's possible in outdoor gear, always staying true 
                  to our core values of quality, durability, and customer satisfaction.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/placeholder.svg?height=400&width=600" 
                alt="Our Story"
                className="rounded-lg shadow-lg"
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
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To design and manufacture the highest quality outdoor gear that enables people to explore, 
                  adventure, and connect with nature safely and comfortably. We strive to exceed expectations 
                  through innovation, sustainability, and exceptional customer service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-brand-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-brand-gold">
                  <Heart className="h-6 w-6" />
                  <span>Our Vision</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be the world's most trusted outdoor gear brand, known for products that enhance outdoor 
                  experiences while promoting environmental stewardship and inspiring the next generation of 
                  outdoor enthusiasts.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold">Quality</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Every product is rigorously tested to meet our high standards.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously innovate to create gear that meets evolving outdoor needs and challenges.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold">Sustainability</h3>
              <p className="text-muted-foreground">
                We're committed to responsible manufacturing and environmental stewardship.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold">Customer Focus</h3>
              <p className="text-muted-foreground">
                Our customers are at the heart of everything we do. Their satisfaction is our success.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">Meet the people behind our success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Than Thorn",
                role: "Co-Founder & CEO",
                image: "/placeholder.svg?height=300&width=300",
                bio: "With over 20 years in outdoor gear design, Than leads our vision and product development."
              },
              {
                name: "Tep Sarak",
                role: "Co-Founder & CTO",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Sarak oversees our technical innovations and manufacturing processes."
              },
              {
                name: "Sarah Johnson",
                role: "Head of Design",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Sarah brings creative vision to our product line, ensuring both function and style."
              }
            ].map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-brand-gold font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-16 bg-gradient-to-r from-brand-dark to-brand-accent text-white rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-300">Recognition for our commitment to excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-gold mb-2">2023</h3>
              <p>Best Outdoor Gear Brand</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-gold mb-2">2022</h3>
              <p>Innovation Award</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-gold mb-2">2021</h3>
              <p>Customer Choice Award</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-gold mb-2">2020</h3>
              <p>Sustainability Leader</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;