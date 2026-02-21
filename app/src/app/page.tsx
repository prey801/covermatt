import Hero from '@/components/home/Hero';
import CategoryTiles from '@/components/home/CategoryTiles';
import FeaturedDeals from '@/components/home/FeaturedDeals';
import TabbedProducts from '@/components/home/TabbedProducts';
import TrustBanner from '@/components/home/TrustBanner';
import WhyUs from '@/components/home/WhyUs';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <CategoryTiles />
      <FeaturedDeals />
      <TabbedProducts />
      <WhyUs />
    </>
  );
}
