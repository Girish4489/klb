'use client';
import {
  AcademicCapIcon as AcademicCapOutline,
  AdjustmentsHorizontalIcon as AdjustmentsHorizontalOutline,
  AdjustmentsVerticalIcon as AdjustmentsVerticalOutline,
  ArchiveBoxIcon as ArchiveBoxOutline,
  ArrowDownCircleIcon as ArrowDownCircleOutline,
  ArrowPathIcon as ArrowPathOutline,
  BeakerIcon as BeakerOutline,
  BriefcaseIcon as BriefcaseOutline,
  CheckBadgeIcon as CheckBadgeOutline,
  CheckCircleIcon as CheckCircleOutline,
  CloudArrowDownIcon as CloudArrowDownOutline,
  CloudArrowUpIcon as CloudArrowUpOutline,
  CubeIcon as CubeOutline,
  CurrencyRupeeIcon as CurrencyRupeeOutline,
  CursorArrowRippleIcon as CursorArrowRippleOutline,
  FireIcon as FireOutline,
  FolderArrowDownIcon as FolderArrowDownOutline,
  GiftIcon as GiftOutline,
  HomeIcon as HomeOutline,
  LinkIcon as LinkOutline,
  MapPinIcon as MapPinOutline,
  MegaphoneIcon as MegaphoneOutline,
  SparklesIcon as SparklesOutline,
} from '@heroicons/react/24/outline';

import {
  AcademicCapIcon as AcademicCapSolid,
  AdjustmentsHorizontalIcon as AdjustmentsHorizontalSolid,
  AdjustmentsVerticalIcon as AdjustmentsVerticalSolid,
  ArchiveBoxIcon as ArchiveBoxSolid,
  ArrowDownCircleIcon as ArrowDownCircleSolid,
  ArrowPathIcon as ArrowPathSolid,
  BeakerIcon as BeakerSolid,
  BriefcaseIcon as BriefcaseSolid,
  CheckBadgeIcon as CheckBadgeSolid,
  CheckCircleIcon as CheckCircleSolid,
  CloudArrowDownIcon as CloudArrowDownSolid,
  CloudArrowUpIcon as CloudArrowUpSolid,
  CubeIcon as CubeSolid,
  CurrencyRupeeIcon as CurrencyRupeeSolid,
  CursorArrowRippleIcon as CursorArrowRippleSolid,
  FireIcon as FireSolid,
  FolderArrowDownIcon as FolderArrowDownSolid,
  GiftIcon as GiftSolid,
  HomeIcon as HomeSolid,
  LinkIcon as LinkSolid,
  MapPinIcon as MapPinSolid,
  MegaphoneIcon as MegaphoneSolid,
  SparklesIcon as SparklesSolid,
} from '@heroicons/react/24/solid';

import React, { useEffect, useState } from 'react';

export interface PatternConfig {
  icon:
    | 'academicCap'
    | 'adjustmentsHorizontal'
    | 'adjustmentsVertical'
    | 'megaphone'
    | 'archiveBox'
    | 'checkBadge'
    | 'mixed';
  iconType?: 'outline' | 'solid';
  size: number;
  spacing: number;
  color: string;
  opacity?: number;
  rotate?: number;
  rounded?: boolean;
}

const getHeroIcon = (icon: PatternConfig['icon'], iconType: PatternConfig['iconType'], index: number = 0) => {
  const outlineIcons = [
    AcademicCapOutline,
    AdjustmentsHorizontalOutline,
    AdjustmentsVerticalOutline,
    MegaphoneOutline,
    ArchiveBoxOutline,
    ArrowDownCircleOutline,
    ArrowPathOutline,
    CursorArrowRippleOutline,
    CloudArrowDownOutline,
    CloudArrowUpOutline,
    FolderArrowDownOutline,
    CheckCircleOutline,
    SparklesOutline,
    GiftOutline,
    BeakerOutline,
    CheckBadgeOutline,
    CubeOutline,
    CurrencyRupeeOutline,
    FireOutline,
    HomeOutline,
    BriefcaseOutline,
    MapPinOutline,
    LinkOutline,
  ];

  const solidIcons = [
    AcademicCapSolid,
    AdjustmentsHorizontalSolid,
    AdjustmentsVerticalSolid,
    MegaphoneSolid,
    ArchiveBoxSolid,
    ArrowDownCircleSolid,
    ArrowPathSolid,
    CursorArrowRippleSolid,
    CloudArrowDownSolid,
    CloudArrowUpSolid,
    FolderArrowDownSolid,
    CheckCircleSolid,
    SparklesSolid,
    GiftSolid,
    BeakerSolid,
    CheckBadgeSolid,
    CubeSolid,
    CurrencyRupeeSolid,
    FireSolid,
    HomeSolid,
    BriefcaseSolid,
    MapPinSolid,
    LinkSolid,
  ];

  const icons = iconType === 'solid' ? solidIcons : outlineIcons;

  if (icon === 'mixed') {
    return icons[index % icons.length];
  }

  switch (icon) {
    case 'academicCap':
      return icons[0];
    case 'adjustmentsHorizontal':
      return icons[1];
    case 'adjustmentsVertical':
      return icons[2];
    case 'megaphone':
      return icons[3];
    case 'archiveBox':
      return icons[4];
    case 'checkBadge':
      return icons[15];
    default:
      return icons[0];
  }
};

export const defaultPattern: PatternConfig = {
  icon: 'mixed',
  iconType: 'solid',
  size: 20,
  spacing: 40,
  color: 'text-primary',
  opacity: 0.5,
  rotate: 0,
};

export default function PatternBackground({ config }: { config: PatternConfig }) {
  const [mounted, setMounted] = useState(false);
  const [iconCount, setIconCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const updateIconCount = () => {
      const count = Math.ceil((window.innerWidth * window.innerHeight) / (config.spacing * config.spacing));
      setIconCount(count);
    };
    updateIconCount();
    window.addEventListener('resize', updateIconCount);
    return () => window.removeEventListener('resize', updateIconCount);
  }, [config.spacing]);

  if (!mounted) return null;

  const { icon, iconType = 'outline', size, spacing, opacity = 0.3, rotate = 0 } = config;

  const iconStyle = {
    width: size,
    height: size,
    transform: `rotate(${rotate}deg)`,
  };

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" style={{ opacity }}>
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${spacing}px, 1fr))`,
          gridTemplateRows: `repeat(auto-fill, minmax(${spacing}px, 1fr))`,
        }}
      >
        {Array.from({ length: iconCount }).map((_, i) => {
          const Icon = getHeroIcon(icon, iconType, i);
          return (
            <div
              key={i}
              className={`flex items-center justify-center ${config.rounded ? 'rounded-full' : ''} ${config.color}`}
              style={{ width: spacing, height: spacing, overflow: 'hidden' }}
            >
              {React.createElement(Icon, { style: iconStyle })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
