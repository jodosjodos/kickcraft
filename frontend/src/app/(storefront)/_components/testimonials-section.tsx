const TESTIMONIALS = [
  {
    initials: "AM",
    name: "Amina M.",
    location: "Kiyovu, Kigali",
    quote:
      "I was scared to order online — I'd been burnt before with fake Jordans. Kickcraft sent me photos of the actual pair before shipping. Received them in 24 hours. Never going back to the market.",
    highlight: "Legit pair, next-day delivery.",
  },
  {
    initials: "JN",
    name: "Jean-Pierre N.",
    location: "Remera, Kigali",
    quote:
      "The 50/50 MoMo payment is actually genius. I paid half, they confirmed my order, then I paid the rest when the guy showed up at my door. Zero stress. That's how it should work everywhere.",
    highlight: "Paid on delivery, no risk.",
  },
  {
    initials: "GU",
    name: "Grace U.",
    location: "Kimironko, Kigali",
    quote:
      "Ordered New Balance 550s for my graduation. They kept me updated on every step — order confirmed, out for delivery, agent's number included. Felt like I actually mattered as a customer.",
    highlight: "Tracked every step of the way.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-5 md:px-8 border-t border-border bg-surface-elevated">
      <div className="mx-auto max-w-container">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
            Real Customers
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text">
            The Experience Speaks
          </h2>
          <p className="font-body text-sm text-text-muted mt-3 max-w-sm mx-auto">
            We let our customers do the talking. Here&apos;s what they said.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ initials, name, location, quote, highlight }) => (
            <div
              key={name}
              className="flex flex-col bg-surface border border-border rounded p-6 gap-4"
            >
              {/* Quote mark */}
              <span className="font-heading text-5xl font-extrabold text-primary/20 leading-none select-none">
                &ldquo;
              </span>

              <p className="font-body text-sm text-text-muted leading-relaxed -mt-4 flex-1">
                {quote}
              </p>

              {/* Highlight pill */}
              <span className="self-start bg-primary/10 text-primary font-body text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {highlight}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-heading text-xs font-extrabold text-primary uppercase">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-text">
                    {name}
                  </p>
                  <p className="font-body text-[10px] text-text-muted uppercase tracking-wider">
                    {location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
