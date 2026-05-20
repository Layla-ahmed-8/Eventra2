import { Wallet } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  colorClass?: string;
}

export default function WalletBalanceBadge({ colorClass = 'text-purple-500' }: Props) {
  const { getWallet } = useAppStore();
  const wallet = getWallet();
  if (!wallet) return null;
  return (
    <div className={`flex items-center gap-1.5 text-micro font-bold ${colorClass}`}>
      <Wallet className="w-3.5 h-3.5" />
      <span>EGP {wallet.balance.toLocaleString()}</span>
    </div>
  );
}
