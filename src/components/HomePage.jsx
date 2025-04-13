
import React from 'react';

const HomePage = () => {
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen'];
  const [currentCategory, setCurrentCategory] = React.useState(0);

  const nextCategory = () => {
    setCurrentCategory((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentCategory((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <main>
      <section>
        <h2>About ShopEase</h2>
        <p>ShopEase is your one-stop online store for the latest and greatest products in tech, fashion, and home essentials.</p>
        <img 
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500" 
          alt="Online Shopping" 
          width="500"
        />
      </section>
      <section>
        <h2>Featured Categories</h2>
        <div className="category-carousel">
          <h3>{categories[currentCategory]}</h3>
          <p>Explore our amazing {categories[currentCategory].toLowerCase()} collection with the best deals!</p>
          <button onClick={prevCategory}>← Previous</button>
          <button onClick={nextCategory}>Next →</button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;