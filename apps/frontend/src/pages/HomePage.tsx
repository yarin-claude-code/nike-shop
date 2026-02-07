import HeroSection from '../components/home/HeroSection';
import PopularProducts from '../components/home/PopularProducts';
import AboutSection from '../components/home/AboutSection';
import FeatureProduct from '../components/home/FeatureProduct';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <PopularProducts />
      <AboutSection />
      <FeatureProduct />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
