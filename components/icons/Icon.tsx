

import React from 'react';

const Icon: React.FC<{ path: string, className?: string }> = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

// FIX: Added className prop to all icon components to allow for custom styling.
type IconProps = { className?: string };

export const DashboardIcon: React.FC<IconProps> = ({ className }) => <Icon path="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" className={className} />;
export const CrimeIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" className={className} />;
export const RoadIcon: React.FC<IconProps> = ({ className }) => <Icon path="M18 4h-3v2h3v2h-2v2h2v2h-3v2h3v4h-5v-2h-2v2H4v-4h3v-2H4v-2h2V8H4V6h3V4H2v16h20V4z" className={className} />;
export const PoliceIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" className={className} />;
export const TransportIcon: React.FC<IconProps> = ({ className }) => <Icon path="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3-5H6V6h9v7z" className={className} />;
export const LogisticsIcon: React.FC<IconProps> = ({ className }) => <Icon path="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" className={className} />;
export const UsersIcon: React.FC<IconProps> = ({ className }) => <Icon path="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" className={className} />;
export const ReportsIcon: React.FC<IconProps> = ({ className }) => <Icon path="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" className={className} />;
export const LogoutIcon: React.FC<IconProps> = ({ className }) => <Icon path="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" className={className} />;
export const MenuIcon: React.FC<IconProps> = ({ className }) => <Icon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" className={className} />;
export const CloseIcon: React.FC<IconProps> = ({ className }) => <Icon path="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" className={className} />;
export const SecurityIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" className={className} />;
export const EditIcon: React.FC<IconProps> = ({ className }) => <Icon path="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" className={className} />;
export const DeleteIcon: React.FC<IconProps> = ({ className }) => <Icon path="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" className={className} />;
export const AddIcon: React.FC<IconProps> = ({ className }) => <Icon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" className={className} />;
export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => <Icon path="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" className={className} />;
export const ChevronUpIcon: React.FC<IconProps> = ({ className }) => <Icon path="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" className={className} />;
export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => <Icon path="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" className={className} />;
export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => <Icon path="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" className={className} />;
export const SuccessIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" className={className} />;
export const ErrorIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" className={className} />;
export const InfoIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" className={className} />;
export const DatabaseIcon: React.FC<IconProps> = ({ className }) => <Icon path="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2z" className={className} />;
export const SunIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.64 5.64c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.64 2.81c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l1.41 1.42zm12.72 12.72c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.41-1.42c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l1.41 1.42zM4.22 18.36c.39.39 1.02.39 1.41 0L18.36 5.64c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0L4.22 16.95c-.39.39-.39 1.02 0 1.41z" className={className} />;
export const MoonIcon: React.FC<IconProps> = ({ className }) => <Icon path="M10 2c-1.1 0-2.11.25-3.03.7-1.1.55-2.05 1.33-2.73 2.25A7.493 7.493 0 002 10c0 4.14 3.36 7.5 7.5 7.5 2.05 0 3.91-.81 5.27-2.14.93-.9.16-2.17.43-3.27.22-.92.51-1.83.9-2.71C17.29 7.98 17.5 6.9 17.5 5.75c0-1.9-1.09-3.5-2.68-4.42C13.63 2.5 11.88 2 10 2z" className={className} />;
export const DocumentIcon: React.FC<IconProps> = ({ className }) => <Icon path="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" className={className} />;
export const FolderIcon: React.FC<IconProps> = ({ className }) => <Icon path="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" className={className} />;
export const HomeIcon: React.FC<IconProps> = ({ className }) => <Icon path="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" className={className} />;
export const UserCircleIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 5c-1.6-1.5-4.4-2-6-2s-4.4.5-6 2v1h12v-1z" className={className} />;
export const SinistralidadeIcon: React.FC<IconProps> = ({ className }) => <Icon path="M6 5h3v14H6zm4.5 0h3v6h-3zm0 8h3v6h-3zm4.5-8h3v14h-3z" className={className} />;


// New Icons for Form Tabs
export const OcorrenciaIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" className={className} />;
export const MoreIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" className={className} />;
export const AccidentIcon: React.FC<IconProps> = ({ className }) => <Icon path="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z" className={className} />;
export const VictimIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" className={className} />;
export const OperationIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" className={className} />;
export const PatrolIcon: React.FC<IconProps> = ({ className }) => <Icon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" className={className} />;
export const DetainedIcon: React.FC<IconProps> = ({ className }) => <Icon path="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" className={className} />;
export const MunicipalityIcon: React.FC<IconProps> = ({ className }) => <Icon path="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" className={className} />;
export const MembersIcon: React.FC<IconProps> = ({ className }) => <Icon path="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" className={className} />;
export const MaintenanceIcon: React.FC<IconProps> = ({ className }) => <Icon path="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6l-4 4L2 7l1.4-1.4c1.2-1.2 3.1-1.8 5-1.5 2.7.4 4.9 2.6 5.3 5.3.3 1.9-.3 3.8-1.5 5l-1.4 1.4 4-4 4.1 4.1-1.3 1.3L21.3 22l1.4-1.4-1.4-1.4L22.7 19z" className={className} />;
export const ArmamentIcon: React.FC<IconProps> = ({ className }) => <Icon path="M5 21V8h2v2h4V8h2v2h4V8h2v13H5zM3 7V4h18v3H3z" className={className} />;
export const ProvisionsIcon: React.FC<IconProps> = ({ className }) => <Icon path="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1zM7 9h10v2H7zm0 4h10v2H7z" className={className} />;
export const ClothingIcon: React.FC<IconProps> = ({ className }) => <Icon path="M9 3v1h6V3h2v1h1c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h1V3h2zm10 4H5v11h14V7z" className={className} />;