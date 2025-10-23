import React from 'react';
import Icon from './Icon';
import { ICONS } from '../utils/icons';

export const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 group hover:bg-gray-50 px-2 rounded-lg transition-colors">
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
        <button className="text-gray-400 hover:text-blue-600 transition hover:scale-105 opacity-0 group-hover:opacity-100">
            <Icon path={ICONS.pencil} />
        </button>
    </div>
);

export const PaymentMethod = ({ icon, title, detail, brandIcon, brand }) => (
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
        <div className="flex items-center gap-4">
            <div className="text-blue-600 bg-blue-50 p-2 rounded-full">{icon}</div>
            <div>
                <p className="font-semibold text-gray-800">{title}</p>
                <p className="text-sm text-gray-500">{detail}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="text-gray-400 transition hover:scale-105 hover:text-red-600 opacity-0 group-hover:opacity-100">
                <Icon path={ICONS.trash} />
            </button>
            {brandIcon && <div className="text-gray-500">{brandIcon}</div>}
        </div>
    </div>
);