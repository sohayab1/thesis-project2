import { Card } from "@/components/ui/card";

export function NewsSection() {
  const news = [
    {
      id: 1,
      title: "New Cybersecurity Measures Implemented",
      description: "Government introduces new cybersecurity protocols to protect citizens.",
      date: "2024-02-16",
    },
    {
      id: 2,
      title: "Online Safety Awareness Campaign",
      description: "National campaign launched to promote safer internet practices.",
      date: "2024-02-15",
    },
    {
      id: 3,
      title: "Cybercrime Prevention Tips",
      description: "Expert advice on protecting yourself from online threats.",
      date: "2024-02-14",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <time className="text-sm text-gray-500">{item.date}</time>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}