import TradeEntryForm from '../../../components/trades/TradeEntryForm';
export default function NewTradePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">New Trade Entry</h1>
      <TradeEntryForm />
    </div>
  );
}
