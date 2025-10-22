import { motion } from 'framer-motion'
import { Brain, Network, Lightbulb, Target, Sparkles, Flag, Shield, ChevronDown } from 'lucide-react'
import Container from '../components/ui/Container'

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function LearnMorePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800" />
        <Container className="relative py-16">
          <motion.div initial="hidden" animate="show" variants={fade} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-400 shadow-lg mb-6">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-poppins-bold text-gradient mb-4">Discover ManthanAI</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              A new way to understand research: AI-driven insights, citation networks, and narrative exploration that bring academic knowledge to life.
            </p>
            <div className="mt-10 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </motion.div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fade} className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">Why ManthanAI</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Research is vast and fragmented. ManthanAI reduces noise and reveals patterns, so you can move from reading to understanding—fast.
            </p>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Brain, title: 'Understanding at Speed', desc: 'AI summaries, strengths/limitations, and future directions distilled clearly.' },
              { icon: Network, title: 'Connected Knowledge', desc: 'Interactive citation mapping that surfaces related work and hidden links.' },
              { icon: Lightbulb, title: 'From Insight to Impact', desc: 'Research gaps and cross-domain ideas to inspire the next breakthrough.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.05 }} variants={fade} className="rounded-xl p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative">
        <Container className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-400 flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">Mission & Vision</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We want every researcher to see the bigger picture. Our mission is to democratize deep understanding of literature and accelerate discovery.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Our vision is a future where navigating scientific progress feels intuitive—where insights, influences, and opportunities are visible at a glance.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} className="rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Brain, label: 'AI Summarization' },
                  { icon: Network, label: 'Citation Graphs' },
                  { icon: Lightbulb, label: 'Research Gaps' },
                  { icon: Shield, label: 'Quality Signals' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-white/70 dark:bg-gray-800/60 flex items-center justify-center shadow">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">The Idea & Need</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Reading more doesn’t always mean knowing more. ManthanAI turns papers into patterns—so teams can collaborate, decide, and innovate faster.
            </p>
          </motion.div>
          <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[ 
              { title: 'Problem Statement', points: ['Information overload across fields', 'Hidden connections remain invisible', 'Time-consuming synthesis'] },
              { title: 'Our Approach', points: ['Unified analysis across sources', 'Network-first exploration', 'Guided insights and next steps'] },
            ].map((card, i) => (
              <motion.div key={card.title} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.05 }} variants={fade} className="rounded-xl p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                <ul className="space-y-2">
                  {card.points.map(p => (
                    <li key={p} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative">
        <Container className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-400 flex items-center justify-center mb-6 shadow-lg">
                <Flag className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">How We Stand Apart</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">From day one, ManthanAI is designed for clarity and connection, not just extraction.</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500" /><span>Network-native exploration and storytelling</span></li>
                <li className="flex items-start space-x-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500" /><span>Discovery workflows that evolve with your interests</span></li>
                <li className="flex items-start space-x-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500" /><span>Design system focused on accessibility and flow</span></li>
              </ul>
            </motion.div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} className="rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-700 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Long-Term Goals</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  To become the layer where knowledge connects—bridging fields, teams, and generations of ideas through intelligent context and humane design.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="bg-gradient-to-r from-primary-700 to-primary-500">
        <Container className="py-12 md:py-16 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">Ready to Experience ManthanAI?</h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-8">Explore papers, build understanding, and uncover opportunities with a platform built for modern research.</p>
            <a href="/" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">Start Analyzing</a>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
