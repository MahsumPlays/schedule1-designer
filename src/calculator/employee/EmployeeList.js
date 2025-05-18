import React from 'react';
import '../Calculator.scss';

const EmployeeList = ({ layout }) => {

    const botanistItems = ['Pot', 'Drying Rack'];
    const cleanerItems = ['Trash Can'];
    const chemistItems = ['Cauldron', 'Mixing Station 1', 'Mixing Station 2', 'Chemistry Station', 'Lab Oven'];

    const botanistAmount = () => {
        const count = layout.filter(item => botanistItems.includes(item.name)).length;
        return (count === 0 ? 0 : Math.ceil(count / 8));
      };
      const botanistDailyPrice = () => {
        return botanistAmount() === 0 ? 0 : (botanistAmount() * 200);
    };
    const botanistPrice = () => {
        return (botanistAmount() === 0 ? 0 : (botanistAmount() * 1500));
    };

    const formatPrice = (price) => {
        return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
    };

    const chemistAmount = () => {
        const count = layout.filter(item => chemistItems.includes(item.name)).length;
        return (count === 0 ? 0 : Math.ceil(count / 4));
      };
      const chemistDailyPrice = () => {
        return chemistAmount() === 0 ? 0 : (chemistAmount() * 300);
    };
    
    const chemistPrice = () => {
        return (chemistAmount() === 0 ? 0 : (chemistAmount() * 2000));
    };

    const cleanerAmount = () => {
        const count = layout.filter(item => cleanerItems.includes(item.name)).length;
        return (count === 0 ? 0 : Math.ceil(count / 3));
      };
      const cleanerDailyPrice = () => {
        return cleanerAmount() === 0 ? 0 : (cleanerAmount() * 100);
    };
    
    const cleanerPrice = () => {
        return (cleanerAmount() ===  0 ? 0 :(cleanerAmount() * 1000));
    };

    const totalDailyPrice = () => {
        return ((botanistDailyPrice() + chemistDailyPrice() + cleanerDailyPrice()));
    }

    const totalPrice = () => {
        return ((botanistPrice() + chemistPrice() + cleanerPrice()));
    }
    return(
        <div className="employee-list-container">
            <h3>Employee List</h3>
            {botanistAmount() > 0 && (
                <div className='employee-list-row'>
                    <p>{botanistAmount()}x Botanist</p>
                    <div className='employee-list-price'>
                        <p>{formatPrice(botanistDailyPrice())} / day</p>
                        <p>{formatPrice(botanistPrice())}</p>
                    </div>
                </div>
            )}
            {chemistAmount() > 0 && (
                <div className='employee-list-row'>
                    <p>{chemistAmount()}x Chemist</p>
                    <div className='employee-list-price'>
                        <p>{formatPrice(chemistDailyPrice())} / day</p>
                        <p>{formatPrice(chemistPrice())}</p>
                    </div>
                </div>
            )}
            {cleanerAmount() > 0 && (
                <div className='employee-list-row'>
                    <p>{cleanerAmount()}x Cleaner</p>
                    <div className='employee-list-price'>
                        <p>{formatPrice(cleanerDailyPrice())} / day</p>
                        <p>{formatPrice(cleanerPrice())}</p>
                    </div>
                </div>
            )}
            <p className='line'>_______</p>
            <div className="item-price-row total-price">
                <p>Total</p>
                {totalDailyPrice() <= 0 ? (
                    <span>{formatPrice(0)}</span>
                ) : (
                    <div className='employee-total-price'>
                        <span>{formatPrice(totalDailyPrice())} / day</span>
                        <span>{formatPrice(totalPrice())}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeList;