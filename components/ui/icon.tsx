import { IconActivity as Activity, IconRosetteDiscountCheck as BadgeCheck, IconBatteryCharging as BatteryCharging, IconRobot as Bot, IconCalculator as Calculator, IconCamera as Camera, IconCar as Car, IconCheck as Check, IconClock as Clock, IconSettings as Cog, IconFileText as FileText, IconGasStation as Fuel, IconGauge as Gauge, IconGavel as Gavel, IconHeadset as Headset, IconHeart as Heart, IconHome as House, IconBuildingBank as Landmark, IconLayoutGrid as LayoutGrid, IconLock as Lock, IconMapPin as MapPin, IconMessageCircle as MessageCircle, IconRotate3d as Rotate3d, IconBarcode as ScanBarcode, IconScan as ScanEye, IconShare as Share2, IconShieldCheck as ShieldCheck, IconShieldHalf as ShieldHalf, IconShoppingBag as ShoppingBag, IconShoppingCart as ShoppingCart, IconSparkles as Sparkles, IconStar as Star, IconBuildingStore as Store, IconTrendingUp as TrendingUp, IconTruck as Truck, IconUser as User, IconUsers as Users, IconTool as Wrench, IconBolt as Zap, type IconProps as TablerProps } from "@tabler/icons-react";

const ICONS = {
  activity: Activity,
  "badge-check": BadgeCheck,
  "battery-charging": BatteryCharging,
  bot: Bot,
  calculator: Calculator,
  camera: Camera,
  check: Check,
  clock: Clock,
  "file-text": FileText,
  fuel: Fuel,
  gauge: Gauge,
  heart: Heart,
  "layout-grid": LayoutGrid,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  "rotate-3d": Rotate3d,
  "scan-barcode": ScanBarcode,
  "scan-eye": ScanEye,
  "share-2": Share2,
  star: Star,
  store: Store,
  cog: Cog,
  user: User,
  "trending-up": TrendingUp,
  wrench: Wrench,
  car: Car,
  gavel: Gavel,
  headset: Headset,
  house: House,
  landmark: Landmark,
  lock: Lock,
  "shield-check": ShieldCheck,
  "shield-half": ShieldHalf,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  sparkles: Sparkles,
  truck: Truck,
  users: Users,
  zap: Zap,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, ...props }: { name: IconName } & TablerProps) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component {...props} />;
}
