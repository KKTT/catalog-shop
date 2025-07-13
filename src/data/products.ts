export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
  capacity?: string;
}

export const products: Product[] = [
  // Soft Pack Welded Coolers
  {
    id: "spw-backpack-20",
    name: "Soft Pack Welded Backpack Cooler 20 Cans",
    category: "Soft Pack Welded",
    price: 159.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Premium welded backpack cooler designed for outdoor adventures. Holds up to 20 cans with ice.",
    features: [
      "Welded construction for durability",
      "Comfortable padded shoulder straps",
      "Multiple exterior pockets",
      "Leak-proof design",
      "Easy-access top zipper"
    ],
    specifications: {
      "Capacity": "20 cans + ice",
      "Material": "Welded TPU fabric",
      "Dimensions": "18\" x 12\" x 8\"",
      "Weight": "2.5 lbs",
      "Ice Retention": "Up to 24 hours"
    },
    inStock: true,
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isFeatured: true,
    capacity: "20 Cans"
  },
  {
    id: "spw-tote-30",
    name: "Soft Pack Welded Tote Cooler 30 Cans",
    category: "Soft Pack Welded",
    price: 189.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Large capacity tote cooler perfect for family outings and group events.",
    features: [
      "Spacious 30-can capacity",
      "Reinforced handles",
      "Side mesh pockets",
      "Premium welded construction"
    ],
    specifications: {
      "Capacity": "30 cans + ice",
      "Material": "Welded TPU fabric",
      "Dimensions": "20\" x 14\" x 10\"",
      "Weight": "3.2 lbs",
      "Ice Retention": "Up to 30 hours"
    },
    inStock: true,
    rating: 4.7,
    reviews: 89,
    isFeatured: true,
    capacity: "30 Cans"
  },
  {
    id: "spw-tote-24",
    name: "Soft Pack Welded Tote Cooler 24 Cans",
    category: "Soft Pack Welded",
    price: 149.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Mid-size tote cooler ideal for day trips and beach outings.",
    features: [
      "24-can capacity",
      "Durable tote design",
      "Easy-clean interior",
      "Welded seams"
    ],
    specifications: {
      "Capacity": "24 cans + ice",
      "Material": "Welded TPU fabric",
      "Dimensions": "18\" x 12\" x 9\"",
      "Weight": "2.8 lbs",
      "Ice Retention": "Up to 24 hours"
    },
    inStock: true,
    rating: 4.6,
    reviews: 67,
    capacity: "24 Cans"
  },
  {
    id: "spw-cooler-12",
    name: "Soft Pack Welded Cooler 12 Cans",
    category: "Soft Pack Welded",
    price: 99.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Compact and portable cooler perfect for personal use and short trips.",
    features: [
      "Compact 12-can size",
      "Lightweight design",
      "Shoulder strap included",
      "Welded construction"
    ],
    specifications: {
      "Capacity": "12 cans + ice",
      "Material": "Welded TPU fabric",
      "Dimensions": "14\" x 10\" x 8\"",
      "Weight": "1.8 lbs",
      "Ice Retention": "Up to 18 hours"
    },
    inStock: true,
    rating: 4.5,
    reviews: 45,
    capacity: "12 Cans"
  },
  {
    id: "spw-cooler-6",
    name: "Soft Pack Welded Cooler 6 Cans",
    category: "Soft Pack Welded",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Ultra-compact cooler for individual outings and lunch breaks.",
    features: [
      "Personal 6-can size",
      "Ultra-lightweight",
      "Easy-carry handle",
      "Premium welded seams"
    ],
    specifications: {
      "Capacity": "6 cans + ice",
      "Material": "Welded TPU fabric",
      "Dimensions": "10\" x 8\" x 6\"",
      "Weight": "1.2 lbs",
      "Ice Retention": "Up to 12 hours"
    },
    inStock: true,
    rating: 4.4,
    reviews: 32,
    capacity: "6 Cans"
  },
  {
    id: "spw-cooler-24",
    name: "Soft Pack Welded Cooler 24 Cans",
    category: "Soft Pack Welded",
    price: 139.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Versatile 24-can cooler with superior welded construction.",
    features: [
      "24-can capacity",
      "Versatile design",
      "Multiple carrying options",
      "Welded TPU construction"
    ],
    specifications: {
      "Capacity": "24 cans + ice",
      "Material": "Welded TPU fabric",
      "Dimensions": "16\" x 12\" x 9\"",
      "Weight": "2.6 lbs",
      "Ice Retention": "Up to 24 hours"
    },
    inStock: true,
    rating: 4.6,
    reviews: 78,
    capacity: "24 Cans"
  },

  // EVA Molded Base Coolers
  {
    id: "eva-molded-base",
    name: "Soft Pack EVA Molded Base Welded Cooler",
    category: "Soft Pack EVA Base",
    price: 179.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Advanced cooler with EVA molded base for enhanced stability and insulation.",
    features: [
      "EVA molded base",
      "Enhanced stability",
      "Superior insulation",
      "Welded construction"
    ],
    specifications: {
      "Capacity": "24 cans + ice",
      "Material": "Welded TPU with EVA base",
      "Dimensions": "18\" x 13\" x 10\"",
      "Weight": "3.5 lbs",
      "Ice Retention": "Up to 36 hours"
    },
    inStock: true,
    rating: 4.9,
    reviews: 156,
    isNew: true,
    isFeatured: true
  },

  // Soft Coolers
  {
    id: "soft-cooler-18",
    name: "Soft Cooler 18 Cans",
    category: "Soft Cooler",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Classic soft cooler design with reliable insulation for everyday use.",
    features: [
      "18-can capacity",
      "Soft-sided construction",
      "Adjustable shoulder strap",
      "Multiple pockets"
    ],
    specifications: {
      "Capacity": "18 cans + ice",
      "Material": "Insulated fabric",
      "Dimensions": "16\" x 11\" x 8\"",
      "Weight": "2.2 lbs",
      "Ice Retention": "Up to 20 hours"
    },
    inStock: true,
    rating: 4.3,
    reviews: 93,
    capacity: "18 Cans"
  },

  // Camping & Outdoor
  {
    id: "camping-tent",
    name: "Premium Camping Tent",
    category: "Camping Tent",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400"
    ],
    description: "High-quality camping tent designed for all weather conditions.",
    features: [
      "4-person capacity",
      "Waterproof design",
      "Easy setup",
      "Weather resistant"
    ],
    specifications: {
      "Capacity": "4 persons",
      "Material": "Ripstop nylon",
      "Dimensions": "8' x 8' x 6'",
      "Weight": "8.5 lbs",
      "Season": "3-season"
    },
    inStock: true,
    rating: 4.7,
    reviews: 201,
    isFeatured: true
  },

  {
    id: "waterproof-bucket-bag",
    name: "Hot Waterproof Bucket Bag 10L",
    category: "Dry Bag",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400"
    ],
    description: "Waterproof bucket bag perfect for water activities and storage.",
    features: [
      "10L capacity",
      "100% waterproof",
      "Bucket design",
      "Multiple uses"
    ],
    specifications: {
      "Capacity": "10 liters",
      "Material": "Waterproof PVC",
      "Dimensions": "12\" x 8\" diameter",
      "Weight": "0.8 lbs",
      "Waterproof Rating": "IPX8"
    },
    inStock: true,
    rating: 4.5,
    reviews: 67,
    isNew: true
  }
];

export const categories = [
  "Soft Pack Welded",
  "Soft Cooler", 
  "Soft Pack EVA Base",
  "Camping Tent",
  "Dry Bag",
  "Travel",
  "Hunting",
  "New Collection"
];

export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getNewProducts = () => products.filter(p => p.isNew);
export const getProductsByCategory = (category: string) => products.filter(p => p.category === category);
export const getProductById = (id: string) => products.find(p => p.id === id);