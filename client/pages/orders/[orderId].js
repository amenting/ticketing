
import { useEffect, useState } from 'react';

const OrderShow = ({order}) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(()=>{
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    return <div>
        <h1>{order.ticket.title}</h1>
        <h4>Price: {order.ticket.price}</h4>
        <h4>Time left to pay: {timeLeft} seconds</h4>
    </div>
};

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order: data};
};
export default OrderShow;