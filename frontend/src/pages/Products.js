import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  padding: 20px 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-width: 250px;
`;

const Select = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const CardImage = styled.div`
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled(Link)`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
  
  &:hover {
    color: #667eea;
  }
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
`;

const Stock = styled.span`
  font-size: 12px;
  color: ${props => props.low ? '#e74c3c' : '#27ae60'};
  background: ${props => props.low ? '#fdeaea' : '#eafaf1'};
  padding: 4px 8px;
  border-radius: 4px;
`;

const Category = styled.span`
  font-size: 12px;
  color: #888;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  display: inline-block;
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
`;

const PageButton = styled.button`
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/meta/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      params.append('page', filters.page);
      params.append('limit', filters.limit);
      
      const response = await api.get(`/products?${params}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleCategoryChange = (e) => {
    setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (loading && products.length === 0) {
    return <Loading>Loading products...</Loading>;
  }

  return (
    <Container>
      <Header>
        <Title>Products</Title>
        <Controls>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearch}
          />
          <Select value={filters.category} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </Controls>
      </Header>

      <Grid>
        {products.map(product => (
          <Card key={product.id}>
            <CardImage>📦</CardImage>
            <CardContent>
              <Category>{product.category}</Category>
              <CardTitle to={`/products/${product.id}`}>
                {product.name}
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
              <CardFooter>
                <Price>${product.price.toFixed(2)}</Price>
                <Stock low={product.stock < 10}>
                  {product.stock} in stock
                </Stock>
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </Grid>

      {pagination.pages > 1 && (
        <Pagination>
          <PageButton 
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
          >
            Previous
          </PageButton>
          
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
            <PageButton
              key={page}
              active={page === filters.page}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PageButton>
          ))}
          
          <PageButton
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.pages}
          >
            Next
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default Products;
