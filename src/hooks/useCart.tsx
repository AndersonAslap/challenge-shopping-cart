import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {

  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {

      let response = await api.get(`http://localhost:3333/products/${productId}`)
      let product = response.data 

      const found = cart.find(product => product.id === productId);

      if (!found) {
        setCart([...cart, {...product, amount:1}])
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, {...product, amount:1}]))
      
      } else {

        let response = await api.get(`http://localhost:3333/stock/${productId}`)
        let stock = response.data

        const productSpecifc = cart.find(product => product.id === productId);
        
        if (productSpecifc) {
          const products = cart.filter(product => product.id !== productId);

          if (productSpecifc.amount+1 <= stock.amount) {
            productSpecifc.amount += 1

            setCart([...products, productSpecifc])
            localStorage.setItem('@RocketShoes:cart', JSON.stringify([...products, productSpecifc]))
          } else {
            toast.error('Quantidade solicitada fora de estoque');
          }
        }
     
      }

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {

      const found = cart.find(product => product.id === productId);

      if (!found) {
        toast.error('Erro na remoção do produto');
        return;
      }

      let cartRemove = cart
      cartRemove = cartRemove.filter(product => product.id !== productId)
      setCart(cartRemove)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartRemove))
      
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {

      if (amount <= 0) {
        return;
      }

      let response = await api.get(`http://localhost:3333/stock/${productId}`)
      let stock = response.data

        const productSpecifc = cart.find(product => product.id === productId);
        
        if (productSpecifc) {
          const products = cart.filter(product => product.id !== productId);

          if (amount <= stock.amount) {
            productSpecifc.amount = amount

            setCart([...products, productSpecifc])
            localStorage.setItem('@RocketShoes:cart', JSON.stringify([...products, productSpecifc]))
          } else {
            toast.error('Quantidade solicitada fora de estoque');
            return;
          }
        }
          
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
