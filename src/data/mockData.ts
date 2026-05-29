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
    id: 'prod_11',
    name: 'Velriva Pro ANC Headphones Max',
    price: 149,
    oldPrice: 299,
    discount: 50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop'
    ],
    category: 'headphones',
    description: 'The pinnacle of over-ear audio engineering. Features titanium composite diaphragms, high-fidelity spatial audio tracking, custom active EQ tuning, and ultra-plush perforated leather cups.',
    viewsCount: 5410,
    likesCount: 612,
    ordersCount: 312,
    sizes: ['Standard'],
    colors: [
      { name: 'Space Gray', hex: '#334155' },
      { name: 'Gold Accent', hex: '#e2e8f0' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 12,
    reviews: []
  },
  {
    id: 'prod_12',
    name: 'StudioBeat Vintage Leather Headphones',
    price: 79,
    oldPrice: 159,
    discount: 50,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop'
    ],
    category: 'headphones',
    description: 'Retro aesthetic meets modern acoustics. Premium calfskin leather casing with hand-stitched detailing, copper accents, and 45mm studio drivers calibrated for crisp highs and deep midranges.',
    viewsCount: 1890,
    likesCount: 194,
    ordersCount: 78,
    sizes: ['Standard'],
    colors: [
      { name: 'Classic Brown', hex: '#78350f' },
      { name: 'Vintage Black', hex: '#1c1917' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    stock: 20,
    reviews: []
  },
  {
    id: 'prod_13',
    name: 'AeroBuds Over-Ear AirFlow Lite',
    price: 39,
    oldPrice: 79,
    discount: 50,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop'
    ],
    category: 'headphones',
    description: 'Designed for minimal weight and max ventilation. Fully breathable mesh headband paired with pressure-relieving foam cups. Engineered for long gaming sessions or desk work.',
    viewsCount: 1250,
    likesCount: 88,
    ordersCount: 41,
    sizes: ['Standard'],
    colors: [
      { name: 'Ice White', hex: '#f1f5f9' },
      { name: 'Neon Green', hex: '#84cc16' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: true,
    stock: 60,
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
    id: 'prod_14',
    name: 'VoltCharge 100W Quad-Port GaN Block',
    price: 49,
    oldPrice: 99,
    discount: 50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop'
    ],
    category: 'charger',
    description: 'The ultimate power brick. Packs 100W of Gallium Nitride efficiency into a highly transportable wall adapter. Supports fast-charging three laptops and one phone concurrently.',
    viewsCount: 3120,
    likesCount: 245,
    ordersCount: 180,
    sizes: ['US Plug', 'UK Plug', 'EU Plug'],
    colors: [
      { name: 'Deep Carbon', hex: '#1e293b' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 54,
    reviews: []
  },
  {
    id: 'prod_15',
    name: 'PowerGrid 20000mAh Ultra-Slim Bank',
    price: 29,
    oldPrice: 59,
    discount: 51,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=600&auto=format&fit=crop'
    ],
    category: 'charger',
    description: 'Huge capacity inside a pocketable, sleek frame. High density lithium polymer core allows charging an iPhone 15 up to 5 times. Features digital battery percentage display array.',
    viewsCount: 2890,
    likesCount: 198,
    ordersCount: 142,
    sizes: ['Standard'],
    colors: [
      { name: 'Carbon Black', hex: '#0f172a' },
      { name: 'Glacier Blue', hex: '#38bdf8' }
    ],
    isFeatured: false,
    isTrending: true,
    isFlashSale: true,
    stock: 90,
    reviews: []
  },
  {
    id: 'prod_16',
    name: 'MagSafe AirVent Intelligent Car Mount',
    price: 19,
    oldPrice: 39,
    discount: 51,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop'
    ],
    category: 'charger',
    description: 'Auto-adjusting magnetic ventilation clamp. Packs an embedded 15W Qi wireless receiver coil that holds iPhones firmly on rough paths and bumpy roads while powering them up.',
    viewsCount: 1740,
    likesCount: 110,
    ordersCount: 89,
    sizes: ['Standard'],
    colors: [
      { name: 'Graphite', hex: '#4b5563' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    stock: 40,
    reviews: []
  },
  {
    id: 'prod_17',
    name: 'MultiStream 4-in-1 Charging Workspace Pad',
    price: 24,
    oldPrice: 49,
    discount: 51,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop'
    ],
    category: 'charger',
    description: 'Charge everything in one elegant spot. Flat lay silicone docking solution powering wireless phone, standard buds, legacy smartwatches, and extra USB accessory port.',
    viewsCount: 1920,
    likesCount: 154,
    ordersCount: 75,
    sizes: ['Standard'],
    colors: [
      { name: 'Minimal Gray', hex: '#9ca3af' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    stock: 32,
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
    id: 'prod_18',
    name: 'AuraFlow Pure Bass Wireless Buds',
    price: 49,
    oldPrice: 99,
    discount: 50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop'
    ],
    category: 'airpods',
    description: 'Custom acoustic signature built around deeply resonant sub-bass. Designed with magnetic snap lock cases, tactile push navigation controls, and clear voice calling microphone array.',
    viewsCount: 2210,
    likesCount: 184,
    ordersCount: 102,
    sizes: ['Standard'],
    colors: [
      { name: 'Midnight Blue', hex: '#1d4ed8' },
      { name: 'Dark Slate', hex: '#1e293b' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 25,
    reviews: []
  },
  {
    id: 'prod_19',
    name: 'HydroPulse Sports Buds IPX8',
    price: 34,
    oldPrice: 69,
    discount: 50,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=600&auto=format&fit=crop'
    ],
    category: 'airpods',
    description: 'Sweatproof and rainproof sport audio system. Wrap ear-hook loop structure prevents falls during jogging, sprinting or muscle exercises. Includes physical action triggers.',
    viewsCount: 1690,
    likesCount: 120,
    ordersCount: 56,
    sizes: ['Standard'],
    colors: [
      { name: 'Acid Green', hex: '#a3e635' },
      { name: 'Carbon Black', hex: '#000000' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: true,
    stock: 30,
    reviews: []
  },
  {
    id: 'prod_20',
    name: 'MiniPod Pocket Sound Speaker',
    price: 29,
    oldPrice: 59,
    discount: 50,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop'
    ],
    category: 'airpods',
    description: 'Small size, monumental volume performance. Sleek cylindrical shell with robust passive alloy bass radiator disk. Plays up to 10 hours of rich acoustics on single charger.',
    viewsCount: 1140,
    likesCount: 95,
    ordersCount: 68,
    sizes: ['Standard'],
    colors: [
      { name: 'Ferrari Crimson', hex: '#dc2626' },
      { name: 'Charcoal Matte', hex: '#374151' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    stock: 45,
    reviews: []
  },
  {
    id: 'prod_21',
    name: 'Velriva SoundBar Mini Home Theater',
    price: 119,
    oldPrice: 240,
    discount: 50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop'
    ],
    category: 'airpods',
    description: 'Transform your small screen or computing desk into a spatial movie theater. Packs 4-driver arrays and dual bass sub-woofers inside a slim premium aluminum grill panel.',
    viewsCount: 2310,
    likesCount: 220,
    ordersCount: 91,
    sizes: ['Standard'],
    colors: [
      { name: 'Brushed Charcoal', hex: '#1f2937' }
    ],
    isFeatured: true,
    isTrending: false,
    isFlashSale: false,
    stock: 15,
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
    id: 'prod_22',
    name: 'Titan Titanium Rugged Smartwatch Pro',
    price: 139,
    oldPrice: 279,
    discount: 50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop'
    ],
    category: 'watches',
    description: 'Built for extreme adventures. Crafted from forged aerospace titanium Grade-5 alloy, offline compass mappings, up to 15 days active battery cycles, and high pressure double-gasket glass seal.',
    viewsCount: 4120,
    likesCount: 512,
    ordersCount: 198,
    sizes: ['46mm'],
    colors: [
      { name: 'Titanium Slate', hex: '#64748b' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 8,
    reviews: []
  },
  {
    id: 'prod_23',
    name: 'ChronoCurve Premium Leather Analogue',
    price: 99,
    oldPrice: 199,
    discount: 50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop'
    ],
    category: 'watches',
    description: 'Curated sophisticated statement watch. High quality genuine English leather wrist strap paired with a solid mechanical winding dial wheel. Sapphire crystal shield prevents scrapes.',
    viewsCount: 2250,
    likesCount: 174,
    ordersCount: 81,
    sizes: ['Standard'],
    colors: [
      { name: 'Saddle Tan', hex: '#b45309' },
      { name: 'Raven Black', hex: '#0f172a' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    stock: 16,
    reviews: []
  },
  {
    id: 'prod_24',
    name: 'FitPulse Sport Smart Bracelet',
    price: 39,
    oldPrice: 79,
    discount: 50,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop'
    ],
    category: 'watches',
    description: 'Minimal weight health companion. Continuous automatic caloric and activity tracing with responsive step metrics, incoming call warning vibrating buzzes, and water protection.',
    viewsCount: 1840,
    likesCount: 120,
    ordersCount: 95,
    sizes: ['One Size'],
    colors: [
      { name: 'Active Pink', hex: '#ec4899' },
      { name: 'Graphite', hex: '#1f2937' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: true,
    stock: 50,
    reviews: []
  },
  {
    id: 'prod_25',
    name: 'Velriva Classique Rose Gold Watch',
    price: 110,
    oldPrice: 220,
    discount: 50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&auto=format&fit=crop'
    ],
    category: 'watches',
    description: 'An outstanding luxury companion for formal meetings or wedding evenings. Polished rose-gold metallic mesh band and minimalist hour pointers create unmatched sophistication.',
    viewsCount: 2910,
    likesCount: 310,
    ordersCount: 124,
    sizes: ['Standard'],
    colors: [
      { name: 'Rose Gold', hex: '#fda4af' }
    ],
    isFeatured: true,
    isTrending: false,
    isFlashSale: false,
    stock: 9,
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
  },
  {
    id: 'prod_26',
    name: 'Oceano Blue Intense Fresh Perfume',
    price: 85,
    oldPrice: 169,
    discount: 50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop'
    ],
    category: 'perfume',
    description: 'A breath of frozen high-tide ocean. Delicately calibrated lavender leaf, sea-mist salt signatures, and refreshing white grapefruit zest base notes. Gives unmatched daytime energy.',
    viewsCount: 2890,
    likesCount: 241,
    ordersCount: 134,
    sizes: ['100ml'],
    colors: [
      { name: 'Sea Marine', hex: '#60a5fa' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 25,
    reviews: []
  },
  {
    id: 'prod_27',
    name: 'Mystic Rose Saffron Luxury EDP',
    price: 120,
    oldPrice: 240,
    discount: 50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop'
    ],
    category: 'perfume',
    description: 'An elegant oriental secret. Opens with Damascus rose bouquets paired with spicy organic cashmere saffron strands, transitioning smoothly to smoldering warm sandalwood logs.',
    viewsCount: 1980,
    likesCount: 189,
    ordersCount: 74,
    sizes: ['50ml', '100ml'],
    colors: [
      { name: 'Saffron Maroon', hex: '#991b1b' }
    ],
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    stock: 10,
    reviews: []
  },
  {
    id: 'prod_28',
    name: 'Santal Gold Luxury Cedar EDP',
    price: 105,
    oldPrice: 210,
    discount: 50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop'
    ],
    category: 'perfume',
    description: 'Commanding charisma. Packs layers of deep Texas dry cedarwood, leather hide essence, and warm tobacco flower extract. An absolute compliment-gatherer with extreme performance projection.',
    viewsCount: 3100,
    likesCount: 412,
    ordersCount: 210,
    sizes: ['100ml'],
    colors: [
      { name: 'Amber Glow', hex: '#ca8a04' }
    ],
    isFeatured: true,
    isTrending: true,
    isFlashSale: false,
    stock: 14,
    reviews: []
  }
];
