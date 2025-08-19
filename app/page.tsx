import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  FileText,
  Shield,
  Users,
  ArrowRight,
  Play,
  BarChart3,
  FileCheck,
  Building2,
  Gavel,
  Star,
  ChevronRight,
  BarChart,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const user = await currentUser();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Uprez SME</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#product"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Product
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#resources"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Resources
              </Link>
              <Link
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About Us
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link href={"/sign-in"}>
                    <Button variant="ghost" className="hidden sm:inline-flex">
                      Login
                    </Button>
                  </Link>
                  <Link href={"/sign-up"}>
                    <Button>Sign Up</Button>
                  </Link>
                </>
              ) : (
                <Link href={`/dashboard`}>
                  <Button variant="outline">Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                >
                  Trusted by 500+ SMEs
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Launch Your SME IPO with{" "}
                  <span className="text-green-600">Confidence</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Automated compliance checks, guided documentation, and expert
                  insights—all in one place. Navigate the complex IPO process
                  with ease.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={"/sign-up"}>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Get Started – It's Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-gray-300">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-6">
                <Image
                  src="/ipo-dashboard.png?height=400&width=600"
                  alt="SME IPO Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why SMEs Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your IPO journey with our comprehensive compliance
              platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Automated Compliance Checks
                </h3>
                <p className="text-gray-600">
                  Real-time gap analysis across financials, governance, tax, and
                  sector-specific laws.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Smart Document Management
                </h3>
                <p className="text-gray-600">
                  Upload, tag, validate, and verify documents with built-in OCR
                  technology.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Secure & Scalable
                </h3>
                <p className="text-gray-600">
                  Built on secure cloud infrastructure with dedicated storage
                  and databases.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Expert Collaboration
                </h3>
                <p className="text-gray-600">
                  Invite merchant bankers, auditors, or legal experts to your
                  dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Your IPO Journey, Simplified
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow our proven 5-step process to navigate your IPO compliance
              requirements
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                step: "1",
                title: "Onboard",
                description: "Enter company details to check eligibility",
                icon: Building2,
              },
              {
                step: "2",
                title: "Upload Documents",
                description: "Drag-and-drop interface with smart tagging",
                icon: FileText,
              },
              {
                step: "3",
                title: "Generate Report",
                description: "Get detailed gap analysis and recommendations",
                icon: BarChart3,
              },
              {
                step: "4",
                title: "Collaborate",
                description: "Manage team access for experts and advisors",
                icon: Users,
              },
              {
                step: "5",
                title: "DRHP Prep",
                description: "Auto-generate drafts and track submissions",
                icon: FileCheck,
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-green-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">
                      {item.step}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Personas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Built for Every IPO Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored experiences for all professionals involved in the IPO
              process
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "SME Founders",
                description:
                  "Simplified IPO readiness check and comprehensive dashboard",
                icon: Building2,
                color: "green",
              },
              {
                title: "Merchant Bankers",
                description:
                  "Manage multiple clients and generate detailed reports",
                icon: BarChart3,
                color: "green",
              },
              {
                title: "Company Secretaries",
                description: "Access document workflows and DRHP templates",
                icon: FileText,
                color: "purple",
              },
              {
                title: "Auditors",
                description: "Upload reports and validate compliance gaps",
                icon: Gavel,
                color: "orange",
              },
            ].map((persona, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`w-12 h-12 bg-${persona.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <persona.icon
                      className={`h-6 w-6 text-${persona.color}-600`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {persona.title}
                  </h3>
                  <p className="text-gray-600">{persona.description}</p>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-green-600 hover:text-green-700"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Trusted by SMEs and Experts
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "We went from confusion to clarity in weeks, not months. The platform guided every step of our IPO journey.",
                author: "Ramesh S.",
                role: "CFO, TechStart Solutions",
              },
              {
                quote:
                  "The automated compliance checks saved us countless hours and helped us identify gaps we would have missed.",
                author: "Priya M.",
                role: "Company Secretary, GreenTech Industries",
              },
              {
                quote:
                  "As a merchant banker, this platform has streamlined our client management and reporting processes significantly.",
                author: "Arjun K.",
                role: "Senior Partner, Capital Advisors",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Start Your IPO Journey Today
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Join hundreds of SMEs who have successfully navigated their IPO
              compliance with our platform
            </p>
            <div className="space-y-4">
              <Link href={"/sign-up"}>
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  Sign Up – It's Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-green-100 text-sm">
                Takes 5 minutes. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-green-400" />
                <span className="text-lg font-bold">Uprez SME</span>
              </div>
              <p className="text-gray-400">
                Simplifying IPO compliance for small and medium enterprises
                across India.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-gray-400">
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Security
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-gray-400">
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-gray-400">
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Compliance
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Uprez SME. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
