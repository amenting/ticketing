
/* Chrome: type 'thisisunsafe' to bypass security warning */
import Link from 'next/link';

const OrderIndex = ({currentUser, orders}) => {
    return <ul> 
        {orders.map( order => {
            return <li key={order.id}>
                {order.ticket.title} - {order.status}
                    <Link href="/tickets/[ticketId]" as={`/tickets/${order.ticket.id}`}>
                        <a>View Ticket</a>
                    </Link>
            </li>
        })}
    </ul>;
}

OrderIndex.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/orders');

    return { orders: data};
};

export default OrderIndex;