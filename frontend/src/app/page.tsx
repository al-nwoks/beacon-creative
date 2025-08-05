'use client'

import { HeroIllustration } from '@/components/home/HeroIllustration'
import Button from '@/components/ui/Button'
import { ArrowRight, Briefcase, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-beacon-purple">
              B3ACON
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/creatives" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
              For Creatives
            </Link>
            <Link href="/projects" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
              For Clients
            </Link>
            <Link href="/how-it-works" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
              How It Works
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium hidden sm:block">
              Log in
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900 leading-tight">
                Connect with top creative talent and clients
              </h1>
              <p className="text-xl text-neutral-700 mb-8 max-w-2xl mx-auto lg:mx-0">
                B3ACON helps creative professionals find great projects and clients discover amazing talent. All in one seamless platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
                <Link href="/register?type=client">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Hire Creatives
                  </Button>
                </Link>
                <Link href="/register?type=creative">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Find Work
                  </Button>
                </Link>
              </div>

              {/* Demo Link */}
              <div className="flex justify-center lg:justify-start">
                <Link href="/creative-dashboard" className="inline-flex items-center text-beacon-purple hover:underline font-medium">
                  View Creative Dashboard Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-2xl">
                <HeroIllustration className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">How B3ACON Works</h2>
            <p className="text-xl text-neutral-700">
              Our platform streamlines the creative hiring process, making it easy for clients to find talent and for creatives to showcase their skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mb-6">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Post a Project</h3>
              <p className="text-neutral-700 mb-4">
                Describe your project, set your budget, and specify the skills you need.
              </p>
              <Link href="/how-it-works" className="text-beacon-purple hover:underline font-medium inline-flex items-center">
                Learn more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Review Applications</h3>
              <p className="text-neutral-700 mb-4">
                Receive applications from qualified creative professionals and choose the best fit.
              </p>
              <Link href="/how-it-works" className="text-beacon-purple hover:underline font-medium inline-flex items-center">
                Learn more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Collaborate & Pay</h3>
              <p className="text-neutral-700 mb-4">
                Work together in our secure workspace and release payments when milestones are completed.
              </p>
              <Link href="/how-it-works" className="text-beacon-purple hover:underline font-medium inline-flex items-center">
                Learn more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
              <div className="text-beacon-purple-light">Creative Professionals</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">5K+</div>
              <div className="text-beacon-purple-light">Active Projects</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
              <div className="text-beacon-purple-light">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-beacon-purple-light">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Trusted by Creative Professionals</h2>
            <p className="text-xl text-neutral-700">
              Hear from creatives and clients who have found success through B3ACON.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-neutral-700 mb-6">
                &ldquo;B3ACON helped me find my dream clients. The platform is intuitive and the community is supportive. I&apos;ve grown my freelance income by 150% in just 6 months!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h4 className="font-semibold text-neutral-900">Sarah Johnson</h4>
                  <p className="text-neutral-600">Photographer</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-neutral-700 mb-6">
                &ldquo;As a client, I&apos;ve found exceptional talent on B3ACON. The quality of work has exceeded my expectations, and the platform makes collaboration seamless.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h4 className="font-semibold text-neutral-900">Michael Chen</h4>
                  <p className="text-neutral-600">Marketing Director</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-neutral-700 mb-6">
                &ldquo;The project management tools and secure payment system give me peace of mind. I can focus on creating while B3ACON handles the logistics.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h4 className="font-semibold text-neutral-900">Emma Rodriguez</h4>
                  <p className="text-neutral-600">Graphic Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-12 text-center max-w-4xl mx-auto border border-neutral-200 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">Ready to get started?</h2>
            <p className="text-xl text-neutral-700 mb-8 max-w-2xl mx-auto">
              Join thousands of creative professionals and clients already using B3ACON to connect, collaborate, and create amazing work.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register?type=client">
                <Button variant="primary" size="lg">
                  Hire Creatives
                </Button>
              </Link>
              <Link href="/register?type=creative">
                <Button variant="secondary" size="lg">
                  Find Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-white text-xl font-bold mb-4">B3ACON</h3>
              <p className="mb-4 max-w-xs">
                Connecting creative talent with opportunities worldwide.
              </p>
              <p className="text-sm">
                &copy; {new Date().getFullYear()} B3ACON Creative Connect. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2">
                <li><Link href="/how-to-hire" className="hover:text-white transition-colors">How to Hire</Link></li>
                <li><Link href="/talent-marketplace" className="hover:text-white transition-colors">Talent Marketplace</Link></li>
                <li><Link href="/client-success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                <li><Link href="/client-resources" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Creatives</h3>
              <ul className="space-y-2">
                <li><Link href="/find-work" className="hover:text-white transition-colors">Find Work</Link></li>
                <li><Link href="/creative-resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <ul className="flex flex-wrap justify-center md:justify-start gap-6">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                  <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
