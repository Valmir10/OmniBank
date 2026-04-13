export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="animate-fade-in text-center">
        <h1 className="text-6xl font-bold mb-4">
          <span className="gradient-text">OmniBank</span>
        </h1>
        <p className="text-omni-muted text-xl mb-8 max-w-md">
          Your modern financial portal. Secure, intelligent, and always
          connected.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full animate-slide-up">
        <FeatureCard
          title="Open Banking"
          description="Aggregate all your accounts in one place with PSD2 compliance"
        />
        <FeatureCard
          title="Smart Budgeting"
          description="Real-time alerts when you're approaching your spending limits"
        />
        <FeatureCard
          title="Crypto Exchange"
          description="Seamlessly swap between SEK and cryptocurrencies"
        />
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="card group cursor-pointer">
      <h3 className="text-lg font-semibold text-omni-text mb-2 group-hover:text-omni-accent transition-colors">
        {title}
      </h3>
      <p className="text-omni-muted text-sm">{description}</p>
    </div>
  );
}
