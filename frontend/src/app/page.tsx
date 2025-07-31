import { HeroIllustration } from '@/components/home/HeroIllustration'
import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-beacon-blue">
              B3ACON
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-neutral-700 hover:text-beacon-blue">
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
      <section className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900">
                Connect with top creative talent and clients
              </h1>
              <p className="text-xl text-neutral-700 mb-8 max-w-2xl">
                B3ACON helps creative professionals find great projects and clients discover amazing talent. All in one seamless platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/register?type=client">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto bg-beacon-purple hover:bg-beacon-purple-dark">
                    Hire Creatives
                  </Button>
                </Link>
                <Link href="/register?type=creative">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto border-beacon-purple text-beacon-purple hover:bg-beacon-purple-light/10">
                    Find Work
                  </Button>
                </Link>
              </div>

              {/* Demo Link */}
              <div className="mt-8">
                <Link href="/creative-dashboard" className="inline-flex items-center text-beacon-blue hover:underline">
                  View Creative Dashboard Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <HeroIllustration className="w-full max-w-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How B3ACON works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-beacon-blue-light/20 rounded-full flex items-center justify-center text-beacon-blue mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Post a project</h3>
              <p className="text-neutral-700">
                Describe your project, set your budget, and specify the skills you need.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-beacon-blue-light/20 rounded-full flex items-center justify-center text-beacon-blue mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Review applications</h3>
              <p className="text-neutral-700">
                Receive applications from qualified creative professionals and choose the best fit.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-beacon-blue-light/20 rounded-full flex items-center justify-center text-beacon-blue mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaborate & pay</h3>
              <p className="text-neutral-700">
                Work together in our secure workspace and release payments when milestones are completed.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/how-it-works" className="inline-flex items-center text-beacon-blue hover:underline">
              Learn more about how it works
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-beacon-purple text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of creative professionals and clients already using B3ACON to connect, collaborate, and create amazing work.
          </p>
          <Link href="/register">
            <Button variant="primary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
              Create your free account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">B3ACON</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2">
                <li><Link href="/how-to-hire" className="hover:text-white">How to Hire</Link></li>
                <li><Link href="/talent-marketplace" className="hover:text-white">Talent Marketplace</Link></li>
                <li><Link href="/client-success-stories" className="hover:text-white">Success Stories</Link></li>
                <li><Link href="/client-resources" className="hover:text-white">Resources</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Creatives</h3>
              <ul className="space-y-2">
                <li><Link href="/find-work" className="hover:text-white">Find Work</Link></li>
                <li><Link href="/creative-resources" className="hover:text-white">Resources</Link></li>
                <li><Link href="/community" className="hover:text-white">Community</Link></li>
                <li><Link href="/success-stories" className="hover:text-white">Success Stories</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
                <li><Link href="/accessibility" className="hover:text-white">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} B3ACON Creative Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
