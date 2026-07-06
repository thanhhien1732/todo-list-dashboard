interface TrashPageHeaderProps {
    title?: string;
    description?: string;
}

export function TrashPageHeader({
    title = 'Thùng rác',
    description = 'Các công việc đã xóa sẽ tự động biến mất sau 30 ngày.',
}: TrashPageHeaderProps) {
    return (
        <div className="mb-6 px-1 md:px-0">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
    );
}
