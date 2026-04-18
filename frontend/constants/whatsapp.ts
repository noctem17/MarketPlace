import { Linking } from 'react-native';
import type { Store, Product } from './types';


export function openWhatsApp(store: Store, product?: Product): void {
  let message: string;

  if (product) {
    message =
      `Hola ${store.ownerName}! Estoy en mercado distrital y me interesa ` +
      `"${product.name}" ($${product.price.toLocaleString('es-CO')}). ` +
      `${product.description} ¿Está disponible?`;
  } else {
    message =
      `Hola ${store.ownerName}! me interesa tus productos "${store.name}" en mercado distrital. ` +
      `¿Tienes algo disponible?`;
  }

  const url = `whatsapp://send?phone=${store.whatsapp}&text=${encodeURIComponent(message)}`;
  Linking.openURL(url);
}