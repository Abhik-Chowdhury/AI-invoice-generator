import { BarChart2, FileText, LayoutDashboard, Mail, Plus, Sparkles, Users } from "lucide-react";

export const FEATURES = [
    {
        icon: Sparkles,
        title: "AI Invoice Creation",
        description:"Paste any text,email,or  converts  into complete, printable invoices."
    },
    {
        icon: BarChart2,
        title: "AI-Powered Dashboard",
        description:"Based on your invoice it converts that data into business insights, ."
    },
    {
        icon: Mail,
        title: "Smart Reminders",
        description:"For your each invoice creates a AI smart Follow up to client just copy and send."
    },
    {
        icon: FileText,
        title: "Easy Invoice Management",
        description:"Get a dynamic search with no more hulste, all your invoices are manages with ease."
    },

];

export const TESTIMONIALS = [
    {
        quote: "This app saved me hours of work. I can now create and send invoices in minutes!",
        author: "Jane Doe",
        title: "Freelancer Designer",
        avatar: "https://mockmind-api.uifaces.co/content/human/80.jpg"

    },
    {
        quote: "The best invoicing app I have ever used. Simple, intuitive, and powerful.",
        author: "John Smith",
        title: "Small Business Owner",
        avatar: "https://mockmind-api.uifaces.co/content/human/222.jpg"

    },
    {
        quote: "I love the dashboard and reporting features. It helps me keep track of my financials ",
        author: "John Smith",
        title: "Consultant",
        avatar: "https://mockmind-api.uifaces.co/content/human/96.jpg"

    },
    
];

export const FAQS = [
    {
        question: "How does the AI invoice creation work?",
        answer: "Simply paste any text that contains invoice details-like an email"
    },
    {
       question: "Is there a free trial available?",
        answer: "Yes, you can try our platfrom for free for 14 days. If you want, we'll provided" 
    },
    {
       question: "Can I change my plan later?",
        answer: "Of course. Our pricing scales with your company. Chat to our friendly team to more clarity" 
    },
    {
       question: "What is your cancellation policy",
        answer: "We understand that things change, You can cancel your plan at any time and we not ask any answer" 
    },
    {
       question: "Can other info be added to an invoice",
        answer: "Yes, you can add notes, payment terms, and even attach files to your invoices." 
    },
    {
       question: "How does billing work",
        answer: "Plans are per wrokspace, not per account. You can upgrade one workspace." 
    },
    {
       question: "How do I change my account email",
        answer: "You can change your account email from your profile setting page." 
    }
];

// Navigation items configuration
export const NAVIGATION_MENU = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard},
    { id: "invoices", name: "Invoices", icon: FileText},
    { id: "invoices/new", name: "Create Invoice", icon: Plus},
    { id: "profile", name: "Profile", icon: Users},

]