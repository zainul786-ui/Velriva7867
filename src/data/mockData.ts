import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat_all',
    name: 'All Items',
    slug: 'all',
    icon: 'Grid',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop',
  },
  {
    id: 'cat_headphones',
    name: 'Headphones',
    slug: 'headphones',
    icon: 'Headphones',
    bannerImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop',
  },
  {
    id: 'cat_charger',
    name: 'Chargers',
    slug: 'charger',
    icon: 'Zap',
    bannerImage: 'https://images.unsplash.com/photo-1583863788434-c58253430835?w=800&auto=format&fit=crop',
  },
  {
    id: 'cat_airpods',
    name: 'AirPods',
    slug: 'airpods',
    icon: 'AudioLines',
    bannerImage: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop',
  },
  {
    id: 'cat_watches',
    name: 'Watches',
    slug: 'watches',
    icon: 'Watch',
    bannerImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
  },
  {
    id: 'cat_perfume',
    name: 'Perfumes',
    slug: 'perfume',
    icon: 'Sparkles',
    bannerImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop',
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Velriva Elite ANC Headphones',
    price: 89,
    oldPrice: 179,
    discount: 50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop'
    ],
    category: 'headphones',
    description: 'Symphonic clarity in an beautiful over-ear head shell. Boasts hybrid Active Noise Cancelation up to 45dB, comfortable memory foam earcups, customized touch controls, and a gorgeous heavy-matte leather headband.',
    viewsCount: 3120,
    likesCount: 245,
    ordersCount: 154,
    sizes: ['Standard'],
    colors: [
      { name: 'Matte Black', hex: '#0f172a' },
      { name: 'Pearl Silver', hex: '#cbd5e1' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 24,
    reviews: [
      {
        id: 'rev_1_1',
        userName: 'Amaan Z.',
        rating: 5,
        date: '2026-05-12',
        comment: 'Unbelievable bass and crystal clear audio. ANC blocks out everything!'
      }
    ]
  },
  {
    id: 'prod_2',
    name: 'SonicTune H2 Wireless Headphones',
    price: 45,
    oldPrice: 90,
    discount: 50,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop'
    ],
    category: 'headphones',
    description: 'Ultralight weight stereo wireless headphones with custom tailored 40mm audio drivers. Enjoy comfortable listening sessions with cushion headbands, adjustable tracks and up to 45 hours battery life.',
    viewsCount: 1540,
    likesCount: 120,
    ordersCount: 65,
    sizes: ['Standard'],
    colors: [
      { name: 'Navy Blue', hex: '#1e3a8a' },
      { name: 'Core Black', hex: '#000000' }
    ],
    isFeatured: false,
    isTrending: true,
    isFlashSale: true,
    stock: 45,
    reviews: []
  },
  {
    id: 'prod_3',
    name: 'Velriva SuperFast 65W GaN Charger',
    price: 25,
    oldPrice: 50,
    discount: 50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1583863788434-c58253430835?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583863788434-c58253430835?w=600&auto=format&fit=crop'
    ],
    category: 'charger',
    description: 'Engineered with premium Gallium Nitride (GaN) semiconductor architecture. Delivers safe 65W laptop-grade Power Delivery throughput in an ultracompact pocket chassis. Features dual USB-C ports.',
    viewsCount: 4210,
    likesCount: 512,
    ordersCount: 389,
    sizes: ['US Plug', 'EU Plug', 'UK Plug'],
    colors: [
      { name: 'Glacier White', hex: '#f8fafc' },
      { name: 'Stealth Black', hex: '#1e293b' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 120,
    reviews: [
      {
        id: 'rev_3_1',
        userName: 'Rakesh S.',
        rating: 5,
        date: '2026-05-20',
        comment: 'Launches extremely fast charging on my phone. Highly recommend this GaN block!'
      }
    ]
  },
  {
    id: 'prod_4',
    name: 'MagReady 3-in-1 Standing Wireless Charger',
    price: 35,
    oldPrice: 70,
    discount: 50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&auto=format&fit=crop'
    ],
    category: 'charger',
    description: 'Declutter your workspace aesthetic. Streamlined magnetic charging plate bracket that charges your smart phone, AirPods case, and smartwatch simultaneously at maximum Qi power speed.',
    viewsCount: 2210,
    likesCount: 189,
    ordersCount: 94,
    sizes: ['Standard'],
    colors: [
      { name: 'Minimalist Black', hex: '#1e293b' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: true,
    stock: 18,
    reviews: []
  },
  {
    id: 'prod_5',
    name: 'Velriva AirBuds Pro Active',
    price: 59,
    oldPrice: 120,
    discount: 50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588449668338-d13417f16ec7?w=600&auto=format&fit=crop'
    ],
    category: 'airpods',
    description: 'Immersive true wireless spatial audio AirPods with adaptive noise cancellation. Up to 6 hours continuous battery run cycle and beautiful sleek case. Fits securely for running and gym.',
    viewsCount: 5410,
    likesCount: 651,
    ordersCount: 423,
    sizes: ['Standard'],
    colors: [
      { name: 'Gloss White', hex: '#ffffff' },
      { name: 'Pro Matte Black', hex: '#090d16' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: true,
    stock: 35,
    reviews: [
      {
        id: 'rev_5_1',
        userName: 'Zain A.',
        rating: 5,
        date: '2026-05-15',
        comment: 'Unpack was gorgeous premium feel, bass signatures are out of this world.'
      }
    ]
  },
  {
    id: 'prod_6',
    name: 'Signature Luxe Gold AirPods',
    price: 79,
    oldPrice: 149,
    discount: 47,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1588449668338-d13417f16ec7?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588449668338-d13417f16ec7?w=600&auto=format&fit=crop'
    ],
    category: 'airpods',
    description: 'Uncompromising luxury standard statement. Fully customized metallic gold premium casing with true wireless stereo Bluetooth 5.3 connection chips for high stability streams.',
    viewsCount: 1980,
    likesCount: 312,
    ordersCount: 110,
    sizes: ['Standard'],
    colors: [
      { name: 'Champagne Gold', hex: '#eab308' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    stock: 9,
    reviews: []
  },
  {
    id: 'prod_7',
    name: 'Aero Chrono Minimalist Gold Watch',
    price: 120,
    oldPrice: 240,
    discount: 50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop'
    ],
    category: 'watches',
    description: 'An immaculate aesthetic statement. Crafted with high quality brushed gold casings, custom Japanese quartz movement mechanisms, and scratch resistant double-dome crystal glass.',
    viewsCount: 2980,
    likesCount: 425,
    ordersCount: 184,
    sizes: ['38mm', '42mm'],
    colors: [
      { name: 'Brushed Gold', hex: '#ca8a04' },
      { name: 'Slate Gray', hex: '#475569' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 14,
    reviews: [
      {
        id: 'rev_7_1',
        userName: 'Vikram P.',
        rating: 5,
        date: '2026-05-18',
        comment: 'Looks far more expensive than it is. Clean lines and solid links.'
      }
    ]
  },
  {
    id: 'prod_8',
    name: 'Force AMOLED Active Smartwatch',
    price: 85,
    oldPrice: 160,
    discount: 47,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop'
    ],
    category: 'watches',
    description: 'Designed for high performance. Features bright 1.43 inch AMOLED touch screens, live heartbeat blood oxygen trackers, 24 distinct athletic sports monitors and water resistant seals.',
    viewsCount: 3410,
    likesCount: 289,
    ordersCount: 151,
    sizes: ['One Size'],
    colors: [
      { name: 'Space Black', hex: '#0f172a' },
      { name: 'Aviation Orange', hex: '#f97316' }
    ],
    isFeatured: false,
    isTrending: true,
    isFlashSale: true,
    stock: 22,
    reviews: []
  },
  {
    id: 'prod_9',
    name: 'Signature Noire Elixir Perfume',
    price: 95,
    oldPrice: 160,
    discount: 41,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop'
    ],
    category: 'perfume',
    description: 'Immersive olfactory landscape. Heavy concentration Eau de Parfum featuring Italian bergamot zest, smoldering amberwoods, and cedar-leaf extracts for outstanding longevity sillage.',
    viewsCount: 2120,
    likesCount: 198,
    ordersCount: 88,
    sizes: ['50ml', '100ml'],
    colors: [
      { name: 'Clear Blue', hex: '#bae6fd' }
    ],
    isFeatured: true,
    isTrending: false,
    isFlashSale: false,
    stock: 19,
    reviews: [
      {
        id: 'rev_9_1',
        userName: 'Akil M.',
        rating: 5,
        date: '2026-05-19',
        comment: 'Compliments getter. Stays active on clothing for two straight days.'
      }
    ]
  },
  {
    id: 'prod_10',
    name: 'Velriva Oud Mystic Perfume',
    price: 110,
    oldPrice: 200,
    discount: 45,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop'
    ],
    category: 'perfume',
    description: 'Rich luxurious vanilla, absolute warm kardamom, and charred premium agarwood essence formulation. Strikingly sensual and designed to impress on fine dining occasions.',
    viewsCount: 1890,
    likesCount: 243,
    ordersCount: 71,
    sizes: ['100ml'],
    colors: [
      { name: 'Oud Gold', hex: '#ca8a04' }
    ],
    isFeatured: false,
    isTrending: true,
    isFlashSale: false,
    stock: 11,
    reviews: []
  }
];
