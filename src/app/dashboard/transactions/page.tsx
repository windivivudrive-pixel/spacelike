import { createClient } from '@/lib/supabase/server';
import TransactionsClient from './TransactionsClient';

export default async function TransactionHistoryPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    let transactions: any[] = [];
    let orders: any[] = [];

    if (session?.user?.id) {
        // Fetch Deposits / Transactions
        const { data: txData, error: txError } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (!txError && txData) {
            transactions = txData;
        } else {
            console.error('Error fetching transactions:', txError);
        }

        // Fetch SMM Orders
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*, services(name)')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (!orderError && orderData) {
            orders = orderData;
        } else {
            console.error('Error fetching orders:', orderError);
        }
    }

    return (
        <TransactionsClient
            initialTransactions={transactions}
            initialOrders={orders}
        />
    );
}
