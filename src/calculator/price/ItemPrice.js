import React, { useState, useEffect } from 'react';
import '../Calculator.scss';

const ItemPrice = ({ layout }) => {

    const aggregatedLayout = layout.reduce((acc, item) => {
        const existingItem = acc.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.price += item.price;
        } else {
            acc.push({ ...item });
        }
        return acc;
    }, []);

    return (
        <div className="item-price-container">
            <h3>Price</h3>
            {aggregatedLayout.map((item, index) => (
                <div key={item.name} className="item-price-row">
                    <span>{item.name} </span>
                    <span>{item.price}</span>
                </div>
            ))}
        </div>
    );
}

export default ItemPrice;