import { useState, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView,
  StyleSheet, Modal, Animated, PanResponder, Dimensions,
} from 'react-native';
import type { Store, Product } from '../constants/types';
import { openWhatsApp } from '../constants/whatsapp';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const fmt = (n: number) => `$${n.toLocaleString('es-CO')}`;

interface Props {
  store: Store;
  onClose: () => void;
}

export default function VendorModal({ store, onClose }: Props) {
  const [tab, setTab] = useState<'productos' | 'info'>('productos');
  const [selected, setSelected] = useState<Product | null>(null);

  // Animación para arrastrar el modal hacia abajo y cerrarlo
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100) {
          // Si arrastró más de 100px → cerrar con animación
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // Si no llegó al límite → volver a posición original
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      {/* Fondo oscuro — clic afuera cierra */}
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose} />

      <Animated.View style={[s.sheet, { transform: [{ translateY }] }]}>

        {/* Handle de arrastre */}
        <View {...panResponder.panHandlers} style={s.handleArea}>
          <View style={s.handle} />
        </View>

        {/* Cabecera del vendedor */}
        <View style={s.header}>
          <Image source={{ uri: store.avatarUrl }} style={s.avatar} />
          <View style={s.headerInfo}>
            <View style={s.headerRow}>
              <Text style={s.storeName}>{store.name}</Text>
              <View style={[s.badge, { backgroundColor: store.color + '22' }]}>
                <Text style={[s.badgeText, { color: store.color }]}>✓ Verificado</Text>
              </View>
            </View>
            <Text style={s.ownerName}>{store.ownerName} · {store.category}</Text>
            <View style={s.stars}>
              {[1,2,3,4,5].map(i => (
                <Text key={i} style={{ color: i <= Math.floor(store.rating) ? '#fbbf24' : '#333', fontSize: 12 }}>★</Text>
              ))}
              <Text style={s.ratingText}>{store.rating} ({store.reviews})</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Text style={s.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={s.tabs}>
          {(['productos', 'info'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[s.tab, tab === t && { backgroundColor: store.color }]}
              onPress={() => setTab(t)}
            >
              <Text style={[s.tabText, tab === t && { color: 'white', fontWeight: '700' }]}>
                {t === 'productos' ? ` Productos (${store.products.length})` : ' Info'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenido */}
        <ScrollView style={s.content} showsVerticalScrollIndicator={false}>

          {tab === 'productos' && store.products.map(product => {
            const isSel = selected?.id === product.id;
            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => setSelected(isSel ? null : product)}
                style={[s.productCard, isSel && { borderColor: store.color, backgroundColor: store.color + '11' }]}
              >
                <View style={s.productRow}>
                  <Image source={{ uri: product.imageUrl }} style={s.productImage} />
                  <View style={s.productInfo}>
                    <View style={s.productTitleRow}>
                      <Text style={s.productName}>{product.name}</Text>
                      <View style={[s.tag, { backgroundColor: product.tagColor + '22' }]}>
                        <Text style={[s.tagText, { color: product.tagColor }]}>{product.tag}</Text>
                      </View>
                    </View>
                    <Text style={s.productDesc} numberOfLines={1}>{product.description}</Text>
                    <View style={s.productBottom}>
                      <Text style={[s.price, { color: store.color }]}>{fmt(product.price)}</Text>
                      <Text style={[s.stock, { color: product.stock < 8 ? '#f59e0b' : '#10b981' }]}>
                        {product.stock < 8 ? ` Solo ${product.stock}` : `✓ ${product.stock} disp.`}
                      </Text>
                    </View>
                  </View>
                  <Text style={[s.arrow, { color: isSel ? store.color : '#444' }]}>›</Text>
                </View>

                {/* Detalle expandido */}
                {isSel && (
                  <View style={s.expanded}>
                    {product.colors && (
                      <View style={s.colorsRow}>
                        <Text style={s.colorsLabel}>Colores: </Text>
                        {product.colors.map((c, i) => (
                          <View key={i} style={[s.colorDot, { backgroundColor: c }]} />
                        ))}
                      </View>
                    )}
                    <TouchableOpacity
                      style={s.waBtn}
                      onPress={() => openWhatsApp(store, product)}
                    >
                      <Text style={s.waBtnText}> Preguntar por WhatsApp</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {tab === 'info' && (
            <View style={s.infoTab}>
              <View style={s.bioCard}>
                <Text style={s.sectionLabel}>SOBRE LA TIENDA</Text>
                <Text style={s.bioText}>{store.bio}</Text>
              </View>
              {[
                { icon: 'poner imagen', label: 'Dirección', value: store.address },
                { icon: 'poner imagen', label: 'Horario', value: store.schedule },
                { icon: 'telefono.jpg o lo que sea', label: 'Teléfono', value: store.phone },
              ].map(({ icon, label, value }) => (
                <View key={label} style={s.infoCard}>
                  <View style={[s.infoIcon, { backgroundColor: store.color + '1a' }]}>
                    <Text style={{ fontSize: 18 }}>{icon}</Text>
                  </View>
                  <View>
                    <Text style={s.infoLabel}>{label.toUpperCase()}</Text>
                    <Text style={s.infoValue}>{value}</Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={s.waBtn} onPress={() => openWhatsApp(store)}>
                <Text style={s.waBtnText}> Escribir a {store.ownerName}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0f0f1f',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 2, borderTopColor: '#e94560',
    maxHeight: '80%',
  },
  handleArea: { paddingTop: 10, alignItems: 'center', paddingBottom: 4 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 },
  avatar: { width: 60, height: 60, borderRadius: 16, borderWidth: 2, borderColor: '#e94560' },
  headerInfo: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  storeName: { color: 'white', fontWeight: '800', fontSize: 16 },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  ownerName: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  stars: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 2 },
  ratingText: { color: '#fbbf24', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
  tabs: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, marginBottom: 4 },
  tab: { flex: 1, borderRadius: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  tabText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  content: { paddingHorizontal: 16 },
  productCard: { borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 10, overflow: 'hidden' },
  productRow: { flexDirection: 'row', padding: 12, alignItems: 'center', gap: 12 },
  productImage: { width: 64, height: 64, borderRadius: 12 },
  productInfo: { flex: 1 },
  productTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  productName: { color: 'white', fontWeight: '700', fontSize: 14 },
  tag: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  tagText: { fontSize: 10, fontWeight: '700' },
  productDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 },
  productBottom: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  price: { fontWeight: '800', fontSize: 16 },
  stock: { fontSize: 11, fontWeight: '600' },
  arrow: { fontSize: 20 },
  expanded: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', padding: 12 },
  colorsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  colorsLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  colorDot: { width: 20, height: 20, borderRadius: 10, marginRight: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  waBtn: { backgroundColor: '#25d366', borderRadius: 14, padding: 14, alignItems: 'center' },
  waBtnText: { color: 'white', fontWeight: '800', fontSize: 15 },
  infoTab: { gap: 10, paddingTop: 8 },
  bioCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14 },
  sectionLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  bioText: { color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12 },
  infoIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: '600' },
  infoValue: { color: 'white', fontSize: 13, marginTop: 1 },
});