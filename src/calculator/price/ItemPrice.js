import '../Calculator.scss';

const ItemPrice = ({ layout }) => {

    const aggregatedLayout = layout.reduce((acc, item) => {
        const existingItem = acc.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.price += item.price;
            existingItem.count += 1; // Zähler erhöhen
        } else {
            acc.push({ ...item, count: 1 }); // Initial mit count: 1
        }
        return acc;
    }, []);

    const formatPrice = (price) => {
        return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
    };

    const totalPrice = aggregatedLayout.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="item-price-container">
            <h3>Price</h3>
            {aggregatedLayout.map((item, index) => (
                <div key={item.name} className="item-price-row">
                    <span className='item-name'>{item.count}x {item.name}</span>
                    <span className='item-price'>{formatPrice(item.price)}</span>
                </div>
            ))}
            <p className='line'>_______</p>
            <div className="item-price-row total-price">
                <p>Total</p>
                <span>{formatPrice(totalPrice)}</span>
            </div>
        </div>
    );
};

export default ItemPrice;