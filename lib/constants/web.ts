import { DriverForm } from "@/components/job-forms/driver-form";
import { TerritoryManagerForm } from "@/components/job-forms/territory-manager-form";
import {
  Briefcase,
  Building2,
  Factory,
  FileText,
  MapPinned,
  Tag,
  Truck,
  Utensils,
} from "lucide-react";

export const COVERAGE_LOCATIONS = [
  // Alabama
  {
    label: "Mobile, AL",
    lat: 30.6954,
    lng: -88.0399,
  },
  {
    label: "Tillmans Corner, AL",
    lat: 30.5907,
    lng: -88.1708,
  },
  {
    label: "Robertsdale, AL",
    lat: 30.5538,
    lng: -87.7119,
  },
  {
    label: "Gulf Shores, AL",
    lat: 30.246,
    lng: -87.7008,
  },
  {
    label: "Greenville, AL",
    lat: 31.8296,
    lng: -86.6178,
  },
  {
    label: "Montgomery, AL",
    lat: 32.3792,
    lng: -86.3077,
  },

  // Florida
  {
    label: "Century, FL",
    lat: 30.9732,
    lng: -87.2636,
  },
  {
    label: "Pensacola, FL",
    lat: 30.4213,
    lng: -87.2169,
  },
  {
    label: "Destin, FL",
    lat: 30.3935,
    lng: -86.4958,
  },
  {
    label: "Tallahassee, FL",
    lat: 30.4383,
    lng: -84.2807,
  },

  // Mississippi
  {
    label: "Pascagoula, MS",
    lat: 30.3658,
    lng: -88.5561,
  },
  {
    label: "Moss Point, MS",
    lat: 30.4116,
    lng: -88.5345,
  },
  {
    label: "Biloxi, MS",
    lat: 30.396,
    lng: -88.8853,
  },
  {
    label: "Natchez, MS",
    lat: 31.5604,
    lng: -91.4032,
  },
  {
    label: "Flowood, MS",
    lat: 32.3096,
    lng: -90.1387,
  },

  // Louisiana
  {
    label: "Slidell, LA",
    lat: 30.2752,
    lng: -89.7812,
  },
  {
    label: "New Orleans, LA",
    lat: 29.9511,
    lng: -90.0715,
  },
  {
    label: "Baton Rouge, LA",
    lat: 30.4515,
    lng: -91.1871,
  },
  {
    label: "Lafayette, LA",
    lat: 30.2241,
    lng: -92.0198,
  },
  {
    label: "Lake Charles, LA",
    lat: 30.2266,
    lng: -93.2174,
  },
  {
    label: "Monroe, LA",
    lat: 32.5093,
    lng: -92.1193,
  },
  {
    label: "Shreveport, LA",
    lat: 32.5252,
    lng: -93.7502,
  },
];

export const HOME_SECTIONS = {
  hero: {
    title: "Foodservice distribution you can rely on",
    description:
      "Reliable delivery of fresh produce and essential foodservice products for restaurants and commercial kitchens across the GulfCoast.",
    badge: "Serving restaurants, food trucks, and commercial kitchens",
    image: "/3.jpeg",
  },
  serve: [
    {
      title: "Restaurants",
      icon: Utensils,
      description: "Reliable supply for daily kitchen operations.",
    },
    {
      title: "Food Trucks",
      icon: Truck,
      description: "Consistent products for mobile foodservice.",
    },
    {
      title: "Commercial Kitchens",
      icon: Factory,
      description: "Structured supply for high-volume production.",
    },
    {
      title: "Catering & Hospitality",
      icon: Building2,
      description: "Reliable supply for daily kitchen operations.",
    },
  ],
  categories: [
    {
      title: "Fresh Fruits & Vegetables",
      image: "/vegetables.jpeg",
    },
    {
      title: "Dairy & Eggs",
      image: "/dairy-eggs.jpeg",
    },
    {
      title: "Tortillas & Chips",
      image: "/tortilas.jpeg",
    },
    {
      title: "Canned & Dry",
      image: "/canned-dry.jpeg",
    },
    {
      title: "Paper & Packing",
      image: "/paper-packing.jpeg",
    },
    {
      title: "Beverages",
      image: "/beverages.jpeg",
    },
    {
      title: "Cleaning Supplies",
      image: "/cleaning-supplies.jpeg",
    },
    {
      title: "Spices & Seasoning",
      image: "/spices-seasoning.jpeg",
    },
    {
      title: "Specialty Products",
      image: "/specialty-products.jpeg",
    },
  ],
  marquee: [
    "/banderita.avif",
    "/islandoasis.avif",
    "/jarritos.avif",
    "/knorr.avif",
    "/landolakes.avif",
  ],
  steps: [
    {
      title: "Apply",
      description:
        "Submit your application with business and contact information.",
    },
    {
      title: "Review",
      description:
        "Our team reviews your details to confirm eligibility and service coverage.",
    },
    {
      title: "Approval & Setup",
      description:
        "Once approved, we assist with account setup and delivery details",
    },
    {
      title: "Deliveries Begin",
      description:
        "You’ll receive scheduled deliveries based on your operation’s needs.",
    },
  ],
  chooseUs: [
    {
      title: "Reliable Service",
      description: "Free Consulting With Experet Saving Money",
    },
    {
      title: "Quality Products",
      description: "Carefully selected products",
    },
    {
      title: "Professional Operations",
      description: "Consistent operations for reliable supply chains",
    },
    {
      title: "Customer Support",
      description: "Responsive team committed to long-term partnerships.",
    },
  ],
  quality: [
    {
      title: "Proper product handling and storage",
      description: "",
      image: "/storage.png",
    },
    {
      title: "Clean, organized warehouse operations",
      description: "",
      image: "/handling.png",
    },
    {
      title: "Quality checks throughout the supply process",
      description: "",
      image: "/quality-check.png",
    },
  ],
};

