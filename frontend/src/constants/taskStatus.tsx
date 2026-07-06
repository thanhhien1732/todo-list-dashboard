import type { ReactNode } from 'react';
import { Sparkles, ClipboardList, Clock, Eye, PauseCircle, CheckCircle, Lock, XCircle } from 'lucide-react';
import type { TaskStatus } from '../types';

export interface StatusOption {
    value: TaskStatus;
    label: string;
    icon: ReactNode;
    colorClass: string;
}

export const STATUS_LIST: StatusOption[] = [
    { value: 'NEW', label: 'Mới tạo', icon: <Sparkles size={14} />, colorClass: 'bg-gray-200 text-gray-700 hover:bg-gray-300 ' },
    { value: 'TODO', label: 'Cần làm', icon: <ClipboardList size={14} />, colorClass: 'bg-purple-200 text-purple-800 hover:bg-purple-300' },
    { value: 'IN_PROGRESS', label: 'Đang xử lý', icon: <Clock size={14} />, colorClass: 'bg-blue-200 text-blue-800 hover:bg-blue-300' },
    { value: 'IN_REVIEW', label: 'Đang đánh giá', icon: <Eye size={14} />, colorClass: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' },
    { value: 'ON_HOLD', label: 'Tạm dừng', icon: <PauseCircle size={14} />, colorClass: 'bg-orange-200 text-orange-800 hover:bg-orange-300' },
    { value: 'COMPLETED', label: 'Hoàn thành', icon: <CheckCircle size={14} />, colorClass: 'bg-teal-100 text-teal-800 hover:bg-teal-200' },
    { value: 'CLOSED', label: 'Đã đóng', icon: <Lock size={14} />, colorClass: 'bg-slate-300 text-slate-800 hover:bg-slate-400' },
    { value: 'CANCELLED', label: 'Đã hủy', icon: <XCircle size={14} />, colorClass: 'bg-red-200 text-red-800 hover:bg-red-300' },
];

export const getStatusOption = (status?: TaskStatus | string) =>
    STATUS_LIST.find((item) => item.value === status) ?? STATUS_LIST[0];
