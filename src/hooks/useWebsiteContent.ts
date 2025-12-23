import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HeroContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  primary_button_text: string;
  secondary_button_text: string;
  hero_image_url?: string;
  is_active: boolean;
}

export interface FeatureContent {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface CompanyContent {
  id: string;
  mission_title: string;
  mission_description?: string;
  years_experience: number;
  happy_customers: number;
  products_available: number;
  company_story?: string;
  core_values?: string[];
  team_size?: number;
  is_active: boolean;
}

export interface HomepageCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_image?: string;
  rating: number;
  review_text: string;
  product_name?: string;
  is_featured: boolean;
  is_active: boolean;
}

export function useWebsiteContent() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [features, setFeatures] = useState<FeatureContent[]>([]);
  const [companyContent, setCompanyContent] = useState<CompanyContent | null>(null);
  const [categories, setCategories] = useState<HomepageCategory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [heroRes, featuresRes, companyRes, categoriesRes, testimonialsRes] = await Promise.all([
        supabase.from('hero_content').select('*').eq('is_active', true).single(),
        supabase.from('features_content').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('company_content').select('*').eq('is_active', true).single(),
        supabase.from('categories').select('*').eq('is_active', true).order('name'),
        supabase.from('testimonials').select('*').eq('is_active', true).eq('is_featured', true).limit(3)
      ]);

      if (heroRes.data) setHeroContent(heroRes.data);
      if (featuresRes.data) setFeatures(featuresRes.data);
      if (companyRes.data) setCompanyContent(companyRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
    } catch (error) {
      console.error('Error loading website content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHeroContent = async (data: Partial<HeroContent>) => {
    if (!user || !heroContent) return false;

    try {
      const { error } = await supabase
        .from('hero_content')
        .update(data)
        .eq('id', heroContent.id);

      if (error) throw error;
      await loadContent();
      return true;
    } catch (error) {
      console.error('Error updating hero content:', error);
      return false;
    }
  };

  const updateFeature = async (id: string, data: Partial<FeatureContent>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('features_content')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await loadContent();
      return true;
    } catch (error) {
      console.error('Error updating feature:', error);
      return false;
    }
  };

  const updateCompanyContent = async (data: Partial<CompanyContent>) => {
    if (!user || !companyContent) return false;

    try {
      const { error } = await supabase
        .from('company_content')
        .update(data)
        .eq('id', companyContent.id);

      if (error) throw error;
      await loadContent();
      return true;
    } catch (error) {
      console.error('Error updating company content:', error);
      return false;
    }
  };

  const updateCategory = async (id: string, data: Partial<HomepageCategory>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await loadContent();
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  };

  const updateTestimonial = async (id: string, data: Partial<Testimonial>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('testimonials')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await loadContent();
      return true;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return false;
    }
  };

  return {
    heroContent,
    features,
    companyContent,
    categories,
    testimonials,
    loading,
    updateHeroContent,
    updateFeature,
    updateCompanyContent,
    updateCategory,
    updateTestimonial,
    refreshContent: loadContent
  };
}