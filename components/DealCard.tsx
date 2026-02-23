import React from 'react';

interface DealCardProps {
    title: string;
    amount: number;
    status: string;
    onClick: () => void;
}

const DealCard = ({ title, amount, status, onClick }: DealCardProps) => {
    return (
        <div className="card" onClick={onClick}>
            <h2>{title}</h2>
            <p><strong>Amount:</strong> ${amount.toLocaleString()}</p>
            <p><strong>Status:</strong> {status}</p>
        </div>
    );
};

export default DealCard;