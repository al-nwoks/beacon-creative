'use client'

import { HeroIllustration } from '@/components/home/HeroIllustration'
import Button from '@/components/ui/Button'
import { ArrowRight, Briefcase, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link'



export default function Home() {
  return (
    <>
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
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mb-6">
                &ldquo;B3ACON helped me find my dream clients. The platform is intuitive and the community is supportive. I've grown my freelance income by 150% in just 6 months!&rdquo;
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
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mb-6">
                &ldquo;As a client, I've found exceptional talent on B3ACON. The quality of work has exceeded my expectations, and the platform makes collaboration seamless.&rdquo;
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
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
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

    </>
  )
}
