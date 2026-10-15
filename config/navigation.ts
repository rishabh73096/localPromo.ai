import type { Role } from "@/config/auth";
import type { Feature } from "@/lib/plans";
import { IconCalendarEvent as CalendarDays, IconFileText as FileText, IconHome as House, IconLayoutDashboard as LayoutTemplate, IconSpeakerphone as Megaphone, IconPalette as Palette, IconRepeat as Repeat, IconSettings as Settings, IconShieldCheck as ShieldCheck, IconTag as Tag, IconUsers as Users, IconWallet as Wallet, IconWand as Wand2, type Icon as TablerIcon } from "@tabler/icons-react";

export interface NavItem {
  label: string;
  href: string;
  icon: TablerIcon;
  roles: Role[];
  gap?: boolean;
  /** Platform-admin only (the SaaS owner), not a workspace role. */
  admin?: boolean;
  /** Needs this plan feature; the item shows a lock when the plan lacks it. */
  feature?: Feature;
  keywords?: string[];
}

const ALL: Role[] = ["owner", "admin", "staff"];
const EVERYONE: Role[] = ["owner", "admin", "staff", "user"];
const MANAGERS: Role[] = ["owner", "admin"];

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", roles: ALL, href: "/dashboard", icon: House, keywords: "home overview campaigns drafts".split(" ") },
  { label: "Create Content", roles: ALL, href: "/create", icon: Wand2, keywords: "create captions generate hindi english poster".split(" ") },
  { label: "Campaigns", roles: ALL, href: "/campaigns", icon: Megaphone, keywords: "campaigns offers promotions".split(" ") },
  { label: "Saved Drafts", roles: ALL, href: "/drafts", icon: FileText, keywords: "drafts saved history poster".split(" ") },
  { label: "Templates", roles: ALL, href: "/templates", icon: LayoutTemplate, keywords: "templates salon gym cafe retail".split(" ") },
  { label: "Content Calendar", feature: "calendar", roles: ALL, href: "/calendar", icon: CalendarDays, keywords: "calendar schedule festival".split(" ") },
  { label: "Brand Profile", roles: MANAGERS, href: "/brand", icon: Palette, gap: true, keywords: "brand services prices tone address colour".split(" ") },
  { label: "Settings", roles: MANAGERS, href: "/settings", icon: Settings, keywords: "settings workspace usage plan".split(" ") },
  { label: "Overview", roles: EVERYONE, admin: true, href: "/admin", icon: ShieldCheck, keywords: "admin platform overview revenue".split(" ") },
  { label: "Payments", roles: EVERYONE, admin: true, href: "/admin/payments", icon: Wallet, keywords: "payments upi utr verify".split(" ") },
  { label: "Customers", roles: EVERYONE, admin: true, href: "/admin/customers", icon: Users, keywords: "customers users accounts".split(" ") },
  { label: "Subscriptions", roles: EVERYONE, admin: true, href: "/admin/subscriptions", icon: Repeat, keywords: "subscriptions renew expiring".split(" ") },
  { label: "Plans", roles: EVERYONE, admin: true, href: "/admin/plans", icon: Tag, keywords: "plans pricing upi".split(" ") },
];

export type NavArea = "workspace" | "admin";

// The customer workspace and the platform-admin console are separate areas with separate menus.
export const visibleNav = (role: Role, area: NavArea = "workspace") => NAV_ITEMS.filter((i) => (area === "admin" ? i.admin : !i.admin && i.roles.includes(role)));

export const navItemFor = (pathname: string) =>
  NAV_ITEMS.filter((i) => (i.href === "/" ? pathname === "/" : pathname === i.href || pathname.startsWith(`${i.href}/`))).sort((a, b) => b.href.length - a.href.length)[0];