export const ABOUT_SECTIONS = {
  story: `
  We’ve grown to two facilities and a larger fleet, while staying true to what matters most: clear communication, consistent product, and respect for our drivers and warehouse team.

We serve independent restaurants, multi-unit operators, bars, and specialty retailers along the I-10 corridor—aligning delivery days, cut-off times, and product assortments with how your business actually runs.

- Direct access to decision-makers  
- Bilingual support (English & Spanish)  
- Flexible delivery and assortment as you grow  

  `,
  howWeWork: [
    {
      title: "Responsive Communication",
      description:
        "We stay easy to reach and quick to respond. When questions come up or needs change, our team acts fast to keep things moving without disruption.",
    },
    {
      title: "Consistent Execution",
      description:
        "From order handling to delivery coordination, we focus on doing the basics right every time. You can rely on steady service, clear processes, and dependable follow-through.",
    },
    {
      title: "Built for Long-Term Partnerships",
      description:
        "We work with customers as partners, not transactions. By understanding your business and goals, we help create lasting relationships that grow over time.",
    },
  ],
};

export const CONTACT_SECTIONS = {
  locations: [
    {
      name: "Alabama",
      street: "23141 Rubens Ln, Robertsdale, AL 36567",
      phone: "+1 (251) 262-2607",
      email: "jorge@jimenezproduce.com",
      lng: -87.7186565,
      lat: 30.5624864,
    },
    {
      name: "Louisiana",
      street: "100 Goldenrod Dr, Lafayette, LA 70507",
      phone: "+1 (337) 806-9008 ",
      email: "yhessenia@jimenezproduce.com",
      lng: -92.0174859,
      lat: 30.282803,
    },
  ],
  contacts: [
    {
      title: "Management",
      icon: Briefcase,
      label: "Connect with leadership",
      description:
        "For business inquiries, partnerships, and company-level discussions.",
      email: "info@jimenezproduce.com",
      phone: "(251) 262-2607",
    },
    {
      title: "Robertsdale",
      icon: MapPinned,
      label: "Robertsdale warehouse team",
      description:
        "Questions about receiving, pickups, delivery scheduling, and current inventory availability.",
      email: "jorge@jimenezproduce.com",
      phone: "(251) 262-2607",
    },
    {
      title: "Lafayette",
      icon: MapPinned,
      label: "Lafayette warehouse team",
      description:
        "Questions about receiving, pickups, delivery scheduling, and current inventory availability.",
      email: "yhessenia@jimenezproduce.com",
      phone: "(337) 806-9008 ",
    },
    {
      title: "Fleet",
      icon: Truck,
      label: "Talk to our fleet team",
      description:
        "Questions related to transportation, fleet operations, and delivery logistics.",
      email: "fleet@jimenezproduce.com",
      phone: "(251) 262-2607",
    },
    {
      title: "Products",
      icon: Tag,
      label: "Get product information",
      description:
        "Inquiries about product availability, sourcing, and item details from our warehouse locations.",
      email: "info@jimenezproduce.com",
      phone: "(251) 262-2607",
    },
  ],
  faqs: [
    {
      title: "Do you sell to businesses only, or to the public as well?",
      content:
        "We primarily serve businesses, restaurants, and foodservice partners. If you’re unsure whether we’re a good fit, feel free to reach out and ask.",
    },
    {
      title: "What areas do you deliver to?",
      content:
        "We deliver throughout the I-10 corridor and surrounding markets, supported by our Robertsdale and Lafayette warehouse locations.",
    },
    {
      title: "What are your receiving hours?",
      content:
        "Receiving hours are Monday through Saturday from 8:00 AM to 4:00 PM, by appointment only.",
    },
    {
      title: "How do I place an order?",
      content:
        "You can place an order directly through our online ordering portal at /order. If you need assistance, our team is happy to help by phone or email with product availability and recommendations.",
      cta: true,
    },
    {
      title: "How do I place or modify an order?",
      content:
        "Orders and changes can be handled by contacting our team by phone or email. We’re happy to assist with availability and updates.",
    },
    {
      title: "Who should I contact about deliveries or pickups?",
      content:
        "Our warehouse team can help with delivery scheduling, pickups, and questions about current inventory.",
    },
    {
      title: "How can I get information about your products?",
      content:
        "For product details, availability, and sourcing information, please contact our product team.",
    },
  ],
};

