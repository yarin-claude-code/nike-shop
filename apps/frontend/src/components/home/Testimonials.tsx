const testimonials = [
  {
    name: 'Remington',
    text: 'The best shoes I have ever owned. The comfort and quality are unmatched. I have been a loyal customer for years and will continue to be.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Thomson Zarki',
    text: 'Absolutely love the design and fit. These shoes are perfect for both running and casual wear. The customer service is also exceptional.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Sarah Chen',
    text: 'I ordered online and was amazed by how fast the delivery was. The shoes fit perfectly and the quality exceeded my expectations. Highly recommend!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
];

export default function Testimonials(): JSX.Element {
  return (
    <section id="testimonial" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            <span className="text-primary">What Our </span>
            <span className="text-accent">Customer</span>
            <span className="text-primary"> Says</span>
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-surface rounded-3xl p-8 flex flex-col items-center text-center shadow-soft border border-primary-100"
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover mb-6 border-2 border-primary-200"
              />
              <p className="text-primary-500 text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              <p className="text-primary font-bold text-sm">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
