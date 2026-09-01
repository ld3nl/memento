import type { FaqItem } from "../../lib/content-meta";

export function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-16" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="font-display text-accent mt-10 mb-4 text-2xl italic sm:mt-12 sm:text-3xl"
      >
        Questions people ask
      </h2>
      <dl className="mt-6 space-y-8">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="text-primary font-semibold">{item.question}</dt>
            <dd className="text-secondary mt-2 leading-relaxed">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
