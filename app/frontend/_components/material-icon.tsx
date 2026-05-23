import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaAward,
  FaBars,
  FaBell,
  FaBrain,
  FaBug,
  FaBullhorn,
  FaCalendarDays,
  FaChartColumn,
  FaChartSimple,
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaCircleCheck,
  FaCircleInfo,
  FaCircleQuestion,
  FaCloud,
  FaCode,
  FaCompassDrafting,
  FaCopy,
  FaDownload,
  FaEllipsis,
  FaEye,
  FaFileLines,
  FaGear,
  FaGraduationCap,
  FaListCheck,
  FaLock,
  FaMagnifyingGlass,
  FaMoon,
  FaPenRuler,
  FaQrcode,
  FaShareNodes,
  FaShieldHalved,
  FaSun,
  FaTableCellsLarge,
  FaTerminal,
  FaTrophy,
  FaUpload,
  FaUser,
  FaUsers,
  FaUserShield,
  FaWallet,
} from "react-icons/fa6";
import { HiBuildingLibrary, HiOutlineBuildingOffice2 } from "react-icons/hi2";

type MaterialIconProps = {
  children: string;
  filled?: boolean;
  className?: string;
  style?: CSSProperties;
};

const iconMap: Record<string, IconType> = {
  account_balance: HiBuildingLibrary,
  architecture: FaCompassDrafting,
  arrow_back: FaArrowLeft,
  arrow_downward: FaArrowDown,
  arrow_forward: FaArrowRight,
  arrow_upward: FaArrowUp,
  bug_report: FaBug,
  calendar_month: FaCalendarDays,
  campaign: FaBullhorn,
  check: FaCheck,
  check_circle: FaCircleCheck,
  checklist: FaListCheck,
  chevron_right: FaChevronRight,
  cloud_sync: FaCloud,
  code: FaCode,
  content_copy: FaCopy,
  dashboard: FaTableCellsLarge,
  design_services: FaPenRuler,
  description: FaFileLines,
  domain: HiOutlineBuildingOffice2,
  download: FaDownload,
  expand_more: FaChevronDown,
  groups: FaUsers,
  help: FaCircleQuestion,
  info: FaCircleInfo,
  insights: FaChartColumn,
  light_mode: FaSun,
  lock: FaLock,
  menu: FaBars,
  military_tech: FaTrophy,
  monitoring: FaChartSimple,
  more_horiz: FaEllipsis,
  notifications: FaBell,
  payments: FaWallet,
  person: FaUser,
  psychology: FaBrain,
  qr_code_2: FaQrcode,
  school: FaGraduationCap,
  search: FaMagnifyingGlass,
  security: FaUserShield,
  settings: FaGear,
  share: FaShareNodes,
  terminal: FaTerminal,
  upload: FaUpload,
  upload_file: FaUpload,
  verified: FaShieldHalved,
  verified_user: FaUserShield,
  visibility: FaEye,
  workspace_premium: FaAward,
  dark_mode: FaMoon,
};

export function MaterialIcon({
  children,
  className,
  style,
}: MaterialIconProps) {
  const Icon = iconMap[children] ?? FaCircleQuestion;

  return (
    <Icon
      aria-hidden="true"
      style={style}
      className={["fp-icon", className ?? ""].filter(Boolean).join(" ")}
    />
  );
}
