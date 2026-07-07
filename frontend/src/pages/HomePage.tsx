import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import '../Styles/Home.css';

interface Product {
  productId: number;
  productName: string;
  price: number;
  alt_url: string;
}

interface Category {
  id: number;
  name: string;
}

const LazyImage = React.lazy(() => import('../LazyImage'));


export function HomePage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 63, name: 'Suits' },
    { id: 64, name: 'Gloves' },
    { id: 65, name: 'Hats' },
    { id: 66, name: 'Sweatshirts' },
    { id: 67, name: 'Pants' },
    { id: 68, name: 'Jackets' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>(''); // Başlangıçta boş
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState<string | null>(''); // Başlangıçta boş bir değer


  
  // API Call function
  const fetchProducts = async () => {
    try {
      const categoryQuery = selectedCategory ? `&categoryIds=${selectedCategory}` : '';
      const searchQuery = searchTerm ? `&search=${searchTerm}` : '';
      const genderQuery = selectedGender ? `&gender=${selectedGender}` : '';
      const orderQuery = order ? `&order=${order}` : ''; 

      console.log('API URL:', `https://localhost:7192/api/Product/UltimateSelect?${genderQuery}${categoryQuery}${searchQuery}${orderQuery}`);

      const response = await axios.get<Product[]>(`https://localhost:7192/api/Product/UltimateSelect?${genderQuery}${categoryQuery}${searchQuery}${orderQuery}`);
      setProductList(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Initial fetch on load
  }, [selectedCategory, selectedGender, order]); // add Order into dependency array

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(prevCategoryId => prevCategoryId === categoryId ? null : categoryId);
  };

  const handleSearchClick = () => {
    fetchProducts(); // Fetch products only when the search button is clicked
  };

  const handleGenderChange = (gender: string) => {
    if (selectedGender === gender) {
      setSelectedGender(''); // Deactivate the button if it's already active
    } else {
      setSelectedGender(gender); // Activate the button if it's not already active
    }
  };
  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrder = e.target.value;
    setOrder(selectedOrder); 
  };

  return (
    <div className="homepage">
      <h1>E-COMMERCE
      SALES WEBSITE</h1>

      <div className="gender-filter">
  <button onClick={() => handleGenderChange('Female')} className={selectedGender === 'Female' ? 'active' : ''}>
    Female
  </button>
  <button onClick={() => handleGenderChange('Male')} className={selectedGender === 'Male' ? 'active' : ''}>
    Male
  </button>
  <button onClick={() => handleGenderChange('Unisex')} className={selectedGender === 'Unisex' ? 'active' : ''}>
    Unisex
  </button>
</div>
      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
          >
            {category.name} {selectedCategory === category.id }
          </button>
        ))}
      </div>

      {/* Order By (Dropdown for Ascending, Descending, Alphabetical) */}
      <div className="order-filter">
        <select
          value={order || ""} 
          onChange={handleOrderChange} 
        >
          <option value="">Sort by</option>
          <option value="Asc">Ascending</option>
          <option value="Desc">Descending</option>
          <option value="Alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>

      {/* Product List */}
      <div className="product-list">
        {productList.map((product) => (
          <Link key={product.productId} to={`/product-details/${product.productId}`} className="product-card">
            <Suspense fallback={<div>Loading Image...</div>}>
              <LazyImage src={process.env.PUBLIC_URL + '/' + product.alt_url} alt={product.productName} />
            </Suspense>
            <div className="product-info">
              <h3>{product.productName}</h3>
              <p className="product-price">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
