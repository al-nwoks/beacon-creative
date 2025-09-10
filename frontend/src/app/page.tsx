import Button from '@/components/ui/Button'
import { ArrowRight, Briefcase, Search, Users } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-beacon-purple" />,
      title: 'Find Your Perfect Gig',
      description: 'Browse thousands of gigs from top clients and find opportunities that match your skills.'
    },
    {
      icon: <Briefcase className="h-8 w-8 text-beacon-purple" />,
      title: 'Post Gigs Easily',
      description: 'Create detailed gig postings and find the perfect creative talent for your gigs.'
    },
    {
      icon: <Users className="h-8 w-8 text-beacon-purple" />,
      title: 'Connect & Collaborate',
      description: 'Work directly with clients and creatives through our secure messaging platform.'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Active Gigs' },
    { value: '50,000+', label: 'Creative Professionals' },
    { value: '$50M+', label: 'Paid to Creatives' },
    { value: '95%', label: 'Client Satisfaction' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-beacon-purple to-beacon-blue text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect Creatives with Opportunities
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-purple-100">
              The platform where creative talent meets exciting gigs and clients find their perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="primary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
                  Get Started
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-neutral-600">
              Our platform provides all the tools and features to help creatives find gigs and clients manage gigs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200 text-center">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-beacon-purple mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-neutral-300 mb-10">
              Join thousands of creatives and clients who are already finding success on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=creative">
                <Button variant="primary" size="lg" className="bg-beacon-purple hover:bg-beacon-purple-dark">
                  I'm a Creative
                </Button>
              </Link>
              <Link href="/register?role=client">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  I'm a Client
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
