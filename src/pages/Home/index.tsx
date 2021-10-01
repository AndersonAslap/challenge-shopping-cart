import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {

    switch(product.id) {
      case 1:
        sumAmount = {...sumAmount, 1: product.amount}
        break;

      case 2:
        sumAmount = {...sumAmount, 2: product.amount}
        break;

      case 3:
        sumAmount = {...sumAmount, 3: product.amount}
        break;

      case 4:
        sumAmount = {...sumAmount, 4: product.amount}
        break;
      
      case 5:
        sumAmount = {...sumAmount, 5: product.amount}
        break;
      
      case 6:
        sumAmount = {...sumAmount, 6: product.amount}
        break;
    }

    return sumAmount

  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      await axios.get('http://localhost:3333/products')
        .then(response => setProducts(response.data))
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>

      {products.map( product => 
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>R$ {product.price}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
          
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      )}

      
    </ProductList>
  );
};

export default Home;
