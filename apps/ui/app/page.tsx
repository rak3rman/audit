import { UploadCard } from "@/components/upload-card"
import { Button } from "@/components/ui/button"
import { History, Zap, Shield, Target, CheckCircle, Star, ArrowRight, DollarSign, FileText, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background antialiased">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Clara Medical</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/history">
              <Button size="sm" className="flex items-center gap-2 text-sm font-medium">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Trust Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20">
                <Star className="h-4 w-4 fill-current" />
                Trusted by 0 patients nationwide!
              </div>
              
              {/* Main Headline */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
                Stop Overpaying
                <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Medical Bills
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="mx-auto mb-10 max-w-3xl text-lg text-muted-foreground sm:text-xl lg:text-2xl">
                Advanced AI-powered analysis that identifies overcharges, detects coding errors, 
                and generates professional negotiation strategies to save you thousands.
              </p>

              {/* CTA Buttons */}
              <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg">
                  Start Your Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-medium">
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">No Hidden Fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="relative bg-muted/30 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Upload Your Medical Bill
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Simply upload your bill and let our AI analyze it in seconds
              </p>
            </div>
            <UploadCard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful Features That Save You Money
            </h2>
            <p className="text-lg text-muted-foreground">
              Our advanced technology identifies issues that most people miss
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Feature Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-semibold tracking-tight">Identify Overcharges</h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Compare your charges against market rates and insurance allowances with surgical precision. 
                We identify overcharges that could save you hundreds or thousands.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>Market rate comparison</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>Insurance allowance analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>Regional pricing data</span>
                </li>
              </ul>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/50 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/10 to-accent/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mb-4 text-xl font-semibold tracking-tight">Detect Code Errors</h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Advanced algorithms identify incorrect medical codes and suggest proper billing corrections. 
                Coding errors are a common cause of overcharges.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>ICD-10 code validation</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>CPT code verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>Duplicate charge detection</span>
                </li>
              </ul>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:border-chart-2/50 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-2/10 to-chart-2/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Shield className="h-8 w-8 text-chart-2" />
              </div>
              <h3 className="mb-4 text-xl font-semibold tracking-tight">Generate Negotiations</h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Professional negotiation tools backed by evidence and comprehensive pricing data. 
                Get the leverage you need to reduce your bill.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>Evidence-based arguments</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>Professional templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>Follow-up strategies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-primary/5 to-primary/10 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary sm:text-4xl">$2.4M</div>
              <div className="text-sm font-medium text-muted-foreground">Total Savings</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary sm:text-4xl">10K+</div>
              <div className="text-sm font-medium text-muted-foreground">Bills Analyzed</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary sm:text-4xl">94%</div>
              <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary sm:text-4xl">4.9★</div>
              <div className="text-sm font-medium text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get your analysis in three simple steps
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
                1
              </div>
              <h3 className="mb-4 text-xl font-semibold tracking-tight">Upload Your Bill</h3>
              <p className="text-muted-foreground">
                Simply upload a photo or PDF of your medical bill. Our system accepts all common formats.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
                2
              </div>
              <h3 className="mb-4 text-xl font-semibold tracking-tight">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes your bill in seconds, identifying overcharges and coding errors.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
                3
              </div>
              <h3 className="mb-4 text-xl font-semibold tracking-tight">Get Results</h3>
              <p className="text-muted-foreground">
                Receive a detailed report with findings and professional negotiation strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-primary to-primary/90 py-20 sm:py-24 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Save Money on Your Medical Bills?
            </h2>
            <p className="mb-8 text-lg opacity-90 sm:text-xl">
              Join thousands of patients who have already saved money with our analysis
            </p>
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold shadow-lg">
              Start Your Free Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">
                Secure • HIPAA Compliant • Confidential
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Clara Medical. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