export const OPEN_POSITIONS = [
  {
    title: "Territory Manager (Sales)",
    location: "Alabama / Louisiana",
    tags: ["Bilingual (English/Spanish)"],
    href: "territory-manager",
    description:
      "The Territory Manager is responsible for driving revenue growth, developing new restaurant accounts, and maintaining strong customer relationships within an assigned territory.",
    details: `
### Key Responsibilities:
- Prospect and acquire new restaurant and food service accounts
- Maintain consistent in-person customer visits
- Present weekly promotions and product opportunities
- Monitor competitor pricing and market activity
- Coordinate with operations regarding inventory and availability
- Maintain accurate CRM notes and sales reporting
- Meet or exceed monthly revenue and gross margin targets
### Qualifications:
- Prior food service or distribution sales experience preferred
- Strong negotiation and communication skills
- Self-motivated and goal-oriented
- Reliable transportation
- Bilingual (English/Spanish) preferred`,
    form: TerritoryManagerForm,
  },
  {
    title: "Operations Manager",
    location: "Alabama / Louisiana",
    tags: ["Bilingual (English/Spanish)"],
    href: "operations",
    description:
      "The Operations Manager oversees daily warehouse and distribution operations to ensure efficiency, food safety compliance, and on-time delivery execution.",
    details: `
### Key Responsibilities:
- Supervise warehouse associates and drivers
- Manage route planning and load accuracy
- Ensure cold-chain compliance and food safety standards
- Enforce FIFO inventory rotation
- Maintain sanitation and workplace safety standards
- Monitor labor productivity and operational efficiency
- Resolve operational issues quickly and effectively
- Ensure regulatory compliance across transportation and warehouse operations

- Qualifications:
- Experience in food distribution, logistics, or warehouse management
- Strong leadership and organizational skills
- Knowledge of DOT and transportation compliance preferred
- Detail-oriented with strong problem-solving ability`,
    form: TerritoryManagerForm,
  },
  {
    title: "Warehouse Associate",
    location: "Alabama / Louisiana",
    tags: [],
    href: "warehouse-associate",
    description:
      "Warehouse Associates are responsible for receiving, storing, selecting, and preparing product for daily distribution while maintaining food safety and warehouse standards.",
    details: `
### Key Responsibilities:
- Accurately pick, stage, and prepare customer orders
- Receive and inspect incoming product for quality
- Maintain organized storage areas (dry, refrigerated, frozen)
- Follow FIFO inventory rotation procedures
- Operate pallet jacks and warehouse equipment safely
- Maintain warehouse cleanliness and sanitation standards
- Assist with loading trucks for route delivery

### Qualifications:
- Ability to lift 50+ lbs
- Comfortable working in refrigerated environments
- Reliable and punctual
- Warehouse or distribution experience preferred`,
    form: TerritoryManagerForm,
  },
  {
    title: "Route Driver (Non-CDL)",
    location: "",
    tags: [],
    href: "route-driver-non-cdl",
    description:
      "The Non-CDL Route Driver is responsible for safe, accurate, and professional delivery of product to restaurant customers while maintaining compliance with applicable federal and state transportation regulations.",
    details: `
### Key Responsibilities:
- Deliver product according to assigned route schedule
- Verify invoices and obtain customer signatures
- Safely unload and handle product at delivery locations
- Complete daily pre-trip and post-trip inspections
- Maintain compliance with applicable DOT and FMCSA regulations when operating company vehicles
- Adhere to Hours of Service (HOS) requirements when applicable
- Report vehicle maintenance issues promptly
- Provide professional customer service at each stop

### Qualifications:
- Valid driver’s license
- Clean driving record (MVR review required)
- Must meet DOT physical requirements when applicable
- Ability to lift 50+ lbs
- Early morning route availability`,
    form: DriverForm,
  },
  {
    title: "Route Driver (CDL Class B)",
    location: "",
    tags: [],
    href: "route-driver-cdl",
    description:
      "The CDL Route Driver operates commercial motor vehicles to deliver product safely and efficiently while maintaining full DOT compliance.",
    details: `
### Key Responsibilities:
- Operate commercial box trucks in compliance with DOT regulations
- Complete daily pre-trip and post-trip inspections
- Maintain DOT logs and required documentation
- Comply with Hours of Service (HOS) regulations
- Ensure proper load securement and temperature control
- Deliver product accurately and on schedule
- Deliver product accurately and on schedule
- Maintain professional customer interaction

### Qualifications:
- Valid CDL Class B license
- Current DOT medical card
- Clean MVR
- Ability to perform physically demanding deliveries
- Knowledge of DOT and FMCSA regulations
      `,
    form: DriverForm,
  },
];
